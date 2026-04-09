import axios from "axios";
import { toast } from "sonner";
import { useState, useMemo, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";

import { validateFormLogic } from "../utils/checkoutValidation";
import CheckoutInput from "../components/checkout/CheckoutInput";
import CartItem from "../components/checkout/CartItem";
import { prepareOrderPayload } from "../utils/checkoutUtils";
// PAYPAL
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const refTop = useRef(null);

  //dati spedizione
  const shippingFee = 7.9;
  const shippingFreeSpend = 60.0;

  //stato carello da context
  const { cart, setCart } = useContext(CartContext);

  //funzione aumento quantità
  async function plusOne(item) {
    try {
      // Controllo disponibilità a magazzino prima di incrementare
      const response = await axios.get(
        `http://localhost:3000/vini/${item.slug}`
      );
      const wine = response.data?.result;

      if (!wine) return;

      //notifica quantità esaurite
      if (item.quantity >= wine.stock_quantity) {
        toast.warning("Scorte esaurite", {
          description: `Non ci sono altre bottiglie di ${item.name} disponibili.`,
        });
        return;
      }

      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
      // Toast di aggiunta quantità vino
      toast.success("Quantità aumentata", {
        description: `Hai aggiunto un'altra bottiglia di ${item.name}`,
        duration: 1500,
      });
    } catch (err) {
      console.error("Errore nel recupero dello stock:", err);
    }
  }

  //funzione diminuzione quantità
  function minusOne(item) {
    if (item.quantity <= 1) {
      removeItem(item);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
    );
    //Toast di riduzione quantità vino
    toast.info("Quantità ridotta", {
      description: `Hai ridotto a ${item.quantity - 1} unità di ${item.name}`,
      duration: 1500,
    });
  }

  //funzione per eliminare vino
  function removeItem(item) {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== item.id)
    );

    toast.error("Rimosso dal carrello", {
      description: `${item.name} non è più nel carrello`,
      duration: 5000,
      action: {
        label: "Annulla",
        onClick: () => {
          restoreItem(item);
          toast.success("Ripristinato!", {
            description: `${item.name} è di nuovo nel carrello`,
            duration: 2000,
          });
        },
      },
    });
  }

  //stato dati da inviare al server
  const [formData, setFormData] = useState({
    customer: {
      first_name: "",
      second_name: "",
      email: "",
      cellphone: "",
      billing_street: "",
      billing_city: "",
      billing_postal_code: "",
      billing_country: "Italia",
      shipping_street: "",
      shipping_city: "",
      shipping_postal_code: "",
      shpping_country: "Italia",
    },
    discount_code: "",
  });

  //stato per checkbox indirizzo spedizione diverso
  const [sameAsBilling, setSameAsBilling] = useState(true);

  //stato per loading
  const [isLoading, setIsLoading] = useState(false);

  //stati per coupon
  const [couponDetails, setCouponDetails] = useState({
    isValid: false,
    discountValue: 0,
    message: "",
  });
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  //VALIDAZIONE INPUT
  //stato per validazione input
  const [invalidFields, setInvalidFields] = useState({
    first_name: { isInvalid: false, reason: "" },
    second_name: { isInvalid: false, reason: "" },
    email: { isInvalid: false, reason: "" },
    cellphone: { isInvalid: false, reason: "" },
    billing_street: { isInvalid: false, reason: "" },
    billing_city: { isInvalid: false, reason: "" },
    billing_postal_code: { isInvalid: false, reason: "" },
    shipping_street: { isInvalid: false, reason: "" },
    shipping_city: { isInvalid: false, reason: "" },
    shipping_postal_code: { isInvalid: false, reason: "" },
  });

  //funzione checkbox indirizzo di spedizione
  const handleCheckboxChange = () => {
    const nextValue = !sameAsBilling;
    setSameAsBilling(nextValue);

    if (!nextValue) {
      // Se apro la tendina, svuoto i campi di spedizione così la validazione li "vede" come errori
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          shipping_street: "",
          shipping_city: "",
          shipping_postal_code: "",
        },
      }));
    } else {
      // Se la chiudo, risincronizzo
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          shipping_street: prev.customer.billing_street,
          shipping_city: prev.customer.billing_city,
          shipping_postal_code: prev.customer.billing_postal_code,
        },
      }));
    }
  };

  //funzione di validazione
  function validateForm() {
    //validazione campi
    const newInvalid = validateFormLogic(formData, sameAsBilling);

    setInvalidFields(newInvalid);

    // ritorna true se NON ci sono campi invalidi:
    // Object.values prende i valori di newInvalid e li mette in stringa
    // Some ci dice se almeno un valore è invalido(true)
    return !Object.values(newInvalid).some((field) => field.isInvalid);
  }

  //PREZZO TOTALE e COUPON
  //calcolo il prezzo da usare, se promo o meno
  const getItemPrice = (item) =>
    item.promotion_price !== null ? item.promotion_price : item.price;

  // funzione per validare il coupon
  const applyCoupon = async () => {
    //prendo il codice sconto dal form
    const code = formData.discount_code.trim();

    if (!code) {
      toast.error("Inserisci un codice prima di applicare");
      return;
    }
    //disabilito bottone applica mentre carica
    setIsCheckingCoupon(true);

    try {
      //check su server validità coupon
      const response = await axios.post(
        "http://localhost:3000/ordini/validate-coupon",
        {
          discount_code: code,
          total_amount: subtotal,
        }
      );

      if (response.data.success) {
        setCouponDetails({
          isValid: true,
          discountValue: parseFloat(response.data.coupon.discount_value),
          message: response.data.message,
        });
      }
    } catch (error) {
      setCouponDetails({
        isValid: false,
        discountValue: 0,
        message: error.response?.data?.message || "Codice non valido",
      });
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  //controllo su cambio carrello con reset del campo coupon
  useEffect(() => {
    // reset dello stato coupon
    setCouponDetails({
      isValid: false,
      discountValue: 0,
      message: "",
    });

    // reset del campo di testo dell'input nel formData
    setFormData((prev) => ({
      ...prev,
      discount_code: "", //cancella il codice scritto dall'utente
    }));
  }, [cart]);

  //calcolo il subtotale della somma dei prezzi dei prodotti considerando le quantità (useMemo serve per memorizzare il calcolo e farlo dipendere solo da cart)
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + getItemPrice(item) * item.quantity,
      0
    );
  }, [cart]); //array delle dipendenze di useMemo

  // calcolo sconto
  const discountAmount = useMemo(() => {
    return couponDetails.isValid ? subtotal * couponDetails.discountValue : 0;
  }, [subtotal, couponDetails]);

  //COSTI SPEDIZIONE
  //definiamo costi di spedizione
  const shippingCost =
    subtotal - discountAmount >= shippingFreeSpend ? 0 : shippingFee;
  const totalWithShipping = subtotal - discountAmount + shippingCost;

  //FUNZIONE LETTURA FORM e gestione sincronizzazione dei cambi billing e shipping
  const handleChange = (e) => {
    const { name, value } = e.target;

    const sanitizedValue = value.trimStart(); //evita spazi iniziali vuoti

    if (name === "discount_code") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.trim().toUpperCase(),
      }));
    }
    //rimozione errore(bordo rosso) quando viene sistemato
    if (invalidFields[name]?.isInvalid) {
      setInvalidFields((prev) => ({
        ...prev,
        [name]: { isInvalid: false, reason: "" },
      }));
    }

    setFormData((prev) => {
      //copio i dati del cliente
      const newCustomer = { ...prev.customer, [name]: sanitizedValue };

      // Sincronizzazione automatica se la checkbox è attiva
      //se la checkbox 'stesso indirizzo' è attiva e il campo compilato inzia(startsWith) con billing (per escludere i campi da non sincronizzare)
      if (sameAsBilling && name.startsWith("billing_")) {
        //sostituisco billing con shipping per riempire entrambi i campi da inviare al server
        const shippingKey = name.replace("billing_", "shipping_");

        //rimozione errore(bordo rosso) quando viene sistemato
        if (invalidFields[shippingKey]?.isInvalid) {
          setInvalidFields((prevErrors) => ({
            ...prevErrors,
            [shippingKey]: { isInvalid: false, reason: "" },
          }));
        }
        //inserisco i dati sull'indirizzo nei dati cliente
        newCustomer[shippingKey] = sanitizedValue;
      }
      //ritorno i dati dell'ordine e i nuovi dati del cliente
      return { ...prev, customer: newCustomer };
    });
  };

  //FUNZIONE SUBMIT DEL FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    //notifica carrello vuoto
    if (cart.length === 0) {
      toast.error("Attenzione", {
        description:
          "Il tuo carrello è vuoto. Aggiungi almeno un vino per procedere!",
        duration: 4000,
      });
      return; // Blocca l'invio del form
    }

    // Validazione dati
    const isValid = validateForm();

    //se il form non è valido fermo il submit + notifica campi non validi
    if (!isValid) {
      //se il form non è valido ritorno all'inizio della pagina
      refTop.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      toast.error("Dati incompleti", {
        description:
          "Controlla i campi evidenziati in rosso tra le informazioni di consegna",
        duration: 4000,
      });
      return;
    }
    setIsLoading(true);

    //creiamo il payload da inviare al server
    const payload = prepareOrderPayload(formData, cart);

    try {
      const response = await axios.post(
        "http://localhost:3000/ordini",
        payload
      );

      // se la chiamata è andata a buon fine
      if (response.data.success) {
        //prendo dati prezzo dal server
        const orderSummary = response.data.order_summary;
        console.log("Ordine creato con successo!", response.data.order_summary);

        //svuoto il carrello
        setCart([]);

        //vado alla pagina di conferma ordine
        navigate("/conferma-ordine", {
          state: {
            orderInfo: orderSummary,
            customerName: `${payload.customer.first_name} ${payload.customer.second_name}`,
            customerData: payload.customer,
            cartItems: [...cart],
            discountCode: formData.discount_code,
          },
        });
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Errore durante l'ordine";

      //gestione errori coupon (no toast)
      if (
        backendMessage.toLowerCase().includes("coupon") ||
        backendMessage.toLowerCase().includes("sconto")
      ) {
        setCouponDetails((prev) => ({
          ...prev,
          isValid: false,
          message: backendMessage,
        }));
      }

      // gestione errori generici
      else {
        toast.error("Non è stato possibile completare l'ordine", {
          description: backendMessage,
          duration: 5000,
        });
      }
      console.error("Dettaglio Errore:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Ripristina l'item rimosso creando un nuovo array con gli elementi precedenti più l'item da ripristinare in fondo
  function restoreItem(item) {
    setCart((prevCart) => [...prevCart, item]);
  }
  return (
    <>
      {/* LOADING */}
      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 9999 }}
        >
          <div
            className="spinner-border text-dark"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <h5 className="mt-3 fw-bold text-uppercase">
            Conferma ordine WineGuys in corso...
          </h5>
        </div>
      )}
      {/* BOTTONE TORNA INDIETRO */}
      <div
        className="container py-3"
        style={{ maxWidth: "1100px" }}
        ref={refTop}
      >
        <div className="mb-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link text-decoration-none text-dark p-0 d-flex align-items-center"
            style={{ fontSize: "0.75rem" }}
            type="button"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Torna indietro
          </button>
        </div>
        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="row g-5">
            {/* Dati cliente */}
            <div className="col-lg-7">
              <h2 className="h4 mb-3 fw-bold">Informazioni di Consegna</h2>
              <section className="mb-4">
                <h6 className="text-uppercase small fw-bold text-muted mb-3">
                  Contatti
                </h6>
                <div className="row g-3">
                  <CheckoutInput
                    col="6"
                    name="first_name"
                    placeholder="Nome"
                    invalidField={invalidFields.first_name}
                    onChange={handleChange}
                  />
                  <CheckoutInput
                    col="6"
                    name="second_name"
                    placeholder="Cognome"
                    invalidField={invalidFields.second_name}
                    onChange={handleChange}
                  />
                  <CheckoutInput
                    col="8"
                    name="email"
                    type="email"
                    placeholder="Email"
                    invalidField={invalidFields.email}
                    onChange={handleChange}
                  />
                  <CheckoutInput
                    col="4"
                    name="cellphone"
                    type="tel"
                    placeholder="Cellulare"
                    invalidField={invalidFields.cellphone}
                    onChange={handleChange}
                  />
                </div>
              </section>
              <section className="mb-4">
                <h6 className="text-uppercase small fw-bold text-muted mb-3">
                  Indirizzo di Fatturazione
                </h6>
                <div className="row g-3">
                  <div className="col-12">
                    <input
                      type="text"
                      name="billing_street"
                      placeholder="Via e Numero Civico"
                      className={`form-control form-control-lg border-0 bg-light ${
                        invalidFields.billing_street.isInvalid
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={handleChange}
                    />
                    {invalidFields.billing_street.isInvalid && (
                      <div className="invalid-feedback ps-2">
                        {invalidFields.billing_street.reason}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="billing_city"
                      placeholder="Città"
                      className={`form-control form-control-lg border-0 bg-light ${
                        invalidFields.billing_city.isInvalid ? "is-invalid" : ""
                      }`}
                      onChange={handleChange}
                    />
                    {invalidFields.billing_city.isInvalid && (
                      <div className="invalid-feedback ps-2">
                        {invalidFields.billing_city.reason}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="billing_postal_code"
                      placeholder="CAP"
                      className={`form-control form-control-lg border-0 bg-light ${
                        invalidFields.billing_postal_code.isInvalid
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={handleChange}
                    />
                    {invalidFields.billing_postal_code.isInvalid && (
                      <div className="invalid-feedback ps-2">
                        {invalidFields.billing_postal_code.reason}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="same"
                  checked={sameAsBilling}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label small" htmlFor="same">
                  L'indirizzo di spedizione è lo stesso di fatturazione
                </label>
              </div>
              {/* Indirizzo di spedizione a scomparsa */}
              {!sameAsBilling && (
                <section className="mb-5 p-3 border rounded bg-white shadow-sm animate__animated animate__fadeIn">
                  <h6 className="text-uppercase small fw-bold text-muted mb-3">
                    Indirizzo di Spedizione
                  </h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        type="text"
                        name="shipping_street"
                        value={formData.customer.shipping_street}
                        placeholder="Via e Numero Civico"
                        className={`form-control form-control-lg border-0 bg-light ${
                          invalidFields.shipping_street.isInvalid
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleChange}
                      />
                      {invalidFields.shipping_street.isInvalid && (
                        <div className="invalid-feedback ps-2">
                          {invalidFields.shipping_street.reason}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="shipping_city"
                        value={formData.customer.shipping_city}
                        placeholder="Città"
                        className={`form-control form-control-lg border-0 bg-light ${
                          invalidFields.shipping_city.isInvalid
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleChange}
                      />
                      {invalidFields.shipping_city.isInvalid && (
                        <div className="invalid-feedback ps-2">
                          {invalidFields.shipping_city.reason}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="shipping_postal_code"
                        value={formData.customer.shipping_postal_code}
                        placeholder="CAP"
                        className={`form-control form-control-lg border-0 bg-light ${
                          invalidFields.shipping_postal_code.isInvalid
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleChange}
                      />
                      {invalidFields.shipping_postal_code.isInvalid && (
                        <div className="invalid-feedback ps-2">
                          {invalidFields.shipping_postal_code.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* RIEPILOGO */}
            <div className="col-lg-5">
              <div className="sticky-top" style={{ top: "100px" }}>
                <div className="card border-0 bg-light p-4 rounded-0">
                  <h5 className="mb-4 fw-bold text-dark">Il tuo ordine</h5>
                  {/* Prodotti */}
                  <div className="cart-items mb-4">
                    {cart.length === 0 ? (
                      <p className="text-muted small">Il carrello è vuoto.</p>
                    ) : (
                      cart.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          plusOne={plusOne}
                          minusOne={minusOne}
                          deleteItem={removeItem}
                          getItemPrice={getItemPrice}
                        />
                      ))
                    )}
                  </div>

                  <hr className="text-muted opacity-25" />

                  {/* Subtotale */}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotale</span>
                    <span className="text-dark">{subtotal.toFixed(2)}€</span>
                  </div>

                  {/* SCONTO (Mostra solo se valido) */}
                  {couponDetails.isValid && (
                    <div className="d-flex justify-content-between mb-2 text-success fw-bold animate__animated animate__fadeIn">
                      <span>
                        Sconto Coupon (
                        {(couponDetails.discountValue * 100).toFixed(0)}%)
                      </span>
                      <span>-{discountAmount.toFixed(2)}€</span>
                    </div>
                  )}

                  {/* Spedizione - mostrata solo se il carrello non è vuoto */}
                  {cart.length > 0 && (
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Spedizione</span>
                      <span className="text-dark">
                        {shippingCost === 0 ? (
                          <strong className="text-success small">GRATIS</strong>
                        ) : (
                          `${shippingCost.toFixed(2)}€`
                        )}
                      </span>
                    </div>
                  )}

                  <hr className="text-muted opacity-25" />

                  {/* Totale Finale mostra solo se c'è almeno un vino*/}
                  {cart.length > 0 && (
                    <div className="d-flex justify-content-between h4 fw-bold mt-4 mb-4 text-dark">
                      <span>Totale</span>
                      <span>{totalWithShipping.toFixed(2)}€</span>
                    </div>
                  )}

                  {/* Input Codice Sconto */}
                  <div className="mb-3">
                    <div
                      className="input-group shadow-sm"
                      style={{ alignItems: "stretch" }}
                    >
                      <input
                        type="text"
                        name="discount_code"
                        value={formData.discount_code}
                        onChange={handleChange}
                        className={`form-control border-0 bg-white ${
                          couponDetails.isValid ? "border border-success" : ""
                        }`}
                        placeholder="Codice Sconto"
                        style={{
                          padding: "0.75rem",
                          transition: "all 0.3s",
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                      />
                      <button
                        className="btn btn-outline-dark bg-light text-dark fw-bold border-0"
                        type="button"
                        onClick={applyCoupon}
                        disabled={
                          isCheckingCoupon || !formData.discount_code.trim()
                        }
                        style={{
                          padding: "0.75rem 1.5rem",

                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {isCheckingCoupon ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          "Applica"
                        )}
                      </button>
                    </div>

                    {/* Messaggio di feedback sotto l'input */}
                    {couponDetails.message && (
                      <div
                        className={`small mt-2 ps-1 fw-medium ${
                          couponDetails.isValid ? "text-success" : "text-danger"
                        }`}
                      >
                        {couponDetails.isValid ? (
                          <i className="bi bi-check-circle-fill me-1"></i>
                        ) : (
                          <i className="bi bi-exclamation-circle-fill me-1"></i>
                        )}
                        {couponDetails.message}
                      </div>
                    )}
                  </div>

                  {/* Bottone Conferma*/}
                  <button
                    type="submit"
                    className="btn bg-body-tertiary w-100 py-3 fw-bold text-uppercase border border-dark shadow-sm"
                    style={{ color: "#4a4a4a" }}
                  >
                    Conferma e paga
                  </button>

                  {/* bottone PAYPAL */}
                  <PayPalScriptProvider
                    options={{
                      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                      currency: "EUR",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={async () => {
                        const isValid = validateForm();
                        if (!isValid) {
                          refTop.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                          toast.error("Dati incompleti", {
                            description:
                              "Controlla i campi evidenziati in rosso prima di pagare con PayPal",
                            duration: 4000,
                          });
                          return;
                        }
                        const response = await axios.post(
                          "http://localhost:3000/paypal/create-order",
                          {
                            total_price: totalWithShipping.toFixed(2),
                          }
                        );
                        return response.data.id;
                      }}
                      onApprove={async (data) => {
                        await axios.post(
                          `http://localhost:3000/paypal/capture-order/${data.orderID}`
                        );
                        const payload = prepareOrderPayload(formData, cart);
                        const response = await axios.post(
                          "http://localhost:3000/ordini",
                          payload
                        );
                        if (response.data.success) {
                          const orderSummary = response.data.order_summary;
                          setCart([]);
                          navigate("/conferma-ordine", {
                            state: {
                              orderInfo: orderSummary,
                              customerName: `${payload.customer.first_name} ${payload.customer.second_name}`,
                              customerData: payload.customer,
                              cartItems: [...cart],
                              discountCode: formData.discount_code,
                            },
                          });
                        }
                      }}
                      onCancel={() => {
                        toast.info("Pagamento annullato", {
                          description: "Hai annullato il pagamento PayPal.",
                        });
                      }}
                      onError={(err) => {
                        console.error("Errore PayPal:", err);
                        toast.error("Errore nel pagamento PayPal");
                      }}
                    />
                  </PayPalScriptProvider>

                  <div className="text-center mt-3 text-muted small">
                    <i className="bi bi-shield-lock-fill me-2"></i>
                    Pagamento sicuro e crittografato
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

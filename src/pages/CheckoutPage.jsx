import axios from "axios";
import { toast } from "sonner";
import { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";

export default function CheckoutPage() {
  const navigate = useNavigate();

  //dati spedizione
  const shippingFee = 7.9;
  const shippingFreeSpend = 60.0;

  //stato carello da context
  const { cart, setCart } = useContext(CartContext);

  //funzioni aumento quantità
  async function plusOne(item) {
    try {
      // Controllo disponibilità a magazzino prima di incrementare
      const response = await axios.get(`http://localhost:3000/vini/${item.slug}`);
      const wine = response.data?.result;

      if (!wine) return;

      //notifica quantità esaurite
      if (item.quantity >= wine.stock_quantity) {
        toast.warning("Scorte esaurite", {
          description: `Non ci sono altre bottiglie di ${item.name} disponibili.`,
        });
        return;
      }

      setCart((prevCart) => prevCart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)));
    } catch (err) {
      console.error("Errore nel recupero dello stock:", err);
    }
  }

  //funzione diminuzione quantità
  function minusOne(item) {
    if (item.quantity <= 1) {
      deleteItem(item);
      return;
    }
    setCart((prevCart) => prevCart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)));
  }

  //funzione per eliminare vino
  function deleteItem(item) {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setCart(updatedCart);
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
    const newInvalid = { ...invalidFields };

    Object.keys(newInvalid).forEach((key) => {
      newInvalid[key] = { isInvalid: false, reason: "" };
    });

    const { customer } = formData;

    // validazione Nome
    if (!customer.first_name.trim()) {
      newInvalid.first_name = { isInvalid: true, reason: "Il nome è necessario" };
    }

    // validazione Cognome
    if (!customer.second_name.trim()) {
      newInvalid.second_name = { isInvalid: true, reason: "Il cognome è necessario" };
    }

    // validazione Email (Regex base)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      newInvalid.email = { isInvalid: true, reason: "Inserisci un'email valida" };
    }

    // validazione Cellulare
    const phoneRegex = /^\+?[\d\s]{9,15}$/;
    const phoneValue = customer.cellphone.trim();

    if (!phoneValue) {
      newInvalid.cellphone = { isInvalid: true, reason: "Il numero di cellulare è necessario" };
    } else if (!phoneRegex.test(phoneValue)) {
      newInvalid.cellphone = { isInvalid: true, reason: "Inserisci un numero valido" };
    }

    // validazione Indirizzo
    if (!customer.billing_street.trim()) {
      newInvalid.billing_street = { isInvalid: true, reason: "L'indirizzo è necessario" };
    }
    // validazione Città
    if (!customer.billing_city.trim()) {
      newInvalid.billing_city = { isInvalid: true, reason: "La città è necessaria" };
    }

    // validazione CAP
    if (!/^\d{5}$/.test(customer.billing_postal_code)) {
      newInvalid.billing_postal_code = { isInvalid: true, reason: "CAP non valido" };
    }

    //validazione shipping se necessaria
    if (!sameAsBilling) {
      if (!customer.shipping_street.trim()) {
        newInvalid.shipping_street = { isInvalid: true, reason: "L'indirizzo è necessario" };
      }
      if (!customer.shipping_city.trim()) {
        newInvalid.shipping_city = { isInvalid: true, reason: "La città è necessaria" };
      }
      if (!/^\d{5}$/.test(customer.shipping_postal_code)) {
        newInvalid.shipping_postal_code = { isInvalid: true, reason: "CAP non valido" };
      }
    }

    setInvalidFields(newInvalid);

    // ritorna true se non ci sono campi invalidi - Object.values prende i valori di newInvalid e li mette in stringa + some ci dice se almeno un valore è invalido(true)
    return !Object.values(newInvalid).some((field) => field.isInvalid);
  }

  //PREZZO TOTALE e COUPON
  //calcolo il prezzo da usare, se promo o meno
  const getItemPrice = (item) => (item.promotion_price !== null ? item.promotion_price : item.price);

  // funzione per validare il coupon
  const applyCoupon = async () => {
    const code = formData.discount_code.trim();
    if (!code) {
      toast.error("Inserisci un codice prima di applicare");
      return;
    }

    setIsCheckingCoupon(true);

    try {
      const response = await axios.post("http://localhost:3000/ordini/validate-coupon", {
        discount_code: code,
        total_amount: subtotal,
      });

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
    // Reset dello stato coupon (messaggi e valori)
    setCouponDetails({
      isValid: false,
      discountValue: 0,
      message: "", // Qui puliamo qualsiasi messaggio, sia di errore che di successo
    });

    // Reset del campo di testo dell'input nel formData
    setFormData((prev) => ({
      ...prev,
      discount_code: "", // Questo cancella fisicamente il codice scritto dall'utente
    }));

    // Opzionale: se vuoi che il messaggio di "reset" appaia solo se c'era effettivamente qualcosa
    // puoi aggiungere una logica, ma solitamente pulire tutto al cambio carrello è la scelta più sicura.
  }, [cart]);

  //calcolo il subtotale della somma dei prezzi dei prodotti considerando le quantità (useMemo serve per memorizzare il calcolo e farlo dipendere solo da cart)
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);
  }, [cart]); //array delle dipendenze di useMemo

  // calcolo sconto
  const discountAmount = useMemo(() => {
    return couponDetails.isValid ? subtotal * couponDetails.discountValue : 0;
  }, [subtotal, couponDetails]);

  //COSTI SPEDIZIONE
  //definiamo costi di spedizione
  const shippingCost = subtotal - discountAmount >= shippingFreeSpend ? 0 : shippingFee;
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
        description: "Il tuo carrello è vuoto. Aggiungi almeno un vino per procedere!",
        duration: 4000,
      });
      return; // Blocca l'invio del form
    }

    // Validazione dati
    const isValid = validateForm();

    //se il form non è valido fermo il submit + notifica campi non validi
    if (!isValid) {
      toast.error("Dati incompleti", {
        description: "Controlla i campi evidenziati in rosso tra le informazioni di consegna",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    //Sanitizzazione dati
    const sanitizedCustomer = {};

    for (let key in formData.customer) {
      // eliminiamo spazi iniziali e finali se sono stringhe
      sanitizedCustomer[key] = typeof formData.customer[key] === "string" ? formData.customer[key].trim() : formData.customer[key];
    }

    //normalizzazione dati per backend
    const orderCartItems = cart.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      // price_frontend: getItemPrice(item), //prezzo finale effettivo considerando possibili promo
    }));

    // creiamo il payload da inviare al server
    const payload = {
      customer: sanitizedCustomer,
      // total_price: subtotal, // invio il prezzo base perchè il calcolo coupon e spedizione lo fa il backend
      cart_items: orderCartItems,
      discount_code: formData.discount_code || null,
    };

    //chiamata axios per inviare i dati al server
    try {
      const response = await axios.post("http://localhost:3000/ordini", payload);

      // se la chiamata è andata a buon fine
      if (response.data.success) {
        //prendo dati prezzo dal server
        const orderSummary = response.data.order_summary;
        console.log("Ordine creato con successo!", response.data.order_summary);

        // faccio chiamata axios per mandare email di conferam ordine
        // dopo che l'ordine è stato salvato con successo nel database, chiamo il nostro endpoint /email/send-confirmation per mandare una email di conferma al cliente. passimao i dati del cliente (nome, email, indirizzo di spedizione), i prodotti del carrello con quantità e prezzi, il totale e le spese di spedizione.
        //L'email viene generata e inviata tramite Nodemailer con Maltrap come servizio di test. In produzione si può sostituire Mailtrap con un servizio reale come Gmail. Il cliente receverà una email col riepilogo completo dell'ordine, così sa esattamente cosa ha comprato e quanto ha pagato. */
        try {
          axios.post("http://localhost:3000/email/send-confirmation", {
            customer: formData.customer,
            cart_items: orderCartItems,
            total_price: orderSummary.total,
            shipping_fee: orderSummary.shipping,
          });
        } catch (emailError) {
          console.warn("Ordine creato, ma invio email fallito:", emailError);
        }
        //svuoto il carrello
        setCart([]);

        //vado alla pagina di conferma ordine
        navigate("/conferma-ordine", {
          state: {
            orderInfo: orderSummary,
            customerName: sanitizedCustomer.first_name,
            customerData: sanitizedCustomer,
            cartItems: [...cart],
          },
        });
      }
    } catch (error) {
      const backendMessage = error.response?.data?.message || "Errore durante l'ordine";

      //gestione errori coupon (no toast)
      if (backendMessage.toLowerCase().includes("coupon") || backendMessage.toLowerCase().includes("sconto")) {
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

  return (
    <>
      {/* LOADING */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 9999 }}>
          <div className="spinner-border text-dark" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <h5 className="mt-3 fw-bold text-uppercase">Conferma ordine WineGuys in corso...</h5>
        </div>
      )}
      {/* BOTTONE TORNA INDIETRO */}
      <div className="container py-3" style={{ maxWidth: "1100px" }}>
        <div className="mb-3">
          <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-dark p-0 d-flex align-items-center" style={{ fontSize: "0.75rem" }} type="button">
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
                <h6 className="text-uppercase small fw-bold text-muted mb-3">Contatti</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Nome"
                      className={`form-control form-control-lg border-0 bg-light ${invalidFields.first_name.isInvalid ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {invalidFields.first_name.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.first_name.reason}</div>}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="second_name"
                      placeholder="Cognome"
                      className={`form-control form-control-lg border-0 bg-light ${invalidFields.second_name.isInvalid ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {invalidFields.second_name.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.second_name.reason}</div>}
                  </div>
                  <div className="col-md-8">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={`form-control form-control-lg border-0 bg-light ${invalidFields.email.isInvalid ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {invalidFields.email.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.email.reason}</div>}
                  </div>
                  <div className="col-md-4">
                    <input
                      type="tel"
                      name="cellphone"
                      placeholder="Cellulare"
                      className={`form-control form-control-lg border-0 bg-light ${invalidFields.cellphone.isInvalid ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {invalidFields.cellphone.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.cellphone.reason}</div>}
                  </div>
                </div>
              </section>
              <section className="mb-4">
                <h6 className="text-uppercase small fw-bold text-muted mb-3">Indirizzo di Fatturazione</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <input
                      type="text"
                      name="billing_street"
                      placeholder="Via e Numero Civico"
                      className={`form-control form-control-lg border-0 bg-light ${invalidFields.billing_street.isInvalid ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {invalidFields.billing_street.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.billing_street.reason}</div>}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="billing_city"
                      placeholder="Città"
                      className={`form-control form-control-lg border-0 bg-light ${invalidFields.billing_city.isInvalid ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {invalidFields.billing_city.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.billing_city.reason}</div>}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="billing_postal_code"
                      placeholder="CAP"
                      className={`form-control form-control-lg border-0 bg-light ${invalidFields.billing_postal_code.isInvalid ? "is-invalid" : ""}`}
                      onChange={handleChange}
                    />
                    {invalidFields.billing_postal_code.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.billing_postal_code.reason}</div>}
                  </div>
                </div>
              </section>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="same" checked={sameAsBilling} onChange={handleCheckboxChange} />
                <label className="form-check-label small" htmlFor="same">
                  L'indirizzo di spedizione è lo stesso di fatturazione
                </label>
              </div>
              {/* Indirizzo di spedizione a scomparsa */}
              {!sameAsBilling && (
                <section className="mb-5 p-3 border rounded bg-white shadow-sm animate__animated animate__fadeIn">
                  <h6 className="text-uppercase small fw-bold text-muted mb-3">Indirizzo di Spedizione</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        type="text"
                        name="shipping_street"
                        value={formData.customer.shipping_street}
                        placeholder="Via e Numero Civico"
                        className={`form-control form-control-lg border-0 bg-light ${invalidFields.shipping_street.isInvalid ? "is-invalid" : ""}`}
                        onChange={handleChange}
                      />
                      {invalidFields.shipping_street.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.shipping_street.reason}</div>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="shipping_city"
                        value={formData.customer.shipping_city}
                        placeholder="Città"
                        className={`form-control form-control-lg border-0 bg-light ${invalidFields.shipping_city.isInvalid ? "is-invalid" : ""}`}
                        onChange={handleChange}
                      />
                      {invalidFields.shipping_city.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.shipping_city.reason}</div>}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="shipping_postal_code"
                        value={formData.customer.shipping_postal_code}
                        placeholder="CAP"
                        className={`form-control form-control-lg border-0 bg-light ${invalidFields.shipping_postal_code.isInvalid ? "is-invalid" : ""}`}
                        onChange={handleChange}
                      />
                      {invalidFields.shipping_postal_code.isInvalid && <div className="invalid-feedback ps-2">{invalidFields.shipping_postal_code.reason}</div>}
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
                        <div key={item.id} className="card mb-3 p-3 border-0 shadow-sm bg-white rounded-3">
                          <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: "1rem" }}>
                            {item.name}
                          </h6>

                          <div className="row g-0 align-items-center">
                            <div className="col-3 text-center">
                              <img src={`http://localhost:3000/wines/${item.img}`} className="img-fluid" alt={item.name} style={{ maxHeight: "70px", objectFit: "contain" }} />
                            </div>

                            <div className="col-5 d-flex align-items-center justify-content-center gap-2">
                              <div className="d-flex align-items-center border rounded bg-light p-1">
                                <button onClick={() => minusOne(item)} type="button" className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold">
                                  -
                                </button>
                                <span className="px-2 small fw-bold" style={{ minWidth: "20px", textAlign: "center" }}>
                                  {item.quantity}
                                </span>
                                <button onClick={() => plusOne(item)} type="button" className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold">
                                  +
                                </button>
                              </div>

                              <button onClick={() => deleteItem(item)} type="button" className="btn btn-sm text-danger ms-2 p-0">
                                <i className="bi bi-trash3 fs-5"></i>
                              </button>
                            </div>

                            <div className="col-4 text-end">
                              {item.promotion_price && (
                                <div className="d-flex flex-column">
                                  <span className="text-danger text-decoration-line-through small" style={{ fontSize: "0.7rem" }}>
                                    {item.price.toFixed(2)}€
                                  </span>
                                </div>
                              )}
                              <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                                Totale: <span className="fw-bold text-dark">{(getItemPrice(item) * item.quantity).toFixed(2)}€</span>
                              </div>
                            </div>
                          </div>
                        </div>
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
                      <span>Sconto Coupon ({(couponDetails.discountValue * 100).toFixed(0)}%)</span>
                      <span>-{discountAmount.toFixed(2)}€</span>
                    </div>
                  )}

                  {/* Spedizione */}
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Spedizione</span>
                    <span className="text-dark">{shippingCost === 0 ? <strong className="text-success small">GRATIS</strong> : `${shippingCost.toFixed(2)}€`}</span>
                  </div>

                  <hr className="text-muted opacity-25" />

                  {/* Totale Finale */}
                  <div className="d-flex justify-content-between h4 fw-bold mt-4 mb-4 text-dark">
                    <span>Totale</span>
                    <span>{totalWithShipping.toFixed(2)}€</span>
                  </div>

                  {/* Input Codice Sconto */}
                  <div className="mb-3">
                    <div className="input-group shadow-sm" style={{ alignItems: "stretch" }}>
                      <input
                        type="text"
                        name="discount_code"
                        value={formData.discount_code}
                        onChange={handleChange}
                        className={`form-control border-0 bg-white ${couponDetails.isValid ? "border border-success" : ""}`}
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
                        disabled={isCheckingCoupon || !formData.discount_code.trim()}
                        style={{
                          padding: "0.75rem 1.5rem",

                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {isCheckingCoupon ? <span className="spinner-border spinner-border-sm"></span> : "Applica"}
                      </button>
                    </div>

                    {/* Messaggio di feedback sotto l'input */}
                    {couponDetails.message && (
                      <div className={`small mt-2 ps-1 fw-medium ${couponDetails.isValid ? "text-success" : "text-danger"}`}>
                        {couponDetails.isValid ? <i className="bi bi-check-circle-fill me-1"></i> : <i className="bi bi-exclamation-circle-fill me-1"></i>}
                        {couponDetails.message}
                      </div>
                    )}
                  </div>

                  {/* Bottone Conferma*/}
                  <button type="submit" className="btn bg-body-tertiary w-100 py-3 fw-bold text-uppercase border border-dark shadow-sm" style={{ color: "#4a4a4a" }}>
                    Conferma e paga
                  </button>
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

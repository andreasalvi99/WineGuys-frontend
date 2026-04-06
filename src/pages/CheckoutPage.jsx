import axios from "axios";
import { toast } from "sonner";

import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";

export default function CheckoutPage() {
  const navigate = useNavigate();

  //dati spedizione
  const shippingFee = 7.9;
  const shippingFreeSpend = 60.0;

  //stato carello da context
  const { cart, setCart } = useContext(CartContext);

  //funzioni gestione quantità

  async function plusOne(item) {
    try {
      // Controllo disponibilità a magazzino prima di incrementare
      const response = await axios.get(`http://localhost:3000/vini/${item.slug}`);
      const wine = response.data?.result;

      if (!wine) return;
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

  function minusOne(item) {
    if (item.quantity <= 1) {
      deleteItem(item);
      return;
    }
    setCart((prevCart) => prevCart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem)));
  }

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

  //funzione di validazione
  function validateForm() {
    const newInvalid = {
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
    };

    // validazione Nome
    if (!formData.customer.first_name.trim()) {
      newInvalid.first_name = { isInvalid: true, reason: "Il nome è necessario" };
    }

    // validazione Cognome
    if (!formData.customer.second_name.trim()) {
      newInvalid.second_name = { isInvalid: true, reason: "Il cognome è necessario" };
    }

    // validazione Email (Regex base)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer.email)) {
      newInvalid.email = { isInvalid: true, reason: "Inserisci un'email valida" };
    }

    // validazione Cellulare
    const phoneRegex = /^\+?[\d\s]{9,15}$/;
    const phoneValue = formData.customer.cellphone.trim();

    if (!phoneValue) {
      newInvalid.cellphone = { isInvalid: true, reason: "Il numero di cellulare è necessario" };
    } else if (!phoneRegex.test(phoneValue)) {
      newInvalid.cellphone = { isInvalid: true, reason: "Inserisci un numero valido" };
    }

    // validazione Indirizzo
    if (!formData.customer.billing_street.trim()) {
      newInvalid.billing_street = { isInvalid: true, reason: "L'indirizzo è necessario" };
    }
    // validazione Città
    if (!formData.customer.billing_city.trim()) {
      newInvalid.billing_city = { isInvalid: true, reason: "La città è necessaria" };
    }

    // validazione CAP
    if (!/^\d{5}$/.test(formData.customer.billing_postal_code)) {
      newInvalid.billing_postal_code = { isInvalid: true, reason: "CAP non valido" };
    }
    //validazione chipping se necessaria
    if (!sameAsBilling) {
      if (!formData.customer.shipping_street.trim()) {
        newInvalid.shipping_street = { isInvalid: true, reason: "L'indirizzo è necessario" };
      }
      if (!formData.customer.shipping_city.trim()) {
        newInvalid.shipping_city = { isInvalid: true, reason: "La città è necessaria" };
      }
      if (!/^\d{5}$/.test(formData.customer.shipping_postal_code)) {
        newInvalid.shipping_postal_code = { isInvalid: true, reason: "CAP non valido" };
      }
    }

    setInvalidFields(newInvalid);

    // ritorna true se non ci sono campi invalidi - Object.values prende i valori di newInvalid e li mette in stringa + some ci dice se almeno un valore è invalido(true)
    return !Object.values(newInvalid).some((f) => f.isInvalid);
  }

  //PREZZO TOTALE
  //calcolo il prezzo da usare, se promo o meno
  const getItemPrice = (item) => (item.promotion_price !== null ? item.promotion_price : item.price);

  //calcolo il subtotale della somma dei prezzi dei prodotti considerando le quantità (useMemo serve per memorizzare il calcolo e farlo dipendere solo da cart)
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);
  }, [cart]); //array delle dipendenze di useMemo

  //COSTI SPEDIZIONE
  //definiamo costi di spedizione
  const shippingCost = subtotal >= shippingFreeSpend ? 0 : shippingFee;
  const totalWithShipping = subtotal + shippingCost;

  //FUNZIONE LETTURA FORM e gestione sincronizzazione dei cambi billing e shipping
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      //copio i dati del cliente
      const newCustomer = { ...prev.customer, [name]: value };

      // Sincronizzazione automatica se la checkbox è attiva
      //se la checkbox 'stesso indirizzo' è attiva e il campo compilato inzia(startsWith) con billing (per escludere i campi da non sincronizzare)
      if (sameAsBilling && name.startsWith("billing_")) {
        //sostituisco billing con shipping per riempire entrambi i campi da inviare al server
        const shippingKey = name.replace("billing_", "shipping_");

        //inserisco i dati sull'indirizzo nei dati cliente
        newCustomer[shippingKey] = value;
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

    // validazione dati
    const isValid = validateForm();

    // se il form non è valido fermo il submit
    if (!isValid) return;

    setIsLoading(true);

    //normalizzazione dati per backend
    const orderCartItems = cart.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: getItemPrice(item), //prezzo finale effettivo considerando possibili promo
    }));

    // creiamo il payload da inviare al server
    const payload = {
      customer: formData.customer,
      total_price: subtotal, // invio il prezzo base perchè il calcolo coupon e spedizione lo fa il backend
      cart_items: orderCartItems,
      discount_code: formData.discount_code || null,
    };

    //chiamata axios per inviare i dati al server
    try {
      const response = await axios.post("http://localhost:3000/ordini", payload);

      // se la chiamata è andata a buon fine
      if (response.data.success) {
        //svuoto il carrello
        setCart([]);
        console.log("Ordine creato con successo!", response.data.order_summary);

        // faccio chiamata axios per mandare email di conferam ordine
        /* dopo che l'ordine è stato salvato con successo nel database, chiamo il nostro endpoint /email/send-confirmation per mandare una email di conferma al cliente. passimao i dati del cliente (nome, email, indirizzo di spedizione), i prodotti del carrello con quantità e prezzi, il totale e le spese di spedizione.L'email viene generata e inviata tramite Nodemailer con Maltrap come servizio di test. In produzione si può sostituire Mailtrap con un servizio reale come Gmail. Il cliente receverà una email col riepilogo completo dell'ordine, così sa esattamente cosa ha comprato e quanto ha pagato. */
        try {
          axios.post("http://localhost:3000/email/send-confirmation", {
            customer: formData.customer,
            cart_items: orderCartItems,
            total_price: subtotal,
            shipping_fee: shippingCost,
          });
        } catch (emailError) {
          console.warn("Ordine creato, ma invio email fallito:", emailError);
        }

        //vado alla pagina di conferma ordine
        navigate("/conferma-ordine", {
          state: {
            orderInfo: response.data.order_summary,
            customerName: formData.customer.first_name,
            customerData: formData.customer,
            cartItems: [...cart],
          },
        });
      }
    } catch (error) {
      console.error("ERRORE:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      //notifiche per errori
      const backendMessage = error.response?.data?.message || "Errore durante l'ordine";
      toast.error("Attenzione", {
        description: backendMessage,
        duration: 5000,
      });
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
      <div className="container py-2" style={{ maxWidth: "1100px" }}>
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-dark p-0 d-flex align-items-center" style={{ fontSize: "0.75rem" }} type="button">
            <i className="bi bi-arrow-left me-2"></i>
            Torna indietro
          </button>
        </div>
        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="row g-5">
            {/* DATI CLIENTE */}
            <div className="col-lg-7">
              <h2 className="h4 mb-4 fw-bold">Informazioni di Consegna</h2>
              <section className="mb-5">
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

              <div className="form-check mb-5">
                <input className="form-check-input" type="checkbox" id="same" checked={sameAsBilling} onChange={() => setSameAsBilling(!sameAsBilling)} />
                <label className="form-check-label small" htmlFor="same">
                  L'indirizzo di spedizione è lo stesso di fatturazione
                </label>
              </div>
              {/* INPUT INDIRIZZO DI SPEZIONE A SCOMPARSA */}
              {!sameAsBilling && (
                <section className="mb-5 p-3 border rounded bg-white shadow-sm animate__animated animate__fadeIn">
                  <h6 className="text-uppercase small fw-bold text-muted mb-3">Indirizzo di Spedizione</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <input
                        type="text"
                        name="shipping_street"
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
                                <button
                                  onClick={() => (item.quantity > 1 ? minusOne(item) : deleteItem(item))}
                                  type="button"
                                  className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold"
                                >
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
                                  <span className="text-muted text-decoration-line-through small" style={{ fontSize: "0.7rem" }}>
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
                  {/* <div className="cart-items mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between mb-3 align-items-center">
                        <div className="d-flex align-items-center">
                          <span className="badge bg-secondary me-2">{item.quantity}</span>

                          <span className="small text-dark">{item.name}</span>
                        </div>
                        <span className="small fw-bold text-dark">{(getItemPrice(item) * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div> */}

                  <hr className="text-muted opacity-25" />

                  {/* Subtotale e Spedizione */}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotale</span>
                    <span className="text-dark">{subtotal.toFixed(2)}€</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Spedizione</span>
                    <span className="text-dark">{shippingCost === 0 ? <strong className="text-success small">GRATIS</strong> : `${shippingCost.toFixed(2)}€`}</span>
                  </div>

                  {/* Alert spedizione gratuita*/}
                  {subtotal < shippingFreeSpend && (
                    <div className="alert alert-info py-2 px-3 small border-0 rounded-0 mb-4 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#d1f2fb", color: "#0c5460" }}>
                      <span>
                        Aggiungi <strong>{(shippingFreeSpend - subtotal).toFixed(2)}€</strong> per la spedizione gratuita!
                      </span>
                    </div>
                  )}

                  <hr className="text-muted opacity-25" />

                  {/* Totale Finale */}
                  <div className="d-flex justify-content-between h4 fw-bold mt-4 mb-4 text-dark">
                    <span>Totale</span>
                    <span>{totalWithShipping.toFixed(2)}€</span>
                  </div>

                  {/* Input Codice Sconto */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control border-0 bg-white"
                      placeholder="Codice Sconto"
                      style={{ padding: "0.75rem" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_code: e.target.value,
                        })
                      }
                    />
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

import axios from "axios";
import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);

  //dati spedizione
  const shippingFee = 7.9;
  const shippingFreeSpend = 60.0;

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

  //calcolo il prezzo da usare, se promo o meno
  const getItemPrice = (item) => (item.promotion_price !== null ? item.promotion_price : item.price);

  //calcolo il subtotale della somma dei prezzi dei prodotti considerando le quantità (useMemo serve per memorizzare il calcolo e farlo dipendere solo da cart)
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);
  }, [cart]); //array delle dipendenze di useMemo

  //definiamo costi di spedizione
  const shippingCost = subtotal >= shippingFreeSpend ? 0 : shippingFee;
  const totalWithShipping = subtotal + shippingCost;

  //funzione lettura del form e gestione sincronizzazione dei cambi billing e shipping
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      //copio i dati del cliente
      const newCustomer = { ...prev.customer, [name]: value };

      // Sincronizzazione automatica se la checkbox è attiva
      //se la checkbox stesso indirizzo è attiva e il campo compilato inzia(startsWith) con billing (per escludere i campi da non sincronizzare)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

        navigate("/");
        //  navigate('/ordine-confermato', {
        //   state: {
        //     orderInfo: response.data.order_summary,
        //     customerName: formData.customer.first_name
        //   }
        // });
      }
    } catch (error) {
      console.error("ERRORE:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
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

      <div className="container py-5" style={{ maxWidth: "1100px" }}>
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
                    <input type="text" name="first_name" placeholder="Nome" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="second_name" placeholder="Cognome" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-md-8">
                    <input type="email" name="email" placeholder="Email" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <input type="tel" name="cellphone" placeholder="Cellulare" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} />
                  </div>
                </div>
              </section>

              <section className="mb-4">
                <h6 className="text-uppercase small fw-bold text-muted mb-3">Indirizzo di Fatturazione</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <input type="text" name="billing_street" placeholder="Via e Numero Civico" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="billing_city" placeholder="Città" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="billing_postal_code" placeholder="CAP" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} required />
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
                      <input type="text" name="shipping_street" placeholder="Via e Numero Civico" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <input type="text" name="shipping_city" placeholder="Città" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <input type="text" name="shipping_postal_code" placeholder="CAP" className="form-control form-control-lg border-0 bg-light" onChange={handleChange} />
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
                  {/* PRODOTTI */}
                  <div className="cart-items mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between mb-3 align-items-center">
                        <div className="d-flex align-items-center">
                          <span className="badge bg-secondary me-2">{item.quantity}</span>
                          <span className="small text-dark">{item.name}</span>
                        </div>
                        <span className="small fw-bold text-dark">{(getItemPrice(item) * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>

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

                  {/* ALERT SPEDIZIONE GRATUITA: Esattamente come nello screenshot */}
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
                      onChange={(e) => setFormData({ ...formData, discount_code: e.target.value })}
                    />
                  </div>

                  {/* Bottone Conferma (bg-body-tertiary come chiesto prima o btn-dark per contrasto) */}
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

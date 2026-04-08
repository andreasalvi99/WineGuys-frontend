import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmationPage() {
  const location = useLocation();

  // recupero i dati passati dal checkout
  const { orderInfo, customerName, customerData, cartItems, discountCode } = location.state || {};

  // genero un numero ordine random
  const orderNumber = React.useMemo(() => "WG-" + Math.floor(100000 + Math.random() * 900000), []);

  // tasto torna allo shop se non ci sono oridni
  if (!customerName) {
    return (
      <div className="container py-5 text-center">
        <h2>Nessun ordine trovato</h2>
        <Link to="/" className="btn btn-success mt-3">
          Torna allo Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 playfair-display_special">
      <div className="row g-4">
        {/* Parte sinistra */}
        <div className="col-lg-8">
          <div className="mb-4">
            <span className="text-muted small text-uppercase">Ordine {orderNumber}</span>
            <h1 className="fw-bold mt-1">Grazie {customerName}!</h1>
          </div>

          {/* Card Messaggio Successo */}
          <div className="card border-0 bg-light p-4 mb-4 rounded-3 shadow-sm">
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle-fill text-success fs-1 me-3"></i>
              <div>
                <h4 className="mb-1 fw-bold">Il tuo ordine è confermato!</h4>
                <p className="mb-0 text-muted">Riceverai un'email di conferma con i dati del tuo ordine.</p>
              </div>
            </div>
          </div>

          {/* Card Dati Cliente */}
          <div className="card border-0 bg-light p-4 rounded-3 shadow-sm">
            <h5 className="fw-bold mb-4">Informazioni sull'ordine</h5>
            <div className="row">
              {/* Contatti */}
              <div className="col-md-6 mb-3">
                <h6 className="fw-bold text-uppercase small text-muted">Contatti</h6>
                <p className="mb-1">{customerName}</p>
                <p className="mb-1">{customerData.email}</p>
                <p className="mb-0">{customerData.cellphone}</p>
              </div>
              {/* Indirizzo */}
              <div className="col-md-6 mb-3">
                <h6 className="fw-bold text-uppercase small text-muted">Indirizzo di Spedizione</h6>
                <p className="mb-1">
                  {customerData.first_name} {customerData.second_name}
                </p>
                <p className="mb-1">{customerData.shipping_street}</p>
                <p className="mb-0">
                  {customerData.shipping_postal_code} - {customerData.shipping_city} ({customerData.shpping_country})
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 d-none d-lg-block">
            <Link to="/" className="btn btn-dark btn-lg rounded-0 px-5">
              Continua lo Shopping
            </Link>
          </div>
        </div>

        {/* PParte destra */}
        <div className="col-lg-4">
          <div className="card border-0 bg-light p-4 rounded-3 shadow-sm sticky-top" style={{ top: "100px" }}>
            <h5 className="fw-bold mb-4">Riepilogo dell'ordine</h5>

            {/* Lista Prodotti */}
            <div className="order-items-list mb-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {cartItems.map((item, index) => {
                const hasPromo = item.promotion_price !== null;
                const currentPrice = hasPromo ? item.promotion_price : item.price;
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-2 border-white">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-secondary me-2">{item.quantity}</span>

                      <div>
                        <h6 className="mb-0 fw-bold text-uppercase small">{item.name}</h6>
                        <div className="d-flex align-items-center gap-2">
                          {hasPromo && (
                            <span className="text-danger text-decoration-line-through extra-small" style={{ fontSize: "0.7rem" }}>
                              &euro;{item.price.toFixed(2)}
                            </span>
                          )}
                          <span className={`${hasPromo ? "text-muted fw-bold" : "text-muted"} extra-small`}>&euro;{currentPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="fw-bold fw-bold">&euro;{(currentPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr />

            {/* codice sconto */}
            {discountCode && (
              <div className="d-flex justify-content-between mb-2 text-success fw-bold">
                <span>Coupon ({discountCode})</span>

                <span>Applicato</span>
              </div>
            )}

            {/* Calcoli Finali */}
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotale</span>
              <span>&euro;{orderInfo.total}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Spedizione</span>
              <span>{parseFloat(orderInfo.shipping) === 0 ? "Gratis" : `€${orderInfo.shipping}`}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Totale</h5>
              <h4 className="fw-bold mb-0 text-success">&euro;{orderInfo.final_total}</h4>
            </div>
          </div>

          <div className="mt-4 d-lg-none text-center">
            <Link to="/" className="btn btn-dark btn-lg w-100 rounded-0">
              Continua lo Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import { useContext } from "react";

export default function AllWinesCard({
  wine,
  slug,
  promotion,
  price,
  quantity,
  img,
  name,
  calcDiscount,
}) {
  const { addToCart, cart } = useContext(CartContext);
  return (
    <div className="col">
      <div className="card h-100 p-3 wine-card bg-body-tertiary">
        <Link to={"/vini/" + slug} className="text-black text-decoration-none">
          <div className="d-flex justify-content-between">
            {/* se chiave promotion ha un valore allora invoco la funzione per calcolare lo sconto e lo stampo in uno span */}
            <div>
              {promotion != null && (
                <span className="badge text-bg-danger fs-6">
                  -{calcDiscount(price, promotion)}%
                </span>
              )}
              {/* se la quantity in stock del prodotto è compresa tra 0 e 6 appare un avviso lampeggiante specificando la quantità rimanente */}
              {quantity > 0 && quantity <= 6 && (
                <span className="text-danger blink d-block">
                  <div className="red-pin bg-danger"></div>
                  {quantity} rimamenti
                </span>
              )}
              {/* se la quantity in stock è uguale a 0 appare scritto esaurito */}
              {quantity === 0 && <span className="text-danger">Esaurito</span>}
            </div>
            {/* se  chiave promotion ha un valore allora stampo il valore originale sbarrato e sotto il valore scontato altrimenti stampo il prezzo originale*/}
            <div>
              {promotion !== null && promotion !== undefined ? (
                <>
                  <p className="text-danger m-0 fs-4 fw-bold">
                    &euro;{promotion}
                  </p>
                  <p className="text-decoration-line-through m-0">
                    &euro;
                    {price}
                  </p>
                </>
              ) : (
                <p className="fs-4 fw-bold">&euro;{price}</p>
              )}
            </div>
          </div>
          <img src={img} className="card-img-top" alt={name} />
        </Link>
        <div className="card-body text-center d-flex flex-column justify-content-between">
          <p className="card-text">{name}</p>
          {/* il button aggiungi al carello è disabilitato se quantity in stock è 0 o se  la quantità che si sta aggiungendo al carrello è maggiore di quella in stock*/}
          <button
            onClick={() => addToCart(wine, 1)}
            type="button"
            className="btn btn-outline-danger"
            disabled={
              quantity <= 0 ||
              (cart.find((item) => item.slug === wine.slug)?.quantity ?? 0) >=
                wine.stock_quantity
            }
          >
            Aggiungi al carrello
          </button>
        </div>
      </div>
    </div>
  );
}

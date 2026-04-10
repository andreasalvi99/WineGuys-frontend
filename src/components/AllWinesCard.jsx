import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import { useContext } from "react";
import { toast } from "sonner";

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

  const handleAddToCart = () => {
    addToCart(wine, 1);

    // Mostra il toast
    toast.success("Aggiunto al carrello", {
      description: `${name} è stato aggiunto al carrello`,
      duration: 2000,
    });
  };

  return (
    <div className="col">
      <div className="card h-100 p-1 p-lg-3 wine-card bg-body-tertiary position-relative">
        {promotion != null && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            -{calcDiscount(price, promotion)}%
          </span>
        )}
        <Link to={"/vini/" + slug} className="text-black text-decoration-none">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              {quantity > 0 && quantity <= 6 && (
                <span className="text-danger blink d-lg-block d-none">
                  <div className="red-pin bg-danger"></div>
                  {quantity} rimamenti
                </span>
              )}
              {/* se la quantity in stock è uguale a 0 appare scritto esaurito */}
              {quantity === 0 && (
                <span className="text-danger d-block">Esaurito</span>
              )}
            </div>
            <div>
              {promotion !== null && promotion !== undefined ? (
                <>
                  <div>
                    <p className="text-danger m-0 fs-5 fw-bold">
                      &euro;{promotion}
                    </p>
                    <small className="text-decoration-line-through m-0 mb-4">
                      &euro;{price}
                    </small>
                  </div>
                </>
              ) : (
                <p className="fs-4 fw-bold mb-3">&euro;{price}</p>
              )}
            </div>
          </div>
          <img src={img} className="card-img-top" alt={name} />
        </Link>
        <div className="card-body text-center d-flex flex-column justify-content-between">
          <p className="card-text">{name}</p>

          <button
            onClick={handleAddToCart}
            type="button"
            className="btn btn-outline-danger d-none d-lg-block"
            disabled={
              quantity <= 0 ||
              (cart.find((item) => item.slug === wine.slug)?.quantity ?? 0) >=
                wine.stock_quantity
            }
          >
            Aggiungi al carrello
          </button>
          <button
            onClick={handleAddToCart}
            type="button"
            className="btn btn-outline-danger d-lg-none"
            disabled={
              quantity <= 0 ||
              (cart.find((item) => item.slug === wine.slug)?.quantity ?? 0) >=
                wine.stock_quantity
            }
          >
            <i className="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

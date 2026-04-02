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
  const { addToCart } = useContext(CartContext);
  return (
    <div className="col">
      <div className="card h-100 p-3 wine-card bg-body-tertiary">
        <Link to={"/vini/" + slug} className="text-black text-decoration-none">
          <div className="d-flex justify-content-between">
            <div>
              {promotion != null && (
                <span className="badge text-bg-danger fs-6">
                  -{calcDiscount(price, promotion)}%
                </span>
              )}

              {quantity > 0 && quantity <= 6 && (
                <span className="text-danger">Ne rimangono {quantity}</span>
              )}

              {quantity === 0 && <span className="text-danger">Esaurito</span>}
            </div>
            <div>
              {promotion !== null && promotion !== undefined ? (
                <>
                  <p className="text-danger m-0">&euro;{promotion}</p>
                  <p className="text-decoration-line-through m-0">
                    &euro;
                    {price}
                  </p>
                </>
              ) : (
                <p>&euro;{price}</p>
              )}
            </div>
          </div>
          <img src={img} className="card-img-top" alt={name} />
        </Link>
        <div className="card-body text-center d-flex flex-column justify-content-between">
          <p className="card-text">{name}</p>
          <button
            onClick={() => addToCart(wine, 1)}
            type="button"
            className="btn btn-outline-danger"
            disabled={quantity <= 0}
          >
            Aggiungi al carrello
          </button>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function WineCardSliced({ img, name, price, slug, discounted }) {
  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }

  return (
    <div className="col playfair-display_special">
      <div className="card h-100 bg-transparent border-0 wine-card">
        <Link to={"/vini/" + slug}>
          <img src={img} className="card-img-top" alt={name} />
        </Link>
        <div className="card-body">
          <p className="card-text">{name}</p>
          <p className="card-text">
            {discounted !== null && discounted !== undefined ? (
              <>
                <span className="text-decoration-line-through position-relative">
                  {price}&euro;
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {calcDiscount(price, discounted)}%
                  </span>
                </span>

                <span className="d-block">{discounted}&euro;</span>
              </>
            ) : (
              <span>{price}&euro;</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

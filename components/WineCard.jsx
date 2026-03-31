import { Link } from "react-router-dom";

export default function WineCard({ img, name, price, slug, discounted }) {
  return (
    <div className="col">
      <div className="card h-100 bg-transparent border-0 wine-card">
        <Link to={"/vini" + slug}>
          <img src={img} className="card-img-top" alt={name} />
        </Link>
        <div className="card-body">
          <p className="card-text">{name}</p>
          <p className="card-text">
            {discounted !== null && discounted !== undefined ? (
              <>
                <span className="text-decoration-line-through ">
                  {price} &euro;
                </span>
                <span className="mx-2">{discounted} &euro;</span>
              </>
            ) : (
              <span>{price} &euro;</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

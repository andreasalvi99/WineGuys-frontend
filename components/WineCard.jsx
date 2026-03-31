import { Link } from "react-router-dom";

export default function WineCard({ img, name, price }) {
  return (
    <div className="col">
      <div className="card h-100 bg-transparent border-0">
        <Link to={"/vini:slug"}>
          <img src={img} className="card-img-top" alt={name} />
        </Link>
        <div className="card-body">
          <p className="card-text">{name}</p>
          <p className="card-text">{price} &euro;</p>
        </div>
      </div>
    </div>
  );
}

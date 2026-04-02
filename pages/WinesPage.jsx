import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function WinesPage() {
  const [wines, setWines] = useState([]);

  function fetchWines() {
    axios.get("http://localhost:3000/vini").then((response) => {
      console.log(response.data);
      setWines(response.data);
    });
  }

  useEffect(fetchWines, []);

  return (
    <>
      <div className="row row-cols-4 g-3">
        {wines.map((wine) => {
          return (
            <div key={wine.id} className="col">
              <div className="card h-100">
                <Link to={"/vini/" + wine.slug}>
                  <img
                    src={`http://localhost:3000/wines/${wine.img}`}
                    className="card-img-top"
                    alt={wine.product_name}
                  />
                </Link>
                <div className="card-body">
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card’s content.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

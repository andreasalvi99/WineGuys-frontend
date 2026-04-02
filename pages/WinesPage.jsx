import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function WinesPage() {
  const [wines, setWines] = useState([]);
  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }

  function fetchWines() {
    axios.get("http://localhost:3000/vini").then((response) => {
      console.log(response.data);
      setWines(response.data);
    });
  }

  useEffect(fetchWines, []);

  return (
    <>
      <section id="wines-catalog">
        <div className="container p-3">
          <div className="row row-cols-5 g-4 playfair-display_special">
            {wines.map((wine) => {
              return (
                <div key={wine.id} className="col">
                  <div className="card h-100 p-3 wine-card bg-body-tertiary">
                    <Link to={"/vini/" + wine.slug}>
                      {/* <div className="layover">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                        >
                          Aggiungi al carrello
                        </button>
                      </div> */}
                      <img
                        src={`http://localhost:3000/wines/${wine.img}`}
                        className="card-img-top"
                        alt={wine.product_name}
                      />
                    </Link>
                    <div className="card-body text-center">
                      <p className="card-text">{wine.product_name}</p>
                      {wine.promotion_price !== null &&
                      wine.promotion_price !== undefined ? (
                        <>
                          <span className="text-decoration-line-through position-relative">
                            {wine.price}&euro;
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {calcDiscount(wine.price, wine.promotion_price)}%
                            </span>
                          </span>

                          <span className="d-block">
                            {wine.promotion_price}&euro;
                          </span>
                        </>
                      ) : (
                        <span>{wine.price}&euro;</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

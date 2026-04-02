import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContextObject";

export default function WinesPage() {
  const [wines, setWines] = useState([]);
  const { addToCart } = useContext(CartContext);

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
      <section id="wines-catalog" className="playfair-display_special">
        <div className="container p-3">
          <div className="d-flex justify-content-start">
            <h1 className="my-5 border-bottom border-dark">
              LA NOSTRA CANTINA
            </h1>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {wines.map((wine) => {
              return (
                <div key={wine.id} className="col">
                  <div className="card h-100 p-3 wine-card bg-body-tertiary">
                    <Link
                      to={"/vini/" + wine.slug}
                      className="text-black text-decoration-none"
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          {wine.promotion_price != null && (
                            <span className="badge text-bg-danger fs-6">
                              -{calcDiscount(wine.price, wine.promotion_price)}%
                            </span>
                          )}

                          {wine.stock_quantity > 0 &&
                            wine.stock_quantity <= 6 && (
                              <span className="text-danger">
                                Ne rimangono {wine.stock_quantity}
                              </span>
                            )}

                          {wine.stock_quantity === 0 && (
                            <span className="text-danger">Esaurito</span>
                          )}
                        </div>
                        <div>
                          {wine.promotion_price !== null &&
                          wine.promotion_price !== undefined ? (
                            <>
                              <p className="text-danger m-0">
                                &euro;{wine.promotion_price}
                              </p>
                              <p className="text-decoration-line-through m-0">
                                &euro;
                                {wine.price}
                              </p>
                            </>
                          ) : (
                            <p>&euro;{wine.price}</p>
                          )}
                        </div>
                      </div>
                      <img
                        src={wine.img_url}
                        className="card-img-top"
                        alt={wine.product_name}
                      />
                    </Link>
                    <div className="card-body text-center d-flex flex-column justify-content-between">
                      <p className="card-text">{wine.product_name}</p>
                      {wine.stock_quantity > 0 ? (
                        <button
                          onClick={() => addToCart(wine, 1)}
                          type="button"
                          className="btn btn-outline-danger"
                        >
                          Aggiungi al carrello
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled
                        >
                          Aggiungi al carrello
                        </button>
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

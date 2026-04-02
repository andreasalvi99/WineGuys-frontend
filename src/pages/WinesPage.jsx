import axios from "axios";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../context/CartContextObject";
import AllWinesCard from "../components/AllWinesCard";

export default function WinesPage() {
  const [wines, setWines] = useState([]);

  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }

  function fetchWines() {
    axios.get("http://localhost:3000/vini").then((response) => {
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
                <AllWinesCard
                  wine={wine}
                  key={wine.id}
                  slug={wine.slug}
                  promotion={wine.promotion_price}
                  price={wine.price}
                  quantity={wine.stock_quantity}
                  img={wine.img_url}
                  name={wine.product_name}
                  calcDiscount={calcDiscount}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

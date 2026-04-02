import axios from "axios";
import { useEffect, useState } from "react";

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
      <div className="row row-cols-4">
        {wines.map((wine) => {
          return (
            <div className="col">
              <div className="card">
                <img src="..." className="card-img-top" alt="..." />
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

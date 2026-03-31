import axios from "axios";
import { useEffect, useState } from "react";
import WineCard from "../components/WineCard";

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState([]);

  function fetchBestSellers() {
    axios.get("http://localhost:3000/vini/promo").then((response) => {
      console.log(response.data);
      setBestSellers(response.data);
    });
  }

  useEffect(fetchBestSellers, []);

  return (
    <>
      <section>
        <div className="container text-start">
          <p className="fs-5 my-3">
            <em>
              "WineGuys è una giovane realtà nata dall’idea di cinque amici
              uniti da una passione comune: il vino. Quello vero, non quello
              scelto a caso al supermercato perché “boh, l’etichetta è carina”.
              L’obiettivo è semplice: rendere il mondo del vino più accessibile,
              senza snobismi inutili e senza dover avere un sommelier interiore
              per scegliere una bottiglia decente. Attraverso il nostro
              e-commerce, selezioniamo vini di qualità provenienti da diverse
              regioni, dando spazio sia a cantine affermate che a piccoli
              produttori che meritano di essere scoperti. Ogni prodotto è
              accompagnato da descrizioni chiare e consigli pratici, pensati per
              aiutare chiunque, dal curioso al più esperto, a trovare il vino
              giusto per ogni occasione. WineGuys non è solo vendita online, ma
              un progetto che punta a costruire una community di appassionati,
              dove il vino diventa un’esperienza da condividere, senza
              complicazioni e senza pretese."
            </em>
          </p>
        </div>
      </section>
      <section id="best-sellers" className="">
        <div className="container text-center">
          <div className="row row-cols-3 gy-2">
            {bestSellers.map((bestSeller) => {
              return (
                <WineCard
                  key={bestSeller.id}
                  img={bestSeller.img_url}
                  name={bestSeller.product_name}
                  description={bestSeller.description}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

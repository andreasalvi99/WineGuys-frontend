import axios from "axios";
import { useEffect, useState } from "react";
import WineCard from "../components/WineCard";
import WineCardSliced from "../components/WineCardSliced";

export default function HomePage() {
  const [promos, setPromos] = useState([]);
  const [awarded, setAwarded] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [springWines, setSpringWines] = useState([]);

  useEffect(() => {
    async function fetchAllWines() {
      const promosResponse = await axios.get(
        "http://localhost:3000/vini/promo",
      );
      setPromos(promosResponse.data);

      const awardedResponse = await axios.get(
        "http://localhost:3000/vini/premiati",
      );
      setAwarded(awardedResponse.data);

      const bestSellersResponse = await axios.get(
        "http://localhost:3000/vini/piuvenduti",
      );
      setBestSellers(bestSellersResponse.data);

      const springWinesResponse = await axios.get(
        "http://localhost:3000/vini/primavera",
      );
      setSpringWines(springWinesResponse.data);
    }
    fetchAllWines();
  }, []);

  const promosToShow = promos.slice(0, 3);
  const awardedToShow = awarded.slice(0, 3);
  const bestSellersToShow = bestSellers.slice(0, 3);
  const springWinesToShow = springWines.slice(0, 3);

  return (
    <>
      <section
        id="hero-space"
        className="d-flex justify-content-start align-items-center playfair-display_special"
      >
        <div className="container d-flex justify-content-start align-items-center">
          <div className="hero-space-card">
            <h2 className="h1">
              WINEGUYS: IL VINO,
              <br /> SENZA TROPPI GIRI <br /> DI PAROLE.
            </h2>
            <p className="h3">
              SCOPRI LE NOSTRE SELEZIONI E <br /> UNISCITI ALLA COMMUNITY.
            </p>
            <button type="button" className="btn btn-outline-dark mt-2">
              ESPLORA IL CATALOGO
            </button>
          </div>
        </div>
      </section>
      <section className="my-4 p-3 playfair-display_special">
        <div className="container text-start">
          <div className="d-flex justify-content-start">
            <div>
              <h2 className="border-bottom border-black h1">IN PROMO</h2>
            </div>
          </div>
          <div className="card info-card border-0">
            <div className="card-body p-0">
              <p className="card-text fs-5 my-3">
                Che tu stia cercando un rosso deciso per la cena, un bianco
                fresco per l’aperitivo o uno spumante frizzante per brindare,
                qui trovi grandi vini a prezzi più leggeri rispetto alla normale
                enoteca. Approfitta degli sconti esclusivi e porta a casa
                qualità, carattere e gusto, tutti con un ottimo rapporto
                qualità‑prezzo.
              </p>
              <div className="d-flex justify-content-end">
                <a href="#">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-more"
                  >
                    SCOPRI DI PIÙ
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="promos" className="">
        <div className="container text-center p-3 d-none d-xl-block">
          <div className="row row-cols-5 gy-2">
            {promos.map((promo) => {
              return (
                <WineCard
                  key={promo.id}
                  img={promo.img_url}
                  name={promo.product_name}
                  price={promo.price}
                  slug={promo.slug}
                  discounted={promo.promotion_price}
                />
              );
            })}
          </div>
        </div>
        <div className="container text-center p-3 d-xl-none">
          <div className="row row-cols-3 gy-2">
            {promosToShow.map((promo) => {
              return (
                <WineCardSliced
                  key={promo.id}
                  img={promo.img_url}
                  name={promo.product_name}
                  price={promo.price}
                  slug={promo.slug}
                  discounted={promo.promotion_price}
                />
              );
            })}
          </div>
        </div>
      </section>
      <section className="my-4 p-3 playfair-display_special">
        <div className="container">
          <div className="d-flex justify-content-start">
            <div>
              <h2 className="border-bottom border-black h1">PREMIATI</h2>
            </div>
          </div>
          <div className="card info-card border-0">
            <div className="card-body p-0">
              <p className="card-text fs-5 my-3">
                Scopri la nostra selezione di vini premiati, autentiche gemme
                dell’enologia che hanno conquistato riconoscimenti nei più
                prestigiosi concorsi e guide del mondo del vino. Ogni bottiglia
                racconta la dedizione del produttore, il carattere del proprio
                terroir e l’equilibrio perfetto tra profumo, sapore e struttura.
                I premi ottenuti non sono solo un sigillo di qualità, ma una
                garanzia di un’esperienza sensoriale unica, capace di
                sorprendere anche gli amanti più esigenti.
              </p>
              <div className="d-flex justify-content-end">
                <a href="#">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-more"
                  >
                    SCOPRI DI PIÙ
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="awarded" className="">
        <div className="container text-center p-3 d-none d-xl-block">
          <div className="row row-cols-5 gy-2">
            {awarded.map((award) => {
              return (
                <WineCard
                  key={award.id}
                  img={award.img_url}
                  name={award.product_name}
                  price={award.price}
                  slug={award.slug}
                />
              );
            })}
          </div>
        </div>
        <div className="container text-center p-3 d-xl-none">
          <div className="row row-cols-3 gy-2">
            {awardedToShow.map((award) => {
              return (
                <WineCardSliced
                  key={award.id}
                  img={award.img_url}
                  name={award.product_name}
                  price={award.price}
                  slug={award.slug}
                />
              );
            })}
          </div>
        </div>
      </section>
      <section className="my-4 p-3 playfair-display_special">
        <div className="container">
          <div className="d-flex justify-content-start">
            <div>
              <h2 className="border-bottom border-black h1">PIÙ VENDUTI</h2>
            </div>
          </div>
          <div className="card info-card border-0">
            <div className="card-body p-0">
              <p className="card-text fs-5 my-3">
                Scopri la nostra selezione di vini premiati, riconosciuti per
                qualità ed eccellenza. Etichette selezionate che hanno
                conquistato esperti e guide del settore. Ogni bottiglia esprime
                carattere, equilibrio e cura nella produzione. Ideali per
                occasioni speciali o per chi cerca un’esperienza superiore.
                Porta in tavola vini che si distinguono davvero, non solo per
                l’etichetta.
              </p>
              <div className="d-flex justify-content-end">
                <a href="#">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-more"
                  >
                    SCOPRI DI PIÙ
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="best-sellers" className="">
        <div className="container text-center p-3 d-none d-xl-block">
          <div className="row row-cols-5 gy-2">
            {bestSellers.map((bestSeller) => {
              return (
                <WineCard
                  key={bestSeller.id}
                  img={bestSeller.img_url}
                  name={bestSeller.product_name}
                  price={bestSeller.price}
                  slug={bestSeller.slug}
                />
              );
            })}
          </div>
        </div>
        <div className="container text-center p-3 d-xl-none">
          <div className="row row-cols-3 gy-2">
            {bestSellersToShow.map((bestSeller) => {
              return (
                <WineCardSliced
                  key={bestSeller.id}
                  img={bestSeller.img_url}
                  name={bestSeller.product_name}
                  price={bestSeller.price}
                  slug={bestSeller.slug}
                />
              );
            })}
          </div>
        </div>
      </section>
      <section className="my-4 p-3 playfair-display_special">
        <div className="container">
          <div className="d-flex justify-content-start">
            <div>
              <h2 className="border-bottom border-black h1">PRIMAVERILI</h2>
            </div>
          </div>
          <div className="card info-card border-0">
            <div className="card-body p-0">
              <p className="card-text fs-5 my-3">
                Scopri la nostra selezione di vini primaverili, freschi e
                profumati, ideali per la stagione. Caratterizzati da note
                floreali e fruttate, offrono un gusto leggero e piacevole.
                Perfetti per aperitivi, pranzi all’aperto e momenti di relax.
                Dai bianchi aromatici ai rosati delicati, fino ai rossi giovani
                e vivaci. La scelta giusta per portare in tavola tutta la
                freschezza della primavera.
              </p>
              <div className="d-flex justify-content-end">
                <a href="#">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-more"
                  >
                    SCOPRI DI PIÙ
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="spring-wines" className="">
        <div className="container text-center p-3 d-none d-xl-block">
          <div className="row row-cols-5 gy-2">
            {springWines.map((springWine) => {
              return (
                <WineCard
                  key={springWine.id}
                  img={springWine.img_url}
                  name={springWine.product_name}
                  price={springWine.price}
                  slug={springWine.slug}
                />
              );
            })}
          </div>
        </div>
        <div className="container text-center p-3 d-xl-none">
          <div className="row row-cols-3 gy-2">
            {springWinesToShow.map((springWine) => {
              return (
                <WineCardSliced
                  key={springWine.id}
                  img={springWine.img_url}
                  name={springWine.product_name}
                  price={springWine.price}
                  slug={springWine.slug}
                />
              );
            })}
          </div>
        </div>
      </section>
      <section className="playfair-display_special mt-3">
        <div className="container text-start">
          <div className="d-flex justify-content-center">
            <div className="d-none d-xl-block">
              <div className="d-flex">
                <div>
                  <h1 className="border-bottom border-black">CHI SIAMO</h1>
                </div>
              </div>
              <p className="fs-5 my-3">
                <em>
                  "WineGuys è una giovane realtà nata dall’idea di cinque amici
                  uniti da una passione comune: il vino. Quello vero, non quello
                  scelto a caso al supermercato perché “boh, l’etichetta è
                  carina”. L’obiettivo è semplice: rendere il mondo del vino più
                  accessibile, senza snobismi inutili e senza dover avere un
                  sommelier interiore per scegliere una bottiglia decente.
                  Attraverso il nostro e-commerce, selezioniamo vini di qualità
                  provenienti da diverse regioni, dando spazio sia a cantine
                  affermate che a piccoli produttori che meritano di essere
                  scoperti. Ogni prodotto è accompagnato da descrizioni chiare e
                  consigli pratici, pensati per aiutare chiunque, dal curioso al
                  più esperto, a trovare il vino giusto per ogni occasione.
                  WineGuys non è solo vendita online, ma un progetto che punta a
                  costruire una community di appassionati, dove il vino diventa
                  un’esperienza da condividere, senza complicazioni e senza
                  pretese."
                </em>
              </p>
            </div>
            <div className="">
              <img
                src="../src/assets/img/wineguys_logo2.png"
                alt=""
                className="secondary-logo"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

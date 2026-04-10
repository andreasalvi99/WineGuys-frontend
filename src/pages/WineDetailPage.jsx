import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WineCard from "../components/WineCard.jsx";
import { useContext } from "react";
import { CartContext } from "../context/CartContextObject";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function WineDetailPage() {
  /*ROUTING e NAVIGATION*/
  const { slug } = useParams(); // qui è lo SLUG
  const navigate = useNavigate();

  /*STATE UI*/
  const [quantity, setQuantity] = useState(1);
  const [wine, setWine] = useState(null);
  const [relatedWines, setRelatedWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareList, setCompareList] = useState([]);

  /*CONTEXT*/
  const { addToCart, cart } = useContext(CartContext);

  /*FETCH DATI*/
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch del vino specifico
        const res = await fetch(`http://localhost:3000/vini/${slug}`);
        const data = await res.json();
        setWine(data.result);

        // Fetch dei vini correlati
        const relatedRes = await fetch("http://localhost:3000/vini");
        const relatedData = await relatedRes.json();

        // Filtra i vini correlati (stesso category_id ma slug diverso) e prendi solo i primi 3
        const filtered = (relatedData || [])
          .filter(
            (w) => w.slug !== slug && w.category_id === data.result.category_id,
          )
          .slice(0, 3);

        setRelatedWines(filtered);
      } catch (err) {
        setError(err.message);
        toast.error("Errore di caricamento", {
          description:
            "Non siamo riusciti a recuperare i dettagli di questo vino.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  /* Quando il vino viene caricato, lo aggiungo automaticamente alla lista di confronto per facilitare l'utente */
  useEffect(() => {
    if (wine) {
      setCompareList([wine]);
    }
  }, [wine]);

  /* GESTIONE STATI */
  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <>
        <section className="p-5">
          <div className="container text-center d-flex justify-content-center mt-5 playfair-display_special">
            <div className="not-search d-flex justify-content-center align-items-center">
              <p className="text-white h2">
                Sembra che il vino che tu stia cercando sia più difficile da
                trovare del previsto....
              </p>
            </div>
          </div>
        </section>
      </>
    );
  if (!wine) return <p>Nessun vino trovato</p>;

  /* LOGICA DISPONIBILITA' */

  /* Il vino è disponibile se la quantità in stock è maggiore di 0 */
  const isAvailable = wine.stock_quantity > 0;

  /*Funzione per calcolare lo sconto in percentuale*/
  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }

  /* GESTIONE CONFRONTO */
  function toggleCompare(wineToCompare) {
    // Controlla se esiste già
    const exists = compareList.find((w) => w.slug === wineToCompare.slug);

    if (exists) {
      // RIMOZIONE
      setCompareList((prev) =>
        prev.filter((w) => w.slug !== wineToCompare.slug),
      );
      toast.info("Rimosso dal confronto", {
        description: wineToCompare.product_name,
        duration: 1500,
      });
      return;
    }

    // Controlla il limite
    if (compareList.length >= 3) {
      toast.warning("Limite raggiunto", {
        description: "Puoi confrontare massimo 3 vini contemporaneamente.",
        duration: 1500,
      });
      return;
    }

    // Aggiunge al confronto
    setCompareList((prev) => [...prev, wineToCompare]);
    toast.success("Aggiunto al confronto", {
      description: wineToCompare.product_name,
      duration: 1500,
    });
  }
  // Calcoliamo quanto di questo vino è già nel carrello
  const itemInCart = cart.find((item) => item.slug === wine.slug);
  const currentQtyInCart = itemInCart ? itemInCart.quantity : 0;

  //variabile globale in modo tale che il carrello puo vedere il +
  const isMaxReached = wine
    ? quantity + currentQtyInCart >= wine.stock_quantity
    : false;

  const handlePlus = () => {
    //Creo un ID univoco per questo specifico vino nel carrello
    const toastId = `plus-action-${wine.slug}`;
    // Se ho raggiunto il limite di stock mostro il warning (considerando anche il carrello)
    if (isMaxReached) {
      toast.warning("Scorte esaurite", {
        id: toastId, // Sovrascrive il toast precedente, evitando lo spam
        description: `Non ci sono altre bottiglie di ${wine.product_name} disponibili.`,
        duration: 1500,
      });
      return; // Esci dalla funzione senza incrementare 'quantity'
    }

    // Se c'è ancora disponibilità, incrementa
    setQuantity((prev) => prev + 1);

    toast.success("Quantità aumentata", {
      id: toastId, // Sovrascrive il toast precedente, evitando lo spam
      description: `Hai aggiunto ${1} bottiglia di ${wine.product_name}`,
      duration: 1500,
    });
  };
  // Se la quantità è maggiore di 1 riduce di 1, altrimenti rimuove l'item dal carrello
  const handleMinus = () => {
    // Creiamo un ID univoco per questo specifico vino nel carrello
    const toastId = `minus-action-${wine.slug}`;
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      toast.info("Quantità ridotta", {
        id: toastId, // Sovrascrivo il toast precedente, evitando lo spam
        description: `Hai tolto ${1} bottiglia di ${wine.product_name}`,
        duration: 1500,
      });
    }
  };

  return (
    /* LAYOUT PRINCIPALE */
    <section
      className="playfair-display_special w-100"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      {/* CONTAINER PRINCIPALE */}
      <div
        className="container-fluid px-0"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* NAVIGATION */}
        <div
          className="d-flex justify-content-between mb-4 px-4 px-md-5"
          style={{
            backgroundColor: "#ffffff",
            paddingTop: "15px",
            paddingBottom: "15px",
          }}
        >
          {/*NAVIGATION BUTTONS*/}
          <button
            className="btn btn-outline-dark"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>
            Indietro
          </button>
        </div>

        {/* WRAPPER PRINCIPALE PER GESTIONE LAYOUT VERTICALE DELLA PAGINA */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* CARD DETTAGLIO IMMAGINE + INFO VINO */}
          <div style={{ backgroundColor: "#ffffff", padding: "40px 0" }}>
            <div className="container">
              <div className="row align-items-center">
                {/* IMG */}
                <div className="col-md-6 text-center">
                  <img
                    src={
                      wine.img ? `http://localhost:3000/wines/${wine.img}` : ""
                    }
                    alt={wine.product_name}
                    className="img-fluid"
                    style={{
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* INFO PRODOTTO */}
                <div className="col-md-6 text-center text-md-start">
                  {/*STOCK (LOW QUANTITY WARNING)*/}
                  {wine.stock_quantity > 0 && wine.stock_quantity <= 6 && (
                    <span className="text-danger blink fs-5">
                      <div className="red-pin bg-danger"></div>
                      {wine.stock_quantity} rimamenti
                    </span>
                  )}

                  {/*NOME PRODOTTO*/}
                  <h1 className="mb-3">{wine.product_name}</h1>

                  {/*PREZZO CON o SENZA SCONTO*/}
                  <h3 className="mb-3">
                    {wine?.promotion_price ? (
                      <>
                        {/*PREZZO ORIGINALE SCONTATO*/}
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "#999",
                          }}
                        >
                          {Number(wine.price).toFixed(2)} €
                        </span>{" "}
                        {/*PREZZO SCONTATO*/}
                        <span style={{ color: "#800020", fontWeight: "bold" }}>
                          {Number(wine.promotion_price).toFixed(2)} €
                        </span>{" "}
                        {/*PERCENTUALE DI SCONTO*/}
                        <span style={{ color: "red", fontSize: "0.9rem" }}>
                          -{calcDiscount(wine.price, wine.promotion_price)}%
                        </span>
                      </>
                    ) : (
                      <span style={{ color: "#800020" }}>
                        {Number(wine.price).toFixed(2)} €
                      </span>
                    )}
                  </h3>

                  {/*DESCRIZIONE PRODOTTO*/}
                  <p className="mt-3 fs-5" style={{ color: "#000000" }}>
                    {wine.description}
                  </p>

                  {/*ANNATA*/}
                  <p className="mt-3 fs-5">
                    <strong>Anno:</strong> {wine.vintage}
                  </p>

                  {/* SELEZIONE QUANTITA */}
                  <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mt-3">
                    {/*BOTTONE DECREMENTO*/}
                    <button
                      className="btn btn-outline-dark"
                      onClick={handleMinus}
                    >
                      -
                    </button>

                    {/*QUANTITA SELEZIONATA*/}
                    <span style={{ minWidth: "30px", textAlign: "center" }}>
                      {quantity}
                    </span>

                    {/*BOTTONE INCREMENTO*/}
                    <button
                      className="btn btn-outline-dark"
                      onClick={handlePlus}
                      disabled={false}
                    >
                      +
                    </button>
                  </div>

                  {/* ADD TO CART */}
                  <button
                    className={`btn mt-3 ${isAvailable ? "btn-outline-dark" : "btn-secondary"}`}
                    onClick={() => {
                      // 1. Troviamo quanto di questo vino è già nel carrello
                      const itemInCart = cart.find(
                        (item) => item.slug === wine.slug,
                      );

                      const currentQtyInCart = itemInCart
                        ? itemInCart.quantity
                        : 0;

                      // 2. Calcoliamo la disponibilità REALE (Stock totale - Quello che ho già nel carrello)
                      const remainingAvailability =
                        wine.stock_quantity - currentQtyInCart;

                      // 3. Verifichiamo se l'utente sta cercando di aggiungere più di quanto rimanga
                      if (quantity > remainingAvailability) {
                        toast.error("Quantità non disponibile", {
                          description:
                            remainingAvailability > 0
                              ? `Puoi aggiungere al massimo altre ${remainingAvailability} unità (ne hai già ${currentQtyInCart} nel carrello).`
                              : `Hai già aggiunto tutte le ${wine.stock_quantity} bottiglie disponibili al carrello.`,
                        });
                        return; // Blocchiamo l'esecuzione
                      }

                      // 4. Se il controllo passa, procediamo
                      addToCart(wine, quantity);
                      toast.success(`${wine.product_name} aggiunto!`, {
                        description: `${quantity} ${quantity > 1 ? "bottiglie aggiunte" : "bottiglia aggiunta"}.`,
                      });
                    }}
                    disabled={
                      !isAvailable ||
                      (cart.find((item) => item.slug === wine.slug)?.quantity ??
                        0) >= wine.stock_quantity
                    }
                  >
                    {isAvailable ? "Aggiungi al carrello" : "Non disponibile"}
                  </button>
                </div>
              </div>
            </div>

            {/* RELATED */}
            <div style={{ backgroundColor: "#ffffff", padding: "80px 0" }}>
              <h4 className="text-center mb-4">Potrebbero piacerti</h4>

              <div className="container">
                <div className="row justify-content-center">
                  {relatedWines.map((w) => (
                    <div
                      className="col-md-4 text-center mb-4 d-flex"
                      key={w.id}
                    >
                      <div
                        className="d-flex flex-column h-100"
                        style={{ maxWidth: "200px", margin: "0 auto" }}
                      >
                        <WineCard
                          img={
                            w.img ? `http://localhost:3000/wines/${w.img}` : ""
                          }
                          name={w.product_name}
                          price={w.price}
                          discounted={w.promotion_price}
                          slug={w.slug}
                        />

                        {/*BOTTONE CONFRONTO*/}
                        <button
                          className="btn btn-sm btn-outline-dark mt-auto"
                          onClick={() => toggleCompare(w)}
                        >
                          {compareList.find((c) => c.slug === w.slug)
                            ? "Rimuovi confronto"
                            : "Confronta"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

{/* COMPARISON TABLE */}
  {compareList.length >= 2 && (
  <>
    {/* DESKTOP TABLE */}
    <div
      className="container mt-5 d-none d-md-block"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      <h4 className="text-center mb-4">Confronto vini</h4>

      <table className="table table-bordered text-center">
        <thead>
          {/* IMMAGINI */}
          <tr>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              WineGuys
            </th>

            {compareList.map((w) => (
              <th key={w.slug}>
                <img
                  src={`http://localhost:3000/wines/${w.img}`}
                  alt={w.product_name}
                  style={{
                    height: "120px",
                    objectFit: "contain",
                    marginBottom: "10px",
                  }}
                />
              </th>
            ))}
          </tr>

          {/* NOMI */}
          <tr>
            <th>Caratteristica</th>
            {compareList.map((w) => (
              <th key={w.slug}>{w.product_name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* PREZZO */}
          <tr>
            <td>Prezzo</td>
            {compareList.map((w) => (
              <td key={w.slug}>{w.price}€</td>
            ))}
          </tr>

          {/* ANNATA */}
          <tr>
            <td>Annata</td>
            {compareList.map((w) => (
              <td key={w.slug}>{w.vintage}</td>
            ))}
          </tr>

          {/* DISPONIBILITÀ */}
          <tr>
            <td>Disponibilità</td>
            {compareList.map((w) => (
              <td key={w.slug}>{w.stock_quantity}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>

    {/* MOBILE VERSION */}
    <div className="container mt-5 d-block d-md-none">
      <h4 className="text-center mb-4">Confronto vini</h4>

      {compareList.map((w) => (
        <div key={w.slug} className="card mb-3 p-3 text-center shadow-sm">
          
          <img
            src={`http://localhost:3000/wines/${w.img}`}
            alt={w.product_name}
            style={{
              height: "120px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />

          <h5>{w.product_name}</h5>

          <p><strong>Prezzo:</strong> {w.price}€</p>
          <p><strong>Annata:</strong> {w.vintage}</p>
          <p><strong>Disponibilità:</strong> {w.stock_quantity}</p>
        </div>
      ))}
    </div>
  </>
)}

            {/*PHILOSOPHY*/}
            <div
              style={{
                marginTop: "5px",
                padding: "60px 20px",
                textAlign: "center",
                maxWidth: "700px",
                marginInline: "auto",
                color: "#000000",
              }}
            >
              <h3 style={{ marginBottom: "20px", fontStyle: "italic" }}>
                Un’esperienza che va oltre il vino
              </h3>

              <p style={{ fontSize: "15px", lineHeight: "1.8" }}>
                Ogni bottiglia racconta una storia fatta di territorio, passione
                e tradizione. Scopri la nostra selezione e lasciati guidare in
                un viaggio tra le migliori etichette, pensate per accompagnare
                ogni momento speciale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WineDetailPage;

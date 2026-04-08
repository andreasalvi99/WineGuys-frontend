import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WineCard from "../components/WineCard.jsx";
import { useContext } from "react";
import { CartContext } from "../context/CartContextObject";
import { useNavigate } from "react-router-dom";

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
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  console.log(error);

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
  function toggleCompare(wine) {
  setCompareList((prev) => {
    const exists = prev.find((w) => w.slug === wine.slug);

    if (exists) {
      return prev.filter((w) => w.slug !== wine.slug);
    }

    if (prev.length >= 2) return prev;

    return [...prev, wine];
  });
  }

  

  /* RENDER PRINCIPALE */

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

      {/* ADD TO CART */}
      <button
        className={`btn mt-3 ${isAvailable ? "btn-outline-dark" : "btn-secondary"}`}
        onClick={() => addToCart(wine, quantity)}
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
      <div className="col-md-4 text-center mb-4 d-flex" key={w.id}>
      <div className="d-flex flex-column h-100" style={{ maxWidth: "200px", margin: "0 auto" }}>
      <WineCard
        img={ w.img ? `http://localhost:3000/wines/${w.img}` : ""}                  
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
      {compareList.length === 2 && (
      <div className="container mt-5">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      <h4 className="text-center mb-4">Confronto vini</h4>

      <table className="table table-bordered text-center">
        
        <thead>
          {/* IMMAGINI */}
          <tr>
            <th
            style={{
            verticalAlign: "middle",
            textAlign: "center",
            fontWeight: "700",
            letterSpacing: "1px"
            }}
            >WineGuys</th>
  


            <th>
              <img
                src={`http://localhost:3000/wines/${compareList[0].img}`}
                alt={compareList[0].product_name}
                style={{ height: "120px", objectFit: "contain", marginBottom: "10px" }}
              />
            </th>

            <th>
              <img
                src={`http://localhost:3000/wines/${compareList[1].img}`}
                alt={compareList[1].product_name}
                style={{ height: "120px", objectFit: "contain", marginBottom: "10px" }}
              />
            </th>
          </tr>

          {/* NOMI */}
          <tr>
            <th>Caratteristica</th>
            <th>{compareList[0].product_name}</th>
            <th>{compareList[1].product_name}</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Prezzo</td>
            <td>{compareList[0].price}€</td>
            <td>{compareList[1].price}€</td>
          </tr>

          <tr>
            <td>Annata</td>
            <td>{compareList[0].vintage}</td>
            <td>{compareList[1].vintage}</td>
          </tr>

          <tr>
            <td>Disponibilità</td>
            <td>{compareList[0].stock_quantity}</td>
            <td>{compareList[1].stock_quantity}</td>
          </tr>
        </tbody>

      </table>

      </div>
      </div>
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

      {/* FOOTER */}
      <footer
        style={{
        marginTop: "auto",
        padding: "20px 0",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #000000",
        textAlign: "center",
        }}
      >
      <p style={{ margin: 0, fontSize: "14px", color: "#000000" }}>
         © 2026 – Made with WineGuys🍷
      </p>
      </footer>
      </div>
      </div>
    </section>
  );
}

export default WineDetailPage;

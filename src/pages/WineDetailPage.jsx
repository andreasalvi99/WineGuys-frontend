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

  /* GESTIONE STATI */
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!wine) return <p>Nessun vino trovato</p>;

  /* LOGICA DISPONIBILITA' */

  /* Il vino è disponibile se la quantità in stock è maggiore di 0 */
  const isAvailable = wine.stock_quantity > 0;

  /*Funzione per calcolare lo sconto in percentuale*/
  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
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
      
    /* CONTAINER PRINCIPALE */
    <div
      className="container-fluid px-0"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
    >
    /* NAVIGATION */
    <div
      className="d-flex justify-content-between mb-4 px-4 px-md-5"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: "15px",
        paddingBottom: "15px",
        }}
    >
    /*NAVIGATION BUTTONS*/
    <button
      className="btn btn-outline-dark"
      onClick={() => navigate("/")}
    >
      Home
    </button>

    <button
      className="btn btn-outline-dark"
      onClick={() => navigate(-1)}
    >
      Indietro
    </button>
    </div>

    /* WRAPPER PRINCIPALE PER GESTIONE LAYOUT VERTICALE DELLA PAGINA */
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

    /* CARD DETTAGLIO IMMAGINE + INFO VINO */
    <div style={{ backgroundColor: "#ffffff", padding: "40px 0" }}>
    <div className="container">
    <div className="row align-items-center">
                
    /* IMG */
    <div className="col-md-6 text-center">
    <img 
      src={wine.img ? `http://localhost:3000/wines/${wine.img}` : ""}
      alt={wine.product_name}
        className="img-fluid"
        style={{
          maxHeight: "400px",
          objectFit: "contain",
          }}
     />
     </div>

    /* INFO PRODOTTO */
    <div className="col-md-6 text-center text-md-start">
      
      /*STOCK (LOW QUANTITY WARNING)*/
      {wine.stock_quantity > 0 && wine.stock_quantity <= 6 && (
      <span className="text-danger blink fs-5">
      <div className="red-pin bg-danger"></div>
        {wine.stock_quantity} rimamenti
      </span>
      )}

      /*NOME PRODOTTO*/
      <h1 className="mb-3">{wine.product_name}</h1>
        
        /*PREZZO CON o SENZA SCONTO*/
        <h3 className="mb-3">
          {wine?.promotion_price ? (
        <>
        /*PREZZO ORIGINALE SCONTATO*/
        <span
         style={{
          textDecoration: "line-through",                  
          color: "#999",                                   
          }}                                
        >
          {Number(wine.price).toFixed(2)} €
        </span>{" "}

        /*PREZZO SCONTATO*/
        <span style={{ color: "#800020", fontWeight: "bold" }}>                
         {Number(wine.promotion_price).toFixed(2)} €                 
        </span>{" "}

        /*PERCENTUALE DI SCONTO*/               
        <span style={{ color: "red", fontSize: "0.9rem" }}>
         -{calcDiscount(wine.price, wine.promotion_price)}%              
        </span>                  
        </>                
        ) : (   
          
        /*PREZZO NORMALE SE NON C'E' SCONTO*/
        <span style={{ color: "#800020" }}>            
          {Number(wine.price).toFixed(2)} €            
         </span>                
        )}             
        </h3>

        /*DESCRIZIONE PRODOTTO*/          
        <p className="mt-3 fs-5" style={{ color: "#000000" }}>
         {wine.description}         
        </p>

        /*ANNATA*/            
        <p className="mt-3 fs-5">         
        <strong>Anno:</strong> {wine.vintage}
        </p>          
                    
      /* SELEZIONE QUANTITA */
      <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mt-3">

        /*BOTTONE DECREMENTO*/            
        <button            
          className="btn btn-outline-dark"            
          onClick={() =>            
          setQuantity((prev) => Math.max(1, prev - 1))              
          }           
        >
          -
        </button>

        /*QUANTITA SELEZIONATA*/
        <span style={{ minWidth: "30px", textAlign: "center" }}>
          {quantity}            
        </span> 

        /*BOTTONE INCREMENTO*/           
        <button
          className="btn btn-outline-dark"
          onClick={() => setQuantity((prev) => prev < wine.stock_quantity ? prev + 1 : prev)}
        >
          +
        </button>
        </div>

      /* ADD TO CART */
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

      /* RELATED */
      <div style={{ backgroundColor: "#ffffff", padding: "80px 0" }}>

      <h4 className="text-center mb-4">Potrebbero piacerti</h4>

      <div className="container">
      <div className="row justify-content-center">
        {relatedWines.map((w) => (
      <div className="col-md-4 text-center mb-4" key={w.id}>
      <div style={{ maxWidth: "200px", margin: "0 auto" }}>
      <WineCard
        img={ w.img ? `http://localhost:3000/wines/${w.img}` : ""}                  
             name={w.product_name}         
             price={w.price}             
             discounted={w.promotion_price}              
             slug={w.slug}            
      />                    
      </div>                  
      </div>    
        ))}
      </div>
      </div>
      </div>

      /*PHILOSOPHY*/
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

      /* FOOTER */
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

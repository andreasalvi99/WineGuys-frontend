import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WineCard from "../components/WineCard.jsx";  
import { useContext } from "react";
import { CartContext } from "../context/CartContextObject";

function WineDetailPage() { 
  const [quantity, setQuantity] = useState(1);
  const { slug } = useParams(); // qui è lo SLUG
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
 
  

  const [wine, setWine] = useState(null);
  const [relatedWines, setRelatedWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:3000/vini/${slug}`);
        const data = await res.json();

        

        setWine(data.result);
        const relatedRes = await fetch("http://localhost:3000/vini");
        const relatedData = await relatedRes.json();
        

        const filtered = (relatedData || [])
        .filter(w => 
        w.slug !== slug && 
        w.category_id === data.result.category_id
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

  //  gestione stati
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!wine) return <p>Nessun vino trovato</p>;
  
  
  const isAvailable = wine.stock_quantity > 0;
  
  

  {/* funzione per calcolare lo sconto in percentuale */}
  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }
  


  {/* RENDER PRINCIPALE */}
  return (
  <section
    className="playfair-display_special w-100"
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
    
    }}
  >
    <div
      className="container-fluid px-0"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* NAV */}
     <div
     className="d-flex justify-content-between mb-4 px-4 px-md-5"
     style={{
     backgroundColor:"#ffffff",
     paddingTop: "15px",
     paddingBottom: "15px"
     }}
     >
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

      {/* 🔥 WRAPPER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

      {/* CARD DETTAGLIO */}
      
      <div style={{ backgroundColor: "#ffffff", padding: "40px 0" }}>

      <div className="container">

    <div className="row align-items-center">

      {/* IMG */}
      <div className="col-md-6 text-center">
        <img
          src={
            wine.img
              ? `http://localhost:3000/wines/${wine.img}`
              : ""
          }
          alt={wine.product_name}
          className="img-fluid"
          style={{
            maxHeight: "400px",
            objectFit: "contain"
          }}
        />
      </div>

     

        {/* INFO */}
        <div className="col-md-6 text-center text-md-start">
          <h1 className="mb-3">{wine.product_name}</h1>

          <h3 className="mb-3">
          {wine?.promotion_price ? (
           <>
            <span style={{ textDecoration: "line-through", color: "#999" }}>
             {Number(wine.price).toFixed(2)} €
            </span>{" "}
          <span style={{ color: "#800020", fontWeight: "bold" }}>
          {Number(wine.promotion_price).toFixed(2)} €
          </span>{" "}
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

          <p className="mt-3 fs-5" style={{ color: "#000000" }}>
            {wine.description}
          </p>

          <p className="mt-3 fs-5">
            <strong>Anno:</strong> {wine.vintage}
          </p>

          
          {/* QUANTITY */}
         <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mt-3">
  
         <button
         className="btn btn-outline-dark"
          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
         >
          -
         </button>

         <span style={{ minWidth: "30px", textAlign: "center" }}>
          {quantity}
         </span>

         <button
          className="btn btn-outline-dark"
          onClick={() => setQuantity(prev => prev + 1)}
         >
         +
         </button>

         </div>
         
         
        {/* ADD TO CART */}
          <button
          className={`btn mt-3 ${isAvailable ? "btn-outline-dark" : "btn-secondary"}`}
          onClick={() => addToCart(wine, quantity)}
          disabled={!isAvailable}
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
          className="col-md-4 text-center mb-4"
          key={w.id}
        >
          <div style={{ maxWidth: "200px", margin: "0 auto" }}>
            <WineCard
              img={
                w.img
                  ? `http://localhost:3000/wines/${w.img}`
                  : ""
              }
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

      {/*PHILOSOPHY*/}
      <div
      style={{
      marginTop: "5px",
      padding: "60px 20px",
      textAlign: "center",
      maxWidth: "700px",
      marginInline: "auto",
      color: "#333"
      }}
      >
     <h3 style={{ marginBottom: "20px", fontStyle: "italic" }}>
      Un’esperienza che va oltre il vino
     </h3>

     <p style={{ fontSize: "15px", lineHeight: "1.8" }}>
     Ogni bottiglia racconta una storia fatta di territorio, passione e tradizione.
     Scopri la nostra selezione e lasciati guidare in un viaggio tra le migliori
     etichette, pensate per accompagnare ogni momento speciale.
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
          textAlign: "center"
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

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WineCard from "../components/WineCard";  

function WineDetailPage() {
  const { slug } = useParams(); // qui è lo SLUG
  const navigate = useNavigate();

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

        console.log(data); // debug

        setWine(data.result);
        const relatedRes = await fetch("http://localhost:3000/vini");
        const relatedData = await relatedRes.json();
        console.log("RELATED DATA:", relatedData); // debug

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

  return (
  <section
    className="py-5 playfair-display_special"
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}
  >
    <div
      className="container-fluid px-4"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}
    >

      {/* NAV */}
      <div className="d-flex justify-content-between mb-4 px-md-4">
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

      {/* CARD DETTAGLIO */}
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
        <div className="col-md-6">
          <h1 className="mb-3">{wine.product_name}</h1>

          <h3 className="mb-3" style={{ color: "#800020" }}>
            {wine?.price
              ? Number(wine.price).toFixed(2) + " €"
              : "N/A"}
          </h3>

          <p className="mt-3 fs-5" style={{ color: "#000000" }}>
            {wine.description}
          </p>

          <p className="mt-3 fs-5">
            <strong>Anno:</strong> {wine.vintage}
          </p>

          <button className="btn btn-dark mt-3">
            Aggiungi al carrello
          </button>
        </div>
      </div>

      <hr className="my-5" />

      {/* RELATED */}
      <h4 className="text-center mb-4">Potrebbero piacerti</h4>

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
                slug={w.slug}
              />
            </div>
          </div>
        ))}
      </div>

      {/*PHILOSOPHY*/}
      <div
      style={{
      marginTop: "60px",
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

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "auto",
          padding: "20px 0",
          backgroundColor: "#f8f8f8",
          borderTop: "1px solid #ddd",
          textAlign: "center"
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          © 2026 WineGuys – Made with 🍷
        </p>
      </footer>

    </div>
  </section>
);
}

export default WineDetailPage;

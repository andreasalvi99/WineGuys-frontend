import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function WineDetailPage() {
  const { slug } = useParams(); // qui è lo SLUG
  const navigate = useNavigate();

  const [wine, setWine] = useState(null);
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
  <section className="py-5 playfair-display_special">
    <div className="container">

      {/* NAV */}
      <div className="d-flex justify-content-between mb-4">
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
    </div>
  </section>
);
}

export default WineDetailPage;

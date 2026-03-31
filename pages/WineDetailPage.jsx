import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function WineDetailPage() {
  const { id } = useParams(); // qui è lo SLUG
  const navigate = useNavigate();

  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:3000/vini/${id}`);
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
  }, [id]);

  //  gestione stati
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!wine) return <p>Nessun vino trovato</p>;

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        border: "1px solid #ddd",
        padding: "30px",
        borderRadius: "10px",
        width: "300px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
    {/*Button return Home*/}
    <button
    onClick={() => navigate("/")}
    style={{
    padding: "6px 12px",
    fontSize: "14px",
    backgroundColor: "#e0e0e0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "10px",
    marginRight: "5px"
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#d5d5d5")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
    >
     🏠 Torna alla home
    </button>

      {/*Button return Back*/}
       <button
        onClick={() => navigate(-1)}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
      >
        ← Torna indietro
      </button>

      

      <img
       src={`http://localhost:3000/wines/${wine.img}`}
       alt={wine.product_name}
       style={{
       width: "100%",
       borderRadius: "10px",
       marginBottom: "15px"
       }}
      />

      <h1 style={{ marginTop: "20px" }}>{wine.product_name}</h1>

      <p style={{ fontStyle: "italic", color: "gray" }}>
        {wine.description}
      </p>

      <div style={{ marginTop: "20px" }}>
        <p><strong>ID:</strong> {wine.id}</p>
        <p><strong>Anno:</strong> {wine.vintage}</p>
        <p>
          <strong>Prezzo:</strong>{" "}
          {wine?.price ? Number(wine.price).toFixed(2) + "€" : "N/A"}
        </p>
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#800020",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#a00030")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#800020")}
      >
        Aggiungi al carrello
      </button>
    </div>
  );
}

export default WineDetailPage;
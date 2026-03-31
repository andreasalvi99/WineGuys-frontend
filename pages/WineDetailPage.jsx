import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function WineDetailPage() {
  const { id } = useParams(); // per ora non usato
  const navigate = useNavigate();

  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/vini/chianti-classico");
      const data = await res.json();

      setWine(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  // Loading
  if (loading) return <p>Loading...</p>;

  // Error
  if (error) return <p>{error}</p>;

  // Safety check
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
        marginRight: "auto"
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        ← Torna indietro
      </button>

      <h1 style={{ marginTop: "20px" }}>{wine.name}</h1>

      <p style={{ fontStyle: "italic", color: "gray" }}>
        {wine.description}
      </p>

      <div style={{ marginTop: "20px" }}>
        <p><strong>ID:</strong> {wine.id}</p>
        <p><strong>Anno:</strong> {wine.year}</p>
        <p><strong>Prezzo:</strong> €{wine.price.toFixed(2)}</p>
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#800020",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Aggiungi al carrello
      </button>
    </div>
  );
}

export default WineDetailPage;
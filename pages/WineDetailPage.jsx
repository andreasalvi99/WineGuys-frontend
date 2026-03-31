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
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px"
    }}
  >
    {/* BOTTONI NAVIGAZIONE */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        marginBottom: "15px"
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: "#e0e0e0",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer"
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "#d5d5d5")
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = "#e0e0e0")
        }
      >
        🏠 Home
      </button>

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer"
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "#e0e0e0")
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = "#f5f5f5")
        }
      >
        ← Indietro
      </button>
    </div>

    {/* CARD */}
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "white"
      }}
    >
      {/* IMG */}
      <img
        src={
          wine.img
            ? `http://localhost:3000/wines/${wine.img}`
            : ""
        }
        alt={wine.product_name}
        style={{
          width: "100%",
          maxHeight: "350px",
          objectFit: "contain",
          marginBottom: "15px"
        }}
      />

      {/* NOME */}
      <h2 style={{ marginBottom: "10px" }}>
        {wine.product_name}
      </h2>

      {/* PREZZO */}
      <p
        style={{
          fontSize: "26px",
          fontWeight: "700",
          color: "#800020",
          margin: "10px 0"
        }}
      >
        {wine?.price
          ? Number(wine.price).toFixed(2) + " €"
          : "N/A"}
      </p>

      {/* DESCRIZIONE */}
      <p
        style={{
          color: "#666",
          marginTop: "10px"
        }}
      >
        {wine.description}
      </p>

      {/* INFO */}
      <p>
        <strong>Anno:</strong> {wine.vintage}
      </p>

      {/* BUTTON CARRELLO */}
      <button
        style={{
          marginTop: "15px",
          minWidth: "200px",
          padding: "12px",
          backgroundColor: "#800020",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto"
        }}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = "#a00030")
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = "#800020")
        }
      >
        Aggiungi al carrello
      </button>
    </div>
  </div>
);
}

export default WineDetailPage;
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
      maxWidth: "900px",
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
        marginBottom: "20px",
        alignItems: "center"
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "8px",
          fontSize: "14px",
          backgroundColor: "#e0e0e0",
          border: "1px solid #ccc",
          borderRadius: "6px",
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
          padding: "8px",
          fontSize: "14px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ccc",
          borderRadius: "6px",
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
        display: "flex",
        flexDirection: window.innerWidth > 768 ? "row" : "column",
        gap: "30px",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        alignItems: "center"
      }}
    >

      {/* IMG */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <img
          src={
            wine.img
              ? `http://localhost:3000/wines/${wine.img}`
              : ""
          }
          alt={wine.product_name}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "contain"
          }}
        />
      </div>

      {/* CONTENUTO */}
      <div
        style={{
          flex: 1,
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start"
        }}
      >
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

        {/* ANNO */}
        <p style={{ marginTop: "10px" }}>
          <strong>Anno:</strong> {wine.vintage}
        </p>

        {/* BOTTONE */}
        <button
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            backgroundColor: "#800020",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "auto",
            minWidth: "200px"
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
  </div>
);
}

export default WineDetailPage;
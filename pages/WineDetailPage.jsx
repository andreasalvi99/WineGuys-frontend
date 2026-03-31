import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function WineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // ===============================
    //  MOCK DATI (TEMPORANEO)
    // ===============================
    const fakeData = {
      1: {
        name: "Chianti Classico",
        price: 12.99,
        year: 2020,
        description: "Vino rosso toscano corposo."
      },
      2: {
        name: "Barolo",
        price: 25.5,
        year: 2018,
        description: "Vino piemontese elegante."
      },
      3: {
        name: "Prosecco",
        price: 8.99,
        year: 2022,
        description: "Spumante fresco e leggero."
      }
    };

    const fakeWine = fakeData[Number(id)];

    setTimeout(() => {
      if (fakeWine) {
        setWine({ id, ...fakeWine });
      } else {
        setError("Vino non trovato");
      }
      setLoading(false);
    }, 500);

    // ===============================
    //  BACKEND (DA ATTIVARE)
    // ===============================
    /*
    fetch(`http://localhost:3000/api/wines/${id}`)
      .then(res => res.json())
      .then(data => {
        setWine(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
      */
    

  }, [id]);

  // Loading
  if (loading) return <p>Loading...</p>;

  // Error
  if (error) return <p>{error}</p>;

return (
  <div style={{
    textAlign: "center",
    marginTop: "50px",
    border: "1px solid #ddd",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    marginLeft: "auto",
    marginRight: "auto"
  }}>
    
    <button onClick={() => navigate(-1)}>
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
  onMouseOver={(e) => e.target.style.backgroundColor = "#a00030"}
  onMouseOut={(e) => e.target.style.backgroundColor = "#800020"}
>
  Aggiungi al carrello
</button>

  </div>
);
}

export default WineDetailPage;
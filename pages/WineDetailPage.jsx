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
    <div>
      <button onClick={() => navigate(-1)}>
        ← Torna indietro
      </button>

      <h1>{wine.name}</h1>

      <p>{wine.description}</p>

      <p><strong>ID:</strong> {wine.id}</p>
      <p><strong>Anno:</strong> {wine.year}</p>
      <p><strong>Prezzo:</strong> €{wine.price.toFixed(2)}</p>

      <button>Aggiungi al carrello</button>
    </div>
  );
}

export default WineDetailPage;
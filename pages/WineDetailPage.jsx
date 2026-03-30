import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function WineDetailPage() {
  const { id } = useParams(); // prende l'id dalla URL (/vini/:id)
  const navigate = useNavigate();

  const [wine, setWine] = useState(null); // dati vino
  const [loading, setLoading] = useState(true); // stato loading
  const [error, setError] = useState(null); // gestione errori

  useEffect(() => {
    //  RESET stato quando cambia id
    setLoading(true);
    setError(null);

    // ===============================
    //  MOCK DATI (TEMPORANEO)
    // ===============================
    //  QUESTO BLOCCO ANDRÀ SOSTITUITO CON LA FETCH AL BACKEND
    const fakeData = {
      1: { name: "Chianti Classico", price: 12.99, year: 2020 },
      2: { name: "Barolo", price: 25.5, year: 2018 },
      3: { name: "Prosecco", price: 8.99, year: 2022 }
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
    //  FUTURO (BACKEND)
    // ===============================
    /*
    fetch(http://localhost:3000/api/wines/${id})
      .then(res => {
        if (!res.ok) {
          throw new Error("Errore nel recupero vino");
        }
        return res.json();
      })
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

  // ===============================
  //  LOADING
  // ===============================
  if (loading) return <p>Loading...</p>;

  // ===============================
  //  ERRORE
  // ===============================
  if (error) return <p>{error}</p>;

  // ===============================
  //  UI
  // ===============================
  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>
        ← Torna indietro
      </button>

      <h1>{wine.name}</h1>

      <div>
        <p><strong>ID:</strong> {wine.id}</p>
        <p><strong>Prezzo:</strong> €{wine.price}</p>
        <p><strong>Anno:</strong> {wine.year}</p>
      </div>
    </div>
  );
}

export default WineDetailPage;
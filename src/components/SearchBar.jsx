import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [wines, setWines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/vini")
      .then((res) => setWines(res.data))
      .catch((err) => console.error("Errore:", err));
  }, []);

  // Filtriamo i vini in tempo reale
  const suggestions = query.length >= 2 
    ? wines.filter(w => 
        w.product_name.toLowerCase().includes(query.toLowerCase()) ||
        (w.type && w.type.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 3)
    : [];

  const handleSelect = (slug) => {
    navigate(`/vini/${slug}`);
    setQuery("");
  };

  return (
    <div className="position-relative" style={{ width: "200px" }}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="form-control form-control-sm border-secondary-subtle"
          placeholder="Cerca vino..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1000, fontSize: '0.85rem' }}>
          {suggestions.map((wine) => (
            <li 
              key={wine.id}
              className="list-group-item list-group-item-action py-1 cursor-pointer"
              onClick={() => handleSelect(wine.slug)}
            >
              <strong>{wine.product_name}</strong>
              <div className="text-muted small">{wine.type}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
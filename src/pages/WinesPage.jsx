import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AllWinesCard from "../components/AllWinesCard";

export default function WinesPage() {
  // stato per tutti i vini dal database
  const [wines, setWines] = useState([]);

  // stati per i filtri selezionati dall'utente
  const [filterAnnata, setFilterAnnata] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterVitigno, setFilterVitigno] = useState("");
  const [filterPrezzo, setFilterPrezzo] = useState("");

  // stato per i valori unici dei filtri - caricati una volta sola
  const [allWines, setAllWines] = useState([]);

  // legge e aggiorna i parametri nell'URL
  const [searchParams, setSearchParams] = useSearchParams();

  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }

  // carica tutti i vini una volta sola per popolare i dropdown
  useEffect(() => {
    axios.get("http://localhost:3000/vini").then((response) => {
      setAllWines(response.data);
    });
  }, []);

  // chiama il backend con i filtri ogni volta che cambiano i searchParams
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    axios
      .get(`http://localhost:3000/vini?${params.toString()}`)
      .then((response) => {
        setWines(response.data);
      });
  }, [searchParams]);

  // al caricamento legge i filtri dall'URL
  useEffect(() => {
    setFilterAnnata(searchParams.get("annata") || "");
    setFilterTipo(searchParams.get("tipo") || "");
    setFilterVitigno(searchParams.get("vitigno") || "");
    setFilterPrezzo(searchParams.get("prezzo") || "");
  }, []);

  // aggiorna l'URL quando cambiano i filtri
  function updateFilters(key, value) {
    const newParams = new URLSearchParams(searchParams);
    if (value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  }

  return (
    <>
      <section id="wines-catalog" className="playfair-display_special">
        <div className="container p-3">
          <div className="d-flex justify-content-start">
            <h1 className="my-5 border-bottom border-dark">
              LA NOSTRA CANTINA
            </h1>
          </div>
          {/* barra dei filtri */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            {/* filtro per annata - prende i valori unici dal database */}
            <select
              className="btn btn-outline-dark"
              style={{ width: "150px" }}
              value={filterAnnata}
              onChange={(e) => {
                setFilterAnnata(e.target.value);
                updateFilters("annata", e.target.value);
              }}
            >
              <option value="">Annata</option>
              {[...new Set(allWines.map((w) => w.vintage))].sort().map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            {/* filtro per tipologia - prende i valori unici dal database */}
            <select
              className="btn btn-outline-dark"
              style={{ width: "150px" }}
              value={filterTipo}
              onChange={(e) => {
                setFilterTipo(e.target.value);
                updateFilters("tipo", e.target.value);
              }}
            >
              <option value="">Tipologia</option>
              {[...new Set(allWines.map((w) => w.type))].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* filtro per vitigno - prende i valori unici dal database */}
            <select
              className="btn btn-outline-dark"
              style={{ width: "150px" }}
              value={filterVitigno}
              onChange={(e) => {
                setFilterVitigno(e.target.value);
                updateFilters("vitigno", e.target.value);
              }}
            >
              <option value="">Vitigno</option>
              {[...new Set(allWines.map((w) => w.grape))].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* filtro per fascia di prezzo - valori fissi */}
            <select
              className="btn btn-outline-dark"
              style={{ width: "150px" }}
              value={filterPrezzo}
              onChange={(e) => {
                setFilterPrezzo(e.target.value);
                updateFilters("prezzo", e.target.value);
              }}
            >
              <option value="">Prezzo</option>
              <option value="0-20">Fino a €20</option>
              <option value="20-50">€20 - €50</option>
              <option value="50+">Oltre €50</option>
            </select>

            {/* bottone per resettare tutti i filtri */}
            <button
              className="btn btn-dark"
              style={{ width: "110px" }}
              onClick={() => {
                setFilterAnnata("");
                setFilterTipo("");
                setFilterVitigno("");
                setFilterPrezzo("");
                setSearchParams({});
              }}
            >
              Resetta filtri
            </button>
          </div>

          {/* griglia dei vini filtrati dal backend */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-2">
            {wines.map((wine) => {
              return (
                <AllWinesCard
                  wine={wine}
                  key={wine.id}
                  slug={wine.slug}
                  promotion={wine.promotion_price}
                  price={wine.price}
                  quantity={wine.stock_quantity}
                  img={wine.img_url}
                  name={wine.product_name}
                  calcDiscount={calcDiscount}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

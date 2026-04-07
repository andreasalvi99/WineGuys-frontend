import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <section className="not-found p-5">
        <div className="container d-flex flex-column justify-content-center align-items-center playfair-display_special p-5 mt-5">
          <h1 className="search-outcome text-center mt-5">
            Oops! sembrerebbe che la tua ricerca di vini non sia andata a buon
            fine
          </h1>
          <Link to={"/"}>
            <button className="btn btn-dark mt-4">Torna alla Home</button>
          </Link>
        </div>
      </section>
    </>
  );
}

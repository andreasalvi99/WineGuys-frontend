import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <section className="p-5">
        <div className="container text-center d-flex justify-content-center mt-5 playfair-display_special">
          <div className="not-found d-flex justify-content-center align-items-center flex-column">
            <p className="text-white h2">
              Oops! sembrerebbe che la tua ricerca di vini non sia andata a buon
              fine
            </p>
            <Link to={"/"}>
              <button className="btn btn-dark">Torna alla Home</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

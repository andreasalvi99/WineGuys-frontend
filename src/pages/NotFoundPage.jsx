import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center">
        <Link to={"/"}>
          <button className="btn btn-outline-dark">Torna alla Home</button>
        </Link>
      </div>
    </>
  );
}

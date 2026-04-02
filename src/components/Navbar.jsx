import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="container-fluid text-center">
        <Link to={"/"}>
          <img
            src="../src/assets/img/wineguys2.png"
            alt="navbar-logo"
            className="navbar-logo p-2"
          />
        </Link>
      </div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"></a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-lg-center"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to={"/"} className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/vini"} className="nav-link">
                  Vini
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={""} className="nav-link">
                  Link
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

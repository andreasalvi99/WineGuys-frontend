import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";

export default function Navbar() {
  const { cart, addToCart } = useContext(CartContext);

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
      <div className="d-flex justify-content-between bg-body-tertiary align-items-center sticky-top">
        <div></div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
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
              className="collapse navbar-collapse justify-content-lg-between align-items-center"
              id="navbarSupportedContent"
            >
              <div></div>
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
        <button
          className="btn m-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
        >
          <i className="bi bi-cart shopping-cart position-relative">
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
              <span className="fw-light">{cart.length}</span>
            </span>
          </i>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasRightLabel">
              Carrello
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">...</div>
        </div>
      </div>
    </>
  );
}

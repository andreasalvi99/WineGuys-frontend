import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";

export default function Navbar() {
  const { cart, setCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  function plusOne(item) {
    return setQuantity((item.quantity = item.quantity + 1));
  }

  function minusOne(item) {
    return setQuantity((item.quantity = item.quantity - 1));
  }

  function deleteItem(item) {
    const prevCart = cart.filter((cartItem) => cartItem.id !== item.id);

    return setCart(prevCart);
  }

  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }

  console.log(cart);

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
          className="offcanvas offcanvas-end playfair-display_special"
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
          <div className="offcanvas-body">
            {cart.map((item, index) => {
              return (
                <div key={index} className="card mb-3 p-3">
                  <div className="row g-0">
                    <div className="col-md-4 h-100">
                      <img
                        src={`http://localhost:3000/wines/${item.img}`}
                        className="img-fluid rounded-start"
                        alt={item.name}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body py-0">
                        <div className="d-flex justify-content-between">
                          <h5 className="card-title">{item.name}</h5>
                          <button
                            onClick={() => deleteItem(item)}
                            type="button"
                            className="btn btn-secondary btn-sm mb-4 mt-0"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                        <div className="d-flex justify-content-start align-items-center">
                          <p className="card-text mt-3 d-flex align-items-center">
                            <button
                              onClick={() => minusOne(item)}
                              type="button"
                              className="btn btn-light m-0"
                              disabled={quantity === 0}
                            >
                              -
                            </button>
                            <span className="border border-dark p-1 mx-2">
                              {quantity}
                            </span>
                            <button
                              onClick={() => plusOne(item)}
                              type="button"
                              className="btn btn-light m-0"
                            >
                              +
                            </button>
                          </p>
                        </div>
                        <p className="card-text mt-3">
                          {item.promotion_price !== null &&
                          item.promotion_price !== undefined ? (
                            <small className="text-danger">
                              <span className="text-dark text-decoration-line-through position-relative">
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                  -
                                  {calcDiscount(
                                    item.price,
                                    item.promotion_price,
                                  )}
                                  %
                                </span>
                                &euro;{item.price}
                              </span>
                              <span className="d-block">
                                &euro;{item.promotion_price}
                              </span>
                            </small>
                          ) : (
                            <small>&euro;{item.price}</small>
                          )}
                          {item.promotion_price !== null &&
                          item.promotion_price !== undefined ? (
                            <small className="text-black d-block text-end">
                              Total: &euro;{item.promotion_price * quantity}
                            </small>
                          ) : (
                            <small className="text-black d-block mt-4 text-end">
                              Total: &euro;{item.price * item.quantity}
                            </small>
                          )}
                          {/* <small className="text-black d-block mt-4 text-end">
                            Total: &euro;{item.price * item.quantity}
                          </small> */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

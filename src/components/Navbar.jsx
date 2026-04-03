import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import CartCard from "./CartCard";

export default function Navbar() {
  const { cart, setCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  function plusOne(item) {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      ),
    );
  }

  function minusOne(item) {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      ),
    );
  }

  function deleteItem(item) {
    const prevCart = cart.filter((cartItem) => cartItem.id !== item.id);
    setQuantity(1);

    return setCart(prevCart);
  }

  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }

  function calcTotalAmount(cart) {
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
      const currentItem = cart[i];

      let currentItemPrice = 0;

      if (
        currentItem.promotion_price !== null &&
        currentItem.promotion_price !== undefined
      ) {
        currentItemPrice = currentItem.promotion_price * currentItem.quantity;
      } else {
        currentItemPrice = currentItem.price * currentItem.quantity;
      }

      totalPrice += currentItemPrice;
    }

    return totalPrice.toFixed(2);
  }

  function calcTotalQuantity(cart) {
    let totalQuantity = 0;

    for (let i = 0; i < cart.length; i++) {
      const currentItem = cart[i];

      totalQuantity += currentItem.quantity;
    }

    return totalQuantity;
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
              <span className="fw-light">{calcTotalQuantity(cart)}</span>
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
                <CartCard
                  item={item}
                  key={index}
                  img={item.img}
                  name={item.name}
                  promotion={item.promotion_price}
                  price={item.price}
                  quantity={item.quantity}
                  deleteItem={deleteItem}
                  plusOne={plusOne}
                  minusOne={minusOne}
                  calcDiscount={calcDiscount}
                />
              );
            })}
          </div>
          <nav className="navbar sticky-bottom bg-body-tertiary">
            <div className="container-fluid justify-content-between align-items-center">
              <a className="navbar-brand" href="#">
                Totale: &euro;{calcTotalAmount(cart)}
              </a>
              <button
                type="button"
                className="btn btn-success m-0"
                disabled={cart.length === 0}
              >
                Checkout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

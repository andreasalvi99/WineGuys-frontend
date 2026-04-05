import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import CartCard from "./CartCard";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { cart, setCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  //Funzione per forzare chiusure dell'offcanvas quando clicco sul checkout
  const handleCheckoutNavigation = () => {
    // click chiusura programmato che attiva la pulizia di Bootstrap delle classi che bloccano lo scorrimento
    const closeButton = document.querySelector("#offcanvasRight .btn-close");
    if (closeButton) {
      closeButton.click();
    }
    // naviga alla pagina di checkout dando il tempo a Bootstrap di iniziare la transizione
    setTimeout(() => {
      navigate("/checkout");
    }, 100);
  };

  async function plusOne(item) {
    try {
      const response = await axios.get(
        `http://localhost:3000/vini/${item.slug}`,
      );

      const wine = response.data?.result;
      if (!wine) return;

      if (item.quantity >= wine.stock_quantity) return;

      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } catch (err) {
      console.error(err);
    }
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
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
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
              className="collapse navbar-collapse justify-content-lg-between align-items-center mt-3"
              id="navbarSupportedContent"
            >
              <div></div>
              <ul className="navbar-nav mb-2 mb-lg-0 navbar-links-list">
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
              </ul>
            </div>
          </div>
        </nav>
        <div className="d-flex align-items-center">
          <SearchBar />
          <button
            className="btn shopping-cart-btn"
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
        </div>
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
                onClick={handleCheckoutNavigation}
                disabled={cart.length === 0}
                className={`btn btn-success m-0 ${cart.length === 0 ? "disabled" : ""}`}
              >
                Checkout
              </button>
            </div>
          </nav>
        </div>
        {/* <div className="d-flex align-items-center gap-2"></div> */}
      </div>
    </>
  );
}

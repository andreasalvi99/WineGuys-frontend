import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import CartCard from "./CartCard";
import SearchBar from "./SearchBar";
import axios from "axios";

export default function Navbar() {
  const { cart, setCart } = useContext(CartContext);
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
  // funzione per fare +1 nel carrello, al click faccio chiamata a database per un check sulla quantity in stock, se la quantity che si aggiunge è maggiore di quella in stock allora non accade nulla(return)
  async function plusOne(item) {
    const response = await axios.get(`http://localhost:3000/vini/${item.slug}`);

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
  }
  // funzione per il -1 ndel carrello
  function minusOne(item) {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      ),
    );
  }
  // funzione per cancellare elemento sul click del cestino
  function deleteItem(item) {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== item.id),
    );
  }
  // Ripristina l'item rimosso creando un nuovo array con gli elementi precedenti più l'item da ripristinare in fondo
  function restoreItem(item) {
    setCart((prevCart) => [...prevCart, item]);
  }
  // funzione per calcolare lo sconto
  function calcDiscount(original, discount) {
    return Math.ceil(((original - discount) / original) * 100);
  }
  // funzione che prende per ogni elemento del carrello il suo prezzo e lo aggiunge al totale, riceve parametro cart che è l'array. Se chiave promotion ha valore non nullo si moltiplice il prezzo scontato per la quantità, altrimenti si moltiplica il prezzo originale
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
  // funzione per calcolare numero di oggetti nel carrello, riceve cart come parametro per fare ciclo for sugli elementi al suo interno
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
      <div>
        <div className="container-fluid text-center">
          <Link to={"/"}>
            <img
              src="../src/assets/img/wineguys2.png"
              alt="navbar-logo"
              className="navbar-logo p-2"
            />
          </Link>
        </div>
        <div className="d-flex justify-content-between bg-body-tertiary align-items-start align-items-lg-center sticky-top">
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
                className="collapse navbar-collapse justify-content-lg-between align-items-center"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav mb-2 mb-lg-0 navbar-links-list">
                  <li className="nav-item">
                    <NavLink to={"/"} className="nav-link my-2 my-lg-0">
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to={"/vini"} className="nav-link">
                      La nostra cantina
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="d-flex align-items-center mx-3">
            <SearchBar />
            <button
              className="btn shopping-cart-btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              {/* icona carrello con badge successo che mostra dinamicamente il numero di elementi nel cart */}
              <i className="bi bi-cart shopping-cart position-relative">
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                  <span className="fw-light">{calcTotalQuantity(cart)}</span>
                </span>
              </i>
            </button>
          </div>
          {/* offcanvas per visualizzare carrello */}
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
                    restoreItem={restoreItem}
                    plusOne={plusOne}
                    minusOne={minusOne}
                    calcDiscount={calcDiscount}
                  />
                );
              })}
            </div>
            {/* navbar bottom per pulsante checkout e totale carrello */}
            <nav className="navbar sticky-bottom bg-body-tertiary">
              <div className="container-fluid justify-content-between align-items-center">
                {/* invoco funzione per calcolare il prezzo totale */}
                <a className="navbar-brand" href="#">
                  Totale: &euro;{calcTotalAmount(cart)}
                </a>
                {/* doppio check per il disabled, se lungezza array cart = 0 */}
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
        </div>
      </div>
    </>
  );
}

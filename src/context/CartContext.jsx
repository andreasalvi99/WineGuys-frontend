import { useState, useEffect } from "react";

import { CartContext } from "./CartContextObject";
import axios from "axios";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // salva ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // funzione aggiunta al carrello
  const addToCart = async (wine, quantity) => {
    const response = await axios(`http://localhost:3000/vini/${wine.slug}`);

    const vino = response.data.result;

    const existing = cart.find((item) => item.slug === wine.slug);
    const currentQty = existing ? existing.quantity : 0;

    if (quantity + currentQty > vino.stock_quantity) return;

    if (existing) {
      setCart(
        cart.map((item) =>
          item.slug === wine.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          id: wine.id,
          slug: wine.slug,
          name: wine.product_name,
          price: Number(wine.price),
          promotion_price: wine.promotion_price
            ? Number(wine.promotion_price)
            : null,
          quantity,
          img: wine.img,
        },
      ]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

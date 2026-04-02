import { useState, useEffect } from "react";

import { CartContext } from "./CartContextObject";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // salva ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // funzione aggiunta al carrello
  const addToCart = (wine, quantity) => {
    const existing = cart.find((item) => item.slug === wine.slug);

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

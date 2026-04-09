export const prepareOrderPayload = (formData, cart) => {
  const sanitizedCustomer = {};

  //sanitizzazione dati customer
  for (let key in formData.customer) {
    sanitizedCustomer[key] = typeof formData.customer[key] === "string" ? formData.customer[key].trim() : formData.customer[key];
  }
  //info da passare al server sui prodotti nel carrello
  const orderCartItems = cart.map((item) => ({
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
  }));

  return {
    customer: sanitizedCustomer,
    cart_items: orderCartItems,
    discount_code: formData.discount_code || null,
  };
};

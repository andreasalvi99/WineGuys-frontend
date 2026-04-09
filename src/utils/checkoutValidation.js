export function validateFormLogic(formData, sameAsBilling) {
  const newInvalid = {
    first_name: { isInvalid: false, reason: "" },
    second_name: { isInvalid: false, reason: "" },
    email: { isInvalid: false, reason: "" },
    cellphone: { isInvalid: false, reason: "" },
    billing_street: { isInvalid: false, reason: "" },
    billing_city: { isInvalid: false, reason: "" },
    billing_postal_code: { isInvalid: false, reason: "" },
    shipping_street: { isInvalid: false, reason: "" },
    shipping_city: { isInvalid: false, reason: "" },
    shipping_postal_code: { isInvalid: false, reason: "" },
  };

  const { customer } = formData;

  // validazione Nome
  if (!customer.first_name.trim()) {
    newInvalid.first_name = { isInvalid: true, reason: "Il nome è necessario" };
  }

  // validazione Cognome
  if (!customer.second_name.trim()) {
    newInvalid.second_name = { isInvalid: true, reason: "Il cognome è necessario" };
  }

  // validazione Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email)) {
    newInvalid.email = { isInvalid: true, reason: "Inserisci un'email valida" };
  }

  // validazione Cellulare
  const phoneRegex = /^\+?[\d\s]{9,15}$/;
  const phoneValue = customer.cellphone.trim();
  if (!phoneValue) {
    newInvalid.cellphone = { isInvalid: true, reason: "Il numero di cellulare è necessario" };
  } else if (!phoneRegex.test(phoneValue)) {
    newInvalid.cellphone = { isInvalid: true, reason: "Inserisci un numero valido" };
  }

  // validazione Indirizzo e Città
  if (!customer.billing_street.trim()) {
    newInvalid.billing_street = { isInvalid: true, reason: "L'indirizzo è necessario" };
  }
  if (!customer.billing_city.trim()) {
    newInvalid.billing_city = { isInvalid: true, reason: "La città è necessaria" };
  }

  // validazione CAP
  if (!/^\d{5}$/.test(customer.billing_postal_code)) {
    newInvalid.billing_postal_code = { isInvalid: true, reason: "CAP non valido" };
  }

  // validazione shipping condizionale
  if (!sameAsBilling) {
    if (!customer.shipping_street.trim()) {
      newInvalid.shipping_street = { isInvalid: true, reason: "L'indirizzo è necessario" };
    }
    if (!customer.shipping_city.trim()) {
      newInvalid.shipping_city = { isInvalid: true, reason: "La città è necessaria" };
    }
    if (!/^\d{5}$/.test(customer.shipping_postal_code)) {
      newInvalid.shipping_postal_code = { isInvalid: true, reason: "CAP non valido" };
    }
  }

  return newInvalid;
}

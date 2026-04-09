import { toast } from "sonner";


export default function CartCard({
  img,
  name,
  promotion,
  price,
  quantity,
  item,
  deleteItem,
  restoreItem,
  plusOne,
  minusOne,
  calcDiscount,
}) {
 // Rimuove l'item dal carrello e mostra un toast con la possibilità di annullare l'operazione entro 5 secondi
const handleDelete = () => {
  deleteItem(item);
  toast.error("Rimosso dal carrello", {
    description: `${name} non è più nel carrello`,
    duration: 5000,
    // Se l'utente clicca "Annulla" entro 5 secondi, ripristina l'item nel carrello
    action: {
      label: "Annulla",
      onClick: () => {
        restoreItem(item);
        toast.success("Ripristinato!", {
          description: `${name} è di nuovo nel carrello`,
          duration: 2000,
        });
      },
    },
  });
};

// Aumenta di 1 la quantità dell'item nel carrello
const handlePlus = () => {
  plusOne(item);
  toast.success("Quantità aumentata", {
    description: `Hai aggiunto un'altra bottiglia di ${name}`,
    duration: 1500,
  });
};

// Se la quantità è maggiore di 1 riduce di 1, altrimenti rimuove l'item dal carrello
const handleMinus = () => {
  if (quantity > 1) {
    minusOne(item);
    toast.info("Quantità ridotta", {
      description: `Hai ridotto ${quantity - 1} unità di ${name}`,
      duration: 1500,
    });
  } else {
    handleDelete();
  }
};

  return (
    <div className="card mb-3 p-3">
      <div className="row g-0">
        <div className="col-4 h-100">
          <img
            src={`http://localhost:3000/wines/${img}`}
            className="img-fluid rounded-start"
            alt={name}
          />
        </div>
        <div className="col-8">
          <div className="card-body py-0">
            <div className="d-flex justify-content-between">
              <h5 className="card-title fs-6">{name}</h5>
              {/* onclick invoco funzione per cancellare item */}
              <button
                onClick={handleDelete}
                type="button"
                className="btn btn-secondary btn-sm mb-4 mt-0"
              >
                <i className="bi bi-trash3"></i>
              </button>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <p className="card-text mt-3 d-flex align-items-center">
                {/* onclick se quantity è maggiore di 1 invoco minus one, altimenti se quantity = 1 l'item viene cancellato. Il btn è disabilitato se quantity = 0 */}
                <button
                  onClick={handleMinus}
                  type="button"
                  className="btn btn-light m-0"
                  disabled={quantity === 0}
                >
                  -
                </button>
                <span className="border border-dark p-1 mx-2">{quantity}</span>
                {/* onclick invoco plusone, btn disabilitato se la quantity che si vuole aggiungere è >= alla quqntity in stock */}
                <button
                  onClick={handlePlus}
                  type="button"
                  className="btn btn-light m-0"
                  disabled={quantity >= item.stock_quantity}
                >
                  +
                </button>
              </p>
            </div>
            {/* se promotion ha valore non nullo mostro il prezzo originale sbarrato e quello scontato sotto con due decimali, altrimenti mostro il prezzo originale */}
            <p className="card-text mt-3">
              {promotion !== null && promotion !== undefined ? (
                <small className="text-danger">
                  <span className="text-dark text-decoration-line-through position-relative">
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {/* mostro anche la percentuale di sconto */}-
                      {calcDiscount(price, promotion)}%
                    </span>
                    &euro;{price.toFixed(2)}
                  </span>
                  <span className="d-block">&euro;{promotion.toFixed(2)}</span>
                </small>
              ) : (
                <small>&euro;{price.toFixed(2)}</small>
              )}
              {/* se  promotion ha valore non nullo mostro il prezzo totale dell'item moltiplicando il prezzo scontato per la quantity, altrimenti moltiplico il prezzo originale*/}
              {promotion !== null && promotion !== undefined ? (
                <small className="text-black d-block text-end">
                  Totale: &euro;{(promotion * quantity).toFixed(2)}
                </small>
              ) : (
                <small className="text-black d-block mt-4 text-end">
                  Totale: &euro;{(price * quantity).toFixed(2)}
                </small>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

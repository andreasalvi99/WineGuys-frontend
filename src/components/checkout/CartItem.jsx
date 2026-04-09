export default function CartItem({ item, plusOne, minusOne, deleteItem, getItemPrice }) {
  return (
    <div className="card mb-3 p-3 border-0 shadow-sm bg-white rounded-3">
      <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: "1rem" }}>
        {item.name}
      </h6>

      <div className="row g-0 align-items-center">
        <div className="col-3 text-center">
          <img src={`http://localhost:3000/wines/${item.img}`} className="img-fluid" alt={item.name} style={{ maxHeight: "70px", objectFit: "contain" }} />
        </div>

        <div className="col-5 d-flex align-items-center justify-content-center gap-2">
          <div className="d-flex align-items-center border rounded bg-light p-1">
            <button onClick={() => minusOne(item)} type="button" className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold">
              -
            </button>
            <span className="px-2 small fw-bold" style={{ minWidth: "20px", textAlign: "center" }}>
              {item.quantity}
            </span>
            <button onClick={() => plusOne(item)} type="button" className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold">
              +
            </button>
          </div>

          <button onClick={() => deleteItem(item)} type="button" className="btn btn-sm text-danger ms-2 p-0">
            <i className="bi bi-trash3 fs-5"></i>
          </button>
        </div>

        <div className="col-4 text-end">
          {item.promotion_price && (
            <div className="d-flex flex-column">
              <span className="text-danger text-decoration-line-through small" style={{ fontSize: "0.7rem" }}>
                {item.price.toFixed(2)}€
              </span>
            </div>
          )}

          <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
            Totale: <span className="fw-bold text-dark">{(getItemPrice(item) * item.quantity).toFixed(2)}€</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartCard({
  img,
  name,
  promotion,
  price,
  quantity,
  item,
  deleteItem,
  plusOne,
  minusOne,
  calcDiscount,
}) {
  return (
    <div className="card mb-3 p-3">
      <div className="row g-0">
        <div className="col-md-4 h-100">
          <img
            src={`http://localhost:3000/wines/${img}`}
            className="img-fluid rounded-start"
            alt={name}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body py-0">
            <div className="d-flex justify-content-between">
              <h5 className="card-title fs-6">{name}</h5>
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
                <span className="border border-dark p-1 mx-2">{quantity}</span>
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
              {promotion !== null && promotion !== undefined ? (
                <small className="text-danger">
                  <span className="text-dark text-decoration-line-through position-relative">
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      -{calcDiscount(price, promotion)}%
                    </span>
                    &euro;{price.toFixed(2)}
                  </span>
                  <span className="d-block">&euro;{promotion.toFixed(2)}</span>
                </small>
              ) : (
                <small>&euro;{price.toFixed(2)}</small>
              )}
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

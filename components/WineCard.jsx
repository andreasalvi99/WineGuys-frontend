export default function WineCard({ img, name, price }) {
  return (
    <div className="col">
      <div className="card h-100">
        <img src={img} className="card-img-top" alt={name} />
        <div className="card-body">
          <p className="card-text">{price} &euro;</p>
        </div>
      </div>
    </div>
  );
}

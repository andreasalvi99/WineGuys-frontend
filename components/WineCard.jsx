export default function WineCard({ img, name, description }) {
  return (
    <div className="col">
      <div className="card">
        <img src={img} className="card-img-top" alt={name} />
        <div className="card-body">
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
}

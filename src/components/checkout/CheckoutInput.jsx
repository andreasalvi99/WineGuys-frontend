export default function CheckoutInput({ type = "text", name, placeholder, value, invalidField, onChange, col = "12" }) {
  return (
    <div className={`col-md-${col}`}>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        className={`form-control form-control-lg border-0 bg-light ${invalidField?.isInvalid ? "is-invalid" : ""}`}
        onChange={onChange}
      />
      {invalidField?.isInvalid && <div className="invalid-feedback ps-2">{invalidField.reason}</div>}
    </div>
  );
}

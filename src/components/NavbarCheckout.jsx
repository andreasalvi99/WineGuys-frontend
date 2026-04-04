import { Link } from "react-router-dom";

Link;
export default function NavbarCheckout() {
  return (
    <>
      <div className="container-fluid text-center">
        <Link to={"/"}>
          <img src="../src/assets/img/wineguys2.png" alt="navbar-logo" className="navbar-logo p-2" />
        </Link>
      </div>
      <div className="py-4 bg-body-tertiary sticky-top"></div>
    </>
  );
}

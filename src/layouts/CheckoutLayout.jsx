import { Outlet } from "react-router-dom";
import NavbarCheckout from "../components/NavbarCheckout";

export default function CheckoutLayout() {
  return (
    <>
      <NavbarCheckout />
      <section>
        <Outlet />
      </section>
    </>
  );
}

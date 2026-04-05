import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Updates from "../components/Updates";

export default function DefaultLayout() {
  return (
    <>
      <Updates />
      <Navbar />
      <section>
        <Outlet />
      </section>
    </>
  );
}

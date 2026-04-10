import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Updates from "../components/Updates";
import Footer from "../components/Footer";

export default function DefaultLayout() {
  return (
    <>
      <Updates />
      <Navbar />
      <section>
        <Outlet />
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
}

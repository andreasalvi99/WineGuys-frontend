import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function DefaultLayout() {
  return (
    <>
      <Navbar />
      <section>
        <div className="container text-center">
          <Outlet />
        </div>
      </section>
    </>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "animate.css";
import HomePage from "./pages/HomePage";
import WineDetailPage from "./pages/WineDetailPage";
import WinesPage from "./pages/WinesPage";
import CheckoutPage from "./pages/CheckoutPage";
import DefaultLayout from "./layouts/DefaultLayout";
import CheckoutLayout from "./layouts/CheckoutLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/vini" element={<WinesPage />} />
          <Route path="/vini/:slug" element={<WineDetailPage />} />
        </Route>
        <Route element={<CheckoutLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

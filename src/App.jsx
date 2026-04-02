import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WineDetailPage from "./pages/WineDetailPage";
import DefaultLayout from "./layouts/DefaultLayout";
import WinesPage from "./pages/WinesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/vini" element={<WinesPage />} />
          <Route path="/vini/:slug" element={<WineDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

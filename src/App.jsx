import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WineDetailPage from "./pages/WineDetailPage";
import DefaultLayout from "./layouts/DefaultLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/vini/:slug" element={<WineDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

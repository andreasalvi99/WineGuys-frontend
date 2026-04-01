import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import WineDetailPage from "./pages/WineDetailPage";
import DefaultLayout from "./layouts/DefaultLayout";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={DefaultLayout}>
            <Route index Component={HomePage} />
            <Route path="/vini/:id" Component={WineDetailPage} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

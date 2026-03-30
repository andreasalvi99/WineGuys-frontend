import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index Component={HomePage} />
          <Route path="/vini" Component={WinesPage} />
          <Route path="/vini/:id" Component={WinesDetailPage} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

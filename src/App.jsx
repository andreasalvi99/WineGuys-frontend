import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import defaultLayout from "./layouts/DefaultLayout";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={defaultLayout}>
            <Route index Component={HomePage} />
            {/* <Route path="/vini" Component={WinesPage} />
          <Route path="/vini/:id" Component={WinesDetailPage} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DefaultLayout from "../layouts/DefaultLayout";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={DefaultLayout}>
            <Route index Component={HomePage} />
            {/* <Route path="/vini" Component={WinesPage} />
          <Route path="/vini/:id" Component={WinesDetailPage} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

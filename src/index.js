import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Routes
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages:
import Formview from "./views/Formview";
import NotFound from "./views/NotFound";
import Lobby from "./views/Lobby";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<Navigate replace to="/enterGame" />}
        ></Route>
        <Route path="/enterGame" element={<Formview />} />
        <Route path="/game/:gameId/lobby" element={<Lobby />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

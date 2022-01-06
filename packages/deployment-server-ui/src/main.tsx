import "./index.css";
import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Types from "./pages/Types";
import Devices from "./pages/Devices";
import Deployments from "./pages/Deployments";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="types" element={<Types />} />
        <Route path="devices" element={<Devices />} />
        <Route path="deployments" element={<Deployments />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

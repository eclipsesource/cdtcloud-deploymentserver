import "./index.css";
import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Types from "./pages/Types";
import TypeId from "./pages/TypeId";
import Devices from "./pages/Devices";
import Deployments from "./pages/Deployments";
import NotFound from "./pages/NotFound";

import { CdtCloudMain } from "./components/CdtCloudMain";
import { init as InitIcons } from "./util/iconLibrary"

InitIcons()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CdtCloudMain>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="types" element={<Types />} />
          <Route path="types/:id" element={<TypeId />} />
          <Route path="devices" element={<Devices />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CdtCloudMain>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

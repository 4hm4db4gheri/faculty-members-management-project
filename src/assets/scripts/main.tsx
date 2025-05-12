import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/main.css";
import DashboardComponent from "./DashboardComponent";
import SignUpPage from "./Panels/SignUpPage";
import { RTLProvider } from "./RTLProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RTLProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
        </Routes>
      </BrowserRouter>
    </RTLProvider>
  </StrictMode>,
);

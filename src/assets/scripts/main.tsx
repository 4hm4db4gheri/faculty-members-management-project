import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/main.css";
import DashboardComponent from "./DashboardComponent";
import LoginPage from "./Panels/LoginPage";
import { RTLProvider } from "./RTLProvider";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Your ProtectedRoute

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RTLProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard/*" // This covers all sub-routes of /dashboard
            element={
              <ProtectedRoute>
                <DashboardComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </RTLProvider>
  </StrictMode>,
);

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/main.css";
import DashboardComponent from "./DashboardComponent";
import LoginPage from "./Panels/LoginPage";
import { RTLProvider } from "./RTLProvider";
import NotificationDetail from "./Panels/NotificationDetail";
import { ProtectedRoute } from "./components/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RTLProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/notification/detail" element={<NotificationDetail />} />
        </Routes>
      </BrowserRouter>
    </RTLProvider>
  </StrictMode>,
);

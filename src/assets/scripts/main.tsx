import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/main.css";
import DashboardComponent from "./DashboardComponent";
import LoginPage from "./Panels/LoginPage";
import VerifyCodePage from "./Panels/VerifyCodePage";
import ChangePasswordPage from "./Panels/ChangePasswordPage";
import NotFoundPage from "./Panels/NotFoundPage";

import { RTLProvider } from "./RTLProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import "../styles/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RTLProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardComponent />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="lg:!bottom-4 lg:!left-4"
        toastClassName="!max-w-[250px] !p-2 !text-xs sm:!max-w-[280px] sm:!p-3 sm:!text-sm lg:!max-w-[400px] lg:!p-4 lg:!text-base"
      />
    </RTLProvider>
  </StrictMode>,
);

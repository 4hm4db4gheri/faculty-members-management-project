import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/main.css";
import DashboardComponent from "./DashboardComponent";
import LoginPage from "./Panels/LoginPage";
import ResetPasswordPage from "./Panels/ResetPasswordPage";
import VerifyCodePage from "./Panels/VerifyCodePage";

import { RTLProvider } from "./RTLProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RTLProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-left" // موقعیت نمایش اعلان‌ها
        autoClose={5000} // زمان ماندگاری اعلان (میلی‌ثانیه)
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // برای پشتیبانی از زبان فارسی (راست به چپ)
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // تم روشن یا تاریک
      />
    </RTLProvider>
  </StrictMode>,
);

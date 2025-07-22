import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../Services/ApiService";
import { AuthService } from "../Services/AuthService";
import { LoginResponse } from "../types/auth.types";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { toast } from "react-toastify"; // Import toast

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<
    false | "login" | "forgotPassword"
  >(false);

  // تغییر فرآیند به ارسال کد تایید پیامکی
  const handleForgotPassword = async () => {
    if (!userName) {
      toast.error("لطفا نام کاربری خود را وارد کنید.");
      return;
    }
    setIsLoading("forgotPassword");
    try {
      const response: any = await ApiService.get(
        `/panel/v1/user/forget-password?username=${encodeURIComponent(userName)}`,
      );
      if (response.error) {
        toast.error(
          response.message?.[0] || "خطا در ارسال پیام بازیابی رمز عبور.",
        );
      } else {
        toast.success("پیام بازیابی رمز عبور برای شما ارسال شد.");
        navigate("/verify-code", { state: { phoneNumber: userName } });
      }
    } catch (error: any) {
      console.error("[ForgetPassword Error]", error);
      if (error instanceof Error) {
        toast.error(`خطا در ارتباط با سرور: ${error.message}`);
      } else {
        toast.error("ارتباط با سرور برقرار نشد.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading("login");
    try {
      const response = await ApiService.post<LoginResponse>(
        "/panel/v1/user/log-in",
        { userName, password },
      );

      if (response.error) {
        toast.error(response.message[0] || "خطا در ورود."); // Display error using toast
      } else {
        AuthService.setAuthData(response);
        toast.success("ورود با موفقیت انجام شد!"); // Display success using toast
        navigate("/dashboard");
      }
    } catch {
      toast.error("ارتباط با سرور برقرار نشد."); // Display connection error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen grid-cols-2 bg-cover bg-center">
      {/* فرم ثبت‌نام سمت چپ */}
      <div className="bg-opacity-60 flex items-center justify-center bg-white backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl bg-[#EBF2FA] p-8 text-center shadow-2xl">
          <img
            src="src/assets/images/Sbu-logo.svg.png"
            alt="دانشگاه شهید بهشتی"
            className="mx-auto mb-6 w-32"
          />
          <p className="mb-8 text-xl text-gray-500">
            سامانه کنترل وضعیت هیات علمی
          </p>
          <div className="space-y-6">
            {isLoading ? (
              <LoadingSpinner
                size="md"
                text={
                  isLoading === "forgotPassword"
                    ? "در حال پردازش..."
                    : "در حال ورود..."
                }
              />
            ) : (
              <>
                <input
                  type="text"
                  placeholder="نام کاربری"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="focus:ring-primary-400 w-full rounded-[15px] border border-gray-300 bg-white px-4 py-2 focus:outline-none"
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary-400 w-full rounded-[15px] border border-gray-300 bg-white px-4 py-2 focus:outline-none"
                  disabled={isLoading}
                />
                <div className="mt-2 flex justify-start">
                  <button
                    type="button"
                    className="text-right text-sm text-blue-600 hover:underline focus:outline-none"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    رمز عبور را فراموش کرده‌ام
                  </button>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="mt-10 w-60 rounded-3xl bg-[#1B4965] py-2 font-bold text-white transition duration-300 hover:bg-[#358cc1] disabled:opacity-50"
                >
                  ورود
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* تصویر سمت راست */}
      <div
        className="h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('src/assets/images/background.jpg')",
        }}
      ></div>
    </div>
  );
};

export default LoginPage;

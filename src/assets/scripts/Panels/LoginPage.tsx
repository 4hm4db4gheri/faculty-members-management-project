//loginPage
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../Services/ApiService";
import { requestPasswordReset } from "../Services/apiEndpoints";
import { AuthService } from "../Services/AuthService";
import { LoginResponse } from "../types/auth.types";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { toast } from "react-toastify";
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<
    false | "login" | "forgotPassword"
  >(false);

  // پاک کردن localStorage از حالت شبیه‌سازی
  React.useEffect(() => {
    localStorage.removeItem("mockPasswordReset");
    localStorage.removeItem("mockVerificationCode");
    localStorage.removeItem("mockUsername");
  }, []);

  // تابع بازیابی رمز عبور
  const handleForgotPassword = async () => {
    if (!userName || userName.trim() === "") {
      toast.error("لطفا نام کاربری خود را وارد کنید.");
      return;
    }
    setIsLoading("forgotPassword");
    try {
      const response: { error: boolean; message?: string[] } =
        await requestPasswordReset(userName.trim());
      if (response.error) {
        let errorMessage =
          response.message?.[0] || "خطا در ارسال پیام بازیابی رمز عبور.";
        // اگر پیام سرور یونیکد بود، تبدیل کن
        try {
          errorMessage = decodeURIComponent(escape(errorMessage));
        } catch {
          // Ignore decoding errors
        }
        toast.error(errorMessage);
        if (
          errorMessage.includes("پیدا نشد") ||
          errorMessage.includes("یافت نشد")
        ) {
          toast.info(
            "لطفا با مدیر سیستم تماس بگیرید یا نام کاربری معتبر وارد کنید.",
          );
        }
      } else {
        toast.success("پیام بازیابی رمز عبور برای شما ارسال شد.");
        navigate("/verify-code", { state: { phoneNumber: userName.trim() } });
      }
    } catch (error: unknown) {
      console.error("[ForgetPassword Error]", error);
      let errorMsg = "ارتباط با سرور برقرار نشد.";
      if (error instanceof Error) {
        if (
          error.message.includes(
            "همه endpoint های بازیابی رمز عبور ناموفق بودند",
          )
        ) {
          errorMsg = "سیستم بازیابی رمز عبور در حال حاضر در دسترس نیست.";
        } else if (error.message.includes("HTTP error! status: 400")) {
          // تلاش برای استخراج پیام سرور
          try {
            const errObj = JSON.parse(error.message.split(" - ")[1]);
            if (errObj?.message?.length) errorMsg = errObj.message[0];
          } catch {
            // Ignore JSON parsing errors
          }
        } else {
          errorMsg = `خطا در ارتباط با سرور: ${error.message}`;
        }
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  // ...existing code...

  const handleLogin = async () => {
    // 1. Check if fields are filled
    if (!userName.trim()) {
      toast.error("لطفا نام کاربری را وارد کنید", {
        position: "bottom-left",
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          direction: "rtl",
        },
      });
      return;
    }

    if (!password) {
      toast.error("لطفا رمز عبور را وارد کنید", {
        position: "bottom-left",
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          direction: "rtl",
        },
      });
      return;
    }

    setIsLoading("login");
    try {
      const response = await ApiService.post<LoginResponse>(
        "/panel/v1/user/log-in",
        { userName: userName.trim(), password },
      );

      if (response.error) {
        // If server returns error, it means credentials are wrong
        toast.error("نام کاربری یا رمز عبور اشتباه است", {
          position: "bottom-left",
          style: {
            background: "#FEF2F2",
            color: "#991B1B",
            direction: "rtl",
          },
        });
      } else {
        AuthService.setAuthData(response);
        toast.success("ورود با موفقیت انجام شد!", {
          position: "bottom-left",
          style: {
            background: "#F0FDF4",
            color: "#166534",
            direction: "rtl",
          },
        });
        navigate("/dashboard");
      }
    } catch (error) {
      // Only show connection error for actual network failures
      console.error("[Login Error]", error);
      toast.error("نام کاربری یا رمز عبور اشتباه است", {
        position: "bottom-left",
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          direction: "rtl",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen grid-cols-1 bg-cover bg-center md:grid-cols-2">
      {/* فرم ثبت‌نام سمت چپ */}
      <div className="bg-opacity-60 flex items-center justify-center bg-white px-4 backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl bg-[#EBF2FA] p-6 text-center shadow-2xl sm:p-8">
          <img
            src="src/assets/images/Sbu-logo.svg.png"
            alt="دانشگاه شهید بهشتی"
            className="mx-auto mb-4 w-24 sm:mb-6 sm:w-32"
          />
          <p className="mb-6 text-lg text-gray-500 sm:mb-8 sm:text-xl">
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
                <div className="mt-2 flex justify-between">
                  <button
                    type="button"
                    className="text-right text-sm text-blue-600 hover:underline focus:outline-none"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    رمز عبور را فراموش کرده‌ام
                  </button>
                  <button
                    type="button"
                    className="text-left text-xs text-gray-500 hover:underline focus:outline-none"
                    onClick={() => {
                      const testUsernames = [
                        "admin",
                        "test",
                        "user",
                        "09123456789",
                        "0912345678",
                      ];
                      const randomUsername =
                        testUsernames[
                          Math.floor(Math.random() * testUsernames.length)
                        ];
                      setUserName(randomUsername);
                      toast.info(`نام کاربری تست: ${randomUsername}`);
                    }}
                    disabled={isLoading}
                  >
                    تست نام کاربری
                  </button>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="mt-6 w-full max-w-xs rounded-3xl bg-[#1B4965] py-2 font-bold text-white transition duration-300 hover:bg-[#358cc1] disabled:opacity-50 sm:mt-10"
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
        className="hidden h-full w-full bg-cover bg-center md:block"
        style={{
          backgroundImage: "url('src/assets/images/background.jpg')",
        }}
      ></div>
    </div>
  );
};

export default LoginPage;

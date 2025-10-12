//VerifyCodePage
import React, { useState } from "react";
// import { ApiService } from "../Services/ApiService";
import { validateVerificationCode } from "../Services/apiEndpoints";
import { toast } from "react-toastify";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyCodePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber } = location.state || {};
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // مرحله اول: اعتبارسنجی کد تایید
  const handleVerifyCode = async () => {
    if (!code) {
      toast.error("لطفا کد تایید را وارد کنید.");
      return;
    }
    setIsLoading(true);
    try {
      const verifyResponse: any = await validateVerificationCode(
        phoneNumber,
        code,
      );
      if (verifyResponse.error) {
        toast.error(verifyResponse.message?.[0] || "کد تایید نامعتبر است.");
      } else {
        toast.success("کد تایید صحیح است. به صفحه تغییر رمز هدایت می‌شوید.");
        // ناوبری به صفحه تغییر رمز
        navigate("/change-password", { state: { phoneNumber, code } });
      }
    } catch {
      toast.error("ارتباط با سرور برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen grid-cols-1 bg-cover bg-center md:grid-cols-2">
      <div className="bg-opacity-60 flex items-center justify-center bg-white px-4 backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl bg-[#EBF2FA] p-6 text-center shadow-2xl sm:p-8">
          <img
            src="src/assets/images/Sbu-logo.svg.png"
            alt="دانشگاه شهید بهشتی"
            className="mx-auto mb-4 w-24 sm:mb-6 sm:w-32"
          />
          <p className="mb-8 text-xl text-gray-500">تایید کد</p>
          <div className="space-y-6">
            {isLoading ? (
              <LoadingSpinner size="md" text="در حال پردازش..." />
            ) : (
              <>
                <input
                  type="text"
                  placeholder="کد تایید پیامک شده"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="focus:ring-primary-400 w-full rounded-[15px] border border-gray-300 bg-white px-4 py-2 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  className="w-full max-w-xs rounded-3xl bg-[#1B4965] py-2 font-bold text-white transition duration-300 hover:bg-[#358cc1] disabled:opacity-50"
                >
                  تایید کد
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-sm text-blue-600 hover:underline"
                >
                  بازگشت به صفحه ورود
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="hidden h-full w-full bg-cover bg-center md:block"
        style={{
          backgroundImage: "url('src/assets/images/background.jpg')",
        }}
      ></div>
    </div>
  );
};

export default VerifyCodePage;

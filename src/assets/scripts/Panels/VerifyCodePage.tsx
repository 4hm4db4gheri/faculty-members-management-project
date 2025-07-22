import React, { useState } from "react";
import { ApiService } from "../Services/ApiService";
import { toast } from "react-toastify";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyCodePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber } = location.state || {};
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // مرحله اول: اعتبارسنجی کد تایید
  const handleVerifyCode = async () => {
    if (!code) {
      toast.error("لطفا کد تایید را وارد کنید.");
      return;
    }
    setIsLoading(true);
    try {
      const verifyResponse: any = await ApiService.get(
        `/panel/v1/user/forget-password/verificationcode-validation?username=${encodeURIComponent(phoneNumber)}&code=${encodeURIComponent(code)}`,
      );
      if (verifyResponse.error) {
        toast.error(verifyResponse.message?.[0] || "کد تایید نامعتبر است.");
      } else {
        toast.success("کد تایید صحیح است. لطفا رمز عبور جدید را وارد کنید.");
        setIsCodeVerified(true);
      }
    } catch {
      toast.error("ارتباط با سرور برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  };

  // مرحله دوم: تغییر رمز عبور
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("لطفا همه فیلدها را پر کنید.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    setIsLoading(true);
    try {
      const changePasswordUrl = `/panel/v1/user/change-password?username=${encodeURIComponent(phoneNumber)}&code=${encodeURIComponent(code)}&newPassword=${encodeURIComponent(newPassword)}`;
      const response: any = await ApiService.get(changePasswordUrl);
      if (response.error) {
        toast.error(response.message[0] || "کد تایید یا رمز عبور نامعتبر است.");
      } else {
        toast.success("رمز عبور با موفقیت تغییر کرد.");
        navigate("/login");
      }
    } catch {
      toast.error("ارتباط با سرور برقرار نشد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen grid-cols-2 bg-cover bg-center">
      <div className="bg-opacity-60 flex items-center justify-center bg-white backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl bg-[#EBF2FA] p-8 text-center shadow-2xl">
          <img
            src="src/assets/images/Sbu-logo.svg.png"
            alt="دانشگاه شهید بهشتی"
            className="mx-auto mb-6 w-32"
          />
          <p className="mb-8 text-xl text-gray-500">
            تایید کد و تغییر رمز عبور
          </p>
          <div className="space-y-6">
            {isLoading ? (
              <LoadingSpinner size="md" text="در حال پردازش..." />
            ) : !isCodeVerified ? (
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
                  className="w-60 rounded-3xl bg-[#1B4965] py-2 font-bold text-white transition duration-300 hover:bg-[#358cc1] disabled:opacity-50"
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
            ) : (
              <>
                <input
                  type="password"
                  placeholder="رمز عبور جدید"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="focus:ring-primary-400 w-full rounded-[15px] border border-gray-300 bg-white px-4 py-2 focus:outline-none"
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="تکرار رمز عبور جدید"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="focus:ring-primary-400 w-full rounded-[15px] border border-gray-300 bg-white px-4 py-2 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="w-60 rounded-3xl bg-[#1B4965] py-2 font-bold text-white transition duration-300 hover:bg-[#358cc1] disabled:opacity-50"
                >
                  تغییر رمز عبور
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
        className="h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('src/assets/images/background.jpg')",
        }}
      ></div>
    </div>
  );
};

export default VerifyCodePage;

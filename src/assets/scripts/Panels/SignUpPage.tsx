import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage(""); // پاک کردن ارور قبلی
    try {
      const response = await fetch(
        "https://faculty.liara.run/api/panel/v1/user/log-in",
        {
          method: "POST",
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, password }),
        },
      );

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.message[0]);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage("ارتباط با سرور برقرار نشد");
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
            <input
              type="text"
              placeholder="نام کاربری"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="focus:ring-primary-400 w-full rounded-[15px] border border-gray-300 bg-white px-4 py-2 focus:outline-none"
            />
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-primary-400 w-full rounded-[15px] border border-gray-300 bg-white px-4 py-2 focus:outline-none"
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            <button
              onClick={handleLogin}
              className="mt-10 w-60 rounded-3xl bg-[#1B4965] py-2 font-bold text-white transition duration-300 hover:bg-[#358cc1]"
            >
              ورود
            </button>
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

export default SignUpPage;

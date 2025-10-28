import { useNavigate } from "react-router-dom";
import { AuthService } from "../Services/AuthService";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-6 py-12 max-w-2xl">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            صفحه مورد نظر یافت نشد
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است حذف شده
            باشد.
          </p>
        </div>

        {/* Illustration or Icon */}
        <div className="mb-10">
          <svg
            className="w-64 h-64 mx-auto text-indigo-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            بازگشت به صفحه قبل
          </button>
          <button
            onClick={handleGoHome}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            {isAuthenticated ? "بازگشت به داشبورد" : "بازگشت به صفحه اصلی"}
          </button>
        </div>

        {/* Additional Help Text */}
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            اگر فکر می‌کنید این یک خطا است، لطفاً با پشتیبانی تماس بگیرید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;


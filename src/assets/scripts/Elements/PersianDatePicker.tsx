import { useState } from "react";

interface PersianDatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export default function PersianDatePicker({
  value,
  onChange,
}: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // Convert English numbers to Persian
  const toPersianDigits = (str: string): string => {
    return str
      .replace(/0/g, "۰")
      .replace(/1/g, "۱")
      .replace(/2/g, "۲")
      .replace(/3/g, "۳")
      .replace(/4/g, "۴")
      .replace(/5/g, "۵")
      .replace(/6/g, "۶")
      .replace(/7/g, "۷")
      .replace(/8/g, "۸")
      .replace(/9/g, "۹");
  };

  // Convert Persian numbers to English
  const toEnglishDigits = (str: string): string => {
    return str
      .replace(/۰/g, "0")
      .replace(/۱/g, "1")
      .replace(/۲/g, "2")
      .replace(/۳/g, "3")
      .replace(/۴/g, "4")
      .replace(/۵/g, "5")
      .replace(/۶/g, "6")
      .replace(/۷/g, "7")
      .replace(/۸/g, "8")
      .replace(/۹/g, "9");
  };

  // Handle input change for year (4 digits)
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const englishInput = toEnglishDigits(input);
    // Only allow digits and max 4 characters
    if (/^\d*$/.test(englishInput) && englishInput.length <= 4) {
      setYear(toPersianDigits(englishInput));
    }
  };

  // Handle input change for month (2 digits)
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const englishInput = toEnglishDigits(input);
    // Only allow digits, max 2 characters, and max value 12
    if (/^\d*$/.test(englishInput) && englishInput.length <= 2) {
      const numValue = parseInt(englishInput) || 0;
      if (numValue <= 12 || englishInput === "") {
        setMonth(toPersianDigits(englishInput));
      }
    }
  };

  // Handle input change for day (2 digits)
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const englishInput = toEnglishDigits(input);
    // Only allow digits, max 2 characters, and max value 31
    if (/^\d*$/.test(englishInput) && englishInput.length <= 2) {
      const numValue = parseInt(englishInput) || 0;
      if (numValue <= 31 || englishInput === "") {
        setDay(toPersianDigits(englishInput));
      }
    }
  };

  const handleApply = () => {
    // Convert Persian numbers to English
    const englishYear = toEnglishDigits(year);
    const englishMonth = toEnglishDigits(month).padStart(2, "0");
    const englishDay = toEnglishDigits(day).padStart(2, "0");

    // Validate
    if (englishYear.length === 4 && month && day) {
      const formattedDate = `${englishDay}/${englishMonth}/${englishYear}`;
      onChange(formattedDate);
      setIsOpen(false);
    } else {
      alert("لطفا تاریخ را کامل وارد کنید (سال: ۴ رقم، ماه و روز: ۲ رقم)");
    }
  };

  const handleClear = () => {
    setYear("");
    setMonth("");
    setDay("");
    onChange("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Calendar Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors ${
          value
            ? "border-blue-500 bg-blue-50 text-blue-600"
            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
        }`}
        title="انتخاب تاریخ"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {/* Date Picker Modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-[#282828] opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-[20px] bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-center text-lg font-bold text-black">
              انتخاب تاریخ
            </h3>
            <p className="mb-4 text-center text-sm text-black">
              تاریخ را به صورت شمسی وارد کنید
            </p>

            {/* Three Input Fields for Day, Month, Year */}
            <div className="mb-4 flex items-center justify-center gap-2">
              {/* Day Input */}
              <div className="flex flex-col items-center">
                <label className="mb-1 text-xs text-gray-600">روز</label>
                <input
                  type="text"
                  value={day}
                  onChange={handleDayChange}
                  placeholder="۱۸"
                  maxLength={2}
                  className="w-16 rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-center text-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ direction: "ltr" }}
                />
              </div>

              <span className="mt-6 text-xl text-gray-400">/</span>

              {/* Month Input */}
              <div className="flex flex-col items-center">
                <label className="mb-1 text-xs text-gray-600">ماه</label>
                <input
                  type="text"
                  value={month}
                  onChange={handleMonthChange}
                  placeholder="۰۴"
                  maxLength={2}
                  className="w-16 rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-center text-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ direction: "ltr" }}
                />
              </div>

              <span className="mt-6 text-xl text-gray-400">/</span>

              {/* Year Input */}
              <div className="flex flex-col items-center">
                <label className="mb-1 text-xs text-gray-600">سال</label>
                <input
                  type="text"
                  value={year}
                  onChange={handleYearChange}
                  placeholder="۱۴۰۴"
                  maxLength={4}
                  className="w-20 rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-center text-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{ direction: "ltr" }}
                />
              </div>
            </div>

            <p className="mb-4 text-center text-xs text-gray-500">
              فرمت: روز/ماه/سال (مثال: ۱۸/۰۴/۱۴۰۴)
            </p>

            {value && (
              <div className="mb-4 rounded-[10px] bg-blue-50 p-2 text-center text-sm text-blue-800">
                تاریخ انتخاب شده: {toPersianDigits(value)}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="flex-1 rounded-[15px] bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                پاک کردن
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-[15px] bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
              >
                انصراف
              </button>
              <button
                onClick={handleApply}
                className="flex-1 rounded-[15px] bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                تایید
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

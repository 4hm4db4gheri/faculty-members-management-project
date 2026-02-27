import { useState, useEffect, useCallback } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MultiSelectFilter from "../Elements/MultiSelectFilter";
import { useChartData } from "../hooks/useChartData";
import LoadingSpinner from "../Elements/LoadingSpinner";

export default function ImprovementChartPanel() {
  // بارگذاری انتخاب‌های قبلی کاربر از localStorage
  const getStoredFaculties = (key: string): string[] => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // ذخیره انتخاب‌های کاربر در localStorage
  const saveFaculties = (key: string, faculties: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(faculties));
    } catch (error) {
      console.error("Error saving faculties to localStorage:", error);
    }
  };

  // دانشکده‌های دیفالت برای نمایش
  const DEFAULT_FACULTIES = [
    "هسته‌ای",
    "علوم و فناوري زيستي",
    "مدیریت و حسابداری",
  ];

  const [selectedChart1Faculties, setSelectedChart1Faculties] = useState<
    string[]
  >(() => {
    const stored = getStoredFaculties("improvementChart1Faculties");
    // اگر هیچ دانشکده‌ای ذخیره نشده، از دیفالت استفاده کن
    return stored.length > 0 ? stored : DEFAULT_FACULTIES;
  });
  const [selectedChart2Faculties, setSelectedChart2Faculties] = useState<
    string[]
  >(() => {
    const stored = getStoredFaculties("improvementChart2Faculties");
    // اگر هیچ دانشکده‌ای ذخیره نشده، از دیفالت استفاده کن
    return stored.length > 0 ? stored : DEFAULT_FACULTIES;
  });

  // دو لیست مجزا از دانشکده‌های انتخاب شده را به هوک ارسال می‌کنیم
  const { chartData1, chartData2, facultyOptions, isLoading, error } =
    useChartData(selectedChart1Faculties, selectedChart2Faculties);

  // Optimize faculty change handlers to prevent unnecessary re-renders
  const handleChart1FacultyChange = useCallback((faculties: string[]) => {
    setSelectedChart1Faculties(faculties);
  }, []);

  const handleChart2FacultyChange = useCallback((faculties: string[]) => {
    setSelectedChart2Faculties(faculties);
  }, []);

  // ذخیره انتخاب‌های کاربر در localStorage هر زمان که تغییر کنند
  useEffect(() => {
    saveFaculties("improvementChart1Faculties", selectedChart1Faculties);
  }, [selectedChart1Faculties]);

  useEffect(() => {
    saveFaculties("improvementChart2Faculties", selectedChart2Faculties);
  }, [selectedChart2Faculties]);

  return (
    <div className="flex h-full flex-col rounded-[15px] p-2 sm:rounded-[20px] sm:p-3 md:rounded-[25px] md:p-4">
      <h1 className="mb-2 text-center text-base font-bold text-black sm:mb-3 sm:text-lg md:mb-4 md:text-xl">
        نمودارهای آماری و پیشرفت
      </h1>

      {isLoading ? (
        <LoadingSpinner text="در حال بارگذاری نمودارها و فیلترها..." />
      ) : error ? (
        <div className="py-4 text-center text-sm text-red-600 sm:py-6 sm:text-base md:py-8">
          خطا در بارگذاری نمودارها: {error}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto sm:gap-3 md:gap-4 lg:gap-4">
          {/* بخش نمودار ۱ */}
          <div className="relative min-h-[280px] rounded-[15px] bg-white p-2 shadow sm:min-h-[320px] sm:rounded-[20px] sm:p-3 md:min-h-[350px] md:rounded-[25px] md:p-3 lg:min-h-[350px] lg:rounded-[25px] lg:p-3 lg:pb-8">
            <h2 className="mb-2 text-center text-sm font-bold text-gray-800 sm:mb-3 sm:text-base md:text-lg lg:mb-3 lg:text-center lg:text-lg">
              مرتبۀ علمی
            </h2>

            {/* دسکتاپ: فیلتر بالا سمت چپ (نسخه اول) */}
            <div className="absolute top-4 left-4 z-10 hidden lg:block">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart1Faculties}
                onSelectionChange={handleChart1FacultyChange}
                label="فیلتر دانشکده"
              />
            </div>

            {/* داده‌های نمودار ۱ */}
            <div className="flex h-[220px] items-center justify-center sm:h-[250px] md:h-[280px] lg:h-[300px]">
              {chartData1 && chartData1.length > 0 ? (
                <ChartComponent1 data={chartData1} />
              ) : (
                <p className="text-center text-sm text-gray-500 sm:text-base md:text-lg">
                  هیچ دانشکده‌ای انتخاب نشده است
                </p>
              )}
            </div>

            {/* موبایل: فیلتر زیر نمودار */}
            <div className="mt-2 flex justify-center sm:mt-3 md:mt-4 lg:hidden">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart1Faculties}
                onSelectionChange={handleChart1FacultyChange}
                label="فیلتر دانشکده"
              />
            </div>
          </div>

          {/* بخش نمودار ۲ */}
          <div className="relative min-h-[280px] rounded-[15px] bg-white p-2 shadow sm:min-h-[320px] sm:rounded-[20px] sm:p-3 md:min-h-[350px] md:rounded-[25px] md:p-3 lg:min-h-[350px] lg:rounded-[25px] lg:p-3 lg:pb-8">
            <h2 className="mb-2 text-center text-sm font-bold text-gray-800 sm:mb-3 sm:text-base md:text-lg lg:mb-3 lg:text-center lg:text-lg">
              آمار تفکیکی اعضای هیئت علمی
            </h2>

            <div className="absolute top-4 left-4 z-10 hidden lg:block">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart2Faculties}
                onSelectionChange={handleChart2FacultyChange}
                label="فیلتر دانشکده"
              />
            </div>

            <div className="flex h-[220px] items-center justify-center sm:h-[250px] md:h-[280px] lg:h-[300px]">
              {chartData2 && chartData2.length > 0 ? (
                <ChartComponent2 data={chartData2} />
              ) : (
                <p className="text-center text-sm text-gray-500 sm:text-base md:text-lg">
                  هیچ دانشکده‌ای انتخاب نشده است
                </p>
              )}
            </div>

            <div className="mt-2 flex justify-center sm:mt-3 md:mt-4 lg:hidden">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart2Faculties}
                onSelectionChange={handleChart2FacultyChange}
                label="فیلتر دانشکده"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

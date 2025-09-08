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

  const [selectedChart1Faculties, setSelectedChart1Faculties] = useState<
    string[]
  >(() => getStoredFaculties("improvementChart1Faculties"));
  const [selectedChart2Faculties, setSelectedChart2Faculties] = useState<
    string[]
  >(() => getStoredFaculties("improvementChart2Faculties"));

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
    <div className="flex h-full flex-col overflow-hidden rounded-[25px] p-4">
      <h1 className="mb-4 text-center text-xl font-bold text-black">
        نمودارهای آماری و پیشرفت
      </h1>

      {isLoading ? (
        <LoadingSpinner text="در حال بارگذاری نمودارها و فیلترها..." />
      ) : error ? (
        <div className="py-8 text-center text-red-600">
          خطا در بارگذاری نمودارها: {error}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          {/* بخش نمودار ۱ */}
          <div className="relative flex-1 rounded-[25px] bg-white p-3 shadow">
            <h2 className="mb-3 text-center text-lg font-bold text-gray-800">
              مرتبۀ علمی
            </h2>

            <div className="absolute top-4 left-4 z-10">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart1Faculties}
                onSelectionChange={handleChart1FacultyChange}
                label="فیلتر دانشکده"
              />
            </div>

            {/* داده‌های نمودار ۱ که از هوک دریافت شده و فیلتر شده‌اند */}
            <div className="flex h-full items-center justify-center">
              {chartData1 && chartData1.length > 0 ? (
                <ChartComponent1 data={chartData1} />
              ) : (
                <p className="text-center text-lg text-gray-500">
                  هیچ دانشکده‌ای انتخاب نشده است
                </p>
              )}
            </div>
          </div>

          {/* بخش نمودار ۲ */}
          <div className="relative flex-1 rounded-[25px] bg-white p-3 shadow">
            <h2 className="mb-3 text-center text-lg font-bold text-gray-800">
              آمار تفکیکی اعضای هیئت علمی
            </h2>

            <div className="absolute top-4 left-4 z-10">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart2Faculties}
                onSelectionChange={handleChart2FacultyChange}
                label="فیلتر دانشکده"
              />
            </div>

            {/* داده‌های نمودار ۲ که از هوک دریافت شده و فیلتر شده‌اند */}
            <div className="flex h-full items-center justify-center">
              {chartData2 && chartData2.length > 0 ? (
                <ChartComponent2 data={chartData2} />
              ) : (
                <p className="text-center text-lg text-gray-500">
                  هیچ دانشکده‌ای انتخاب نشده است
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

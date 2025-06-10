import { useState, useMemo, useEffect } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MultiSelectFilter from "../Elements/MultiSelectFilter";
import { useChartData } from "../hooks/useChartData";
import LoadingSpinner from "../Elements/LoadingSpinner";

export default function ImprovementChartPanel() {
  const { chartData1, chartData2, facultyOptions, isLoading, error } =
    useChartData();

  const [selectedChart1Faculties, setSelectedChart1Faculties] = useState<
    string[]
  >([]);
  const [selectedChart2Faculties, setSelectedChart2Faculties] = useState<
    string[]
  >([]);

  // Move useMemo declarations BEFORE useEffect
  const filteredData1 = useMemo(() => {
    if (!chartData1) return []; // Return empty if data is not loaded yet
    // If no faculty is selected, show all data (common UX pattern)
    if (selectedChart1Faculties.length === 0 && facultyOptions.length > 0) {
      return chartData1;
    }
    return chartData1.filter((item) =>
      selectedChart1Faculties.includes(item.name),
    );
  }, [selectedChart1Faculties, chartData1, facultyOptions]);

  const filteredData2 = useMemo(() => {
    if (!chartData2) return []; // Return empty if data is not loaded yet
    // If no faculty is selected, show all data (common UX pattern)
    if (selectedChart2Faculties.length === 0 && facultyOptions.length > 0) {
      return chartData2;
    }
    return chartData2.filter((item) =>
      selectedChart2Faculties.includes(item.name),
    );
  }, [selectedChart2Faculties, chartData2, facultyOptions]);

  // Update selected faculties when facultyOptions are loaded
  useEffect(() => {
    if (facultyOptions.length > 0) {
      // Only set if currently empty, meaning it's the initial load or "Deselect All" resulted in empty
      if (selectedChart1Faculties.length === 0) {
        setSelectedChart1Faculties([...facultyOptions]);
      }
      if (selectedChart2Faculties.length === 0) {
        setSelectedChart2Faculties([...facultyOptions]);
      }
    }
  }, [facultyOptions]); // Dependencies are now just facultyOptions, as selectedChartXFaculties change internally

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-[25px] p-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-black">
        نمودارهای آماری و پیشرفت
      </h1>

      {isLoading ? (
        <LoadingSpinner text="در حال بارگذاری نمودارها و فیلترها..." />
      ) : error ? (
        <div className="py-8 text-center text-red-600">
          خطا در بارگذاری نمودارها: {error}
        </div>
      ) : (
        <>
          {/* Chart 1 Section */}
          <div className="relative mb-8 rounded-[25px] bg-white p-4 shadow">
            <h2 className="mb-4 text-center text-xl font-bold text-gray-800 sm:text-2xl">
              مرتبۀ علمی
            </h2>

            <div className="absolute top-4 left-4 z-10">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart1Faculties}
                onSelectionChange={setSelectedChart1Faculties}
                label="فیلتر دانشکده"
              />
            </div>

            {filteredData1.length > 0 ? (
              <ChartComponent1 data={filteredData1} />
            ) : (
              <p className="py-8 text-center text-gray-500">
                هیچ داده‌ای برای نمایش وجود ندارد. حداقل یک دانشکده را انتخاب
                کنید.
              </p>
            )}
          </div>

          {/* Chart 2 Section */}
          <div className="relative mb-8 rounded-[25px] bg-white p-4 shadow">
            <h2 className="mb-4 text-center text-xl font-bold text-gray-800 sm:text-2xl">
              آمار تفکیکی اعضای هیئت علمی
            </h2>

            <div className="absolute top-4 left-4 z-10">
              <MultiSelectFilter
                options={facultyOptions}
                selectedOptions={selectedChart2Faculties}
                onSelectionChange={setSelectedChart2Faculties}
                label="فیلتر دانشکده"
              />
            </div>

            {filteredData2.length > 0 ? (
              <ChartComponent2 data={filteredData2} />
            ) : (
              <p className="py-8 text-center text-gray-500">
                هیچ داده‌ای برای نمایش وجود ندارد. حداقل یک دانشکده را انتخاب
                کنید.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

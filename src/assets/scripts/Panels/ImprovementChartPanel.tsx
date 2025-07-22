import { useState, useEffect } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MultiSelectFilter from "../Elements/MultiSelectFilter";
import { useChartData } from "../hooks/useChartData";
import LoadingSpinner from "../Elements/LoadingSpinner";

export default function ImprovementChartPanel() {
  // مقداردهی اولیه با ۳ دانشکده پیش‌فرض
  const defaultFaculties = [
    "هسته‌ای",
    "علوم و فناوري زيستي",
    "مدیریت و حسابداری",
  ];

  const [selectedChart1Faculties, setSelectedChart1Faculties] =
    useState<string[]>(defaultFaculties); // مقداردهی اولیه برای نمودار ۱
  const [selectedChart2Faculties, setSelectedChart2Faculties] =
    useState<string[]>(defaultFaculties); // مقداردهی اولیه برای نمودار ۲

  // دو لیست مجزا از دانشکده‌های انتخاب شده را به هوک ارسال می‌کنیم
  const { chartData1, chartData2, facultyOptions, isLoading, error } =
    useChartData(selectedChart1Faculties, selectedChart2Faculties);

  // این useEffect فقط برای اطمینان از مقداردهی اولیه facultyOptions است
  // و دیگر به صورت خودکار فیلترها را به همه دانشکده‌ها گسترش نمی‌دهد.
  useEffect(() => {
    // اگر لیست دانشکده‌ها هنوز بارگذاری نشده و لیست‌های انتخاب شده با دیفالت فرق می‌کنند، اینجا دستکاری نکن.
    // اگر facultyOptions بارگذاری شده و selectedChart1Faculties همچنان دیفالت است، آن را با تمام گزینه‌های ممکن (از API) جایگزین کن.
    // اما در این مورد، ما میخواهیم که به صورت خودکار جایگزین نشود. پس نیازی به این منطق نیست.
    // منطق قبلی که باعث می‌شد اگر دیفالت بود، همه دانشکده‌ها انتخاب شوند را حذف می‌کنیم.
  }, [facultyOptions]); // این Effect فقط به facultyOptions واکنش نشان می‌دهد.

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
          {/* بخش نمودار ۱ */}
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

            {/* داده‌های نمودار ۱ که از هوک دریافت شده و فیلتر شده‌اند */}
            {chartData1 && chartData1.length > 0 ? (
              <ChartComponent1 data={chartData1} />
            ) : (
              <p className="py-8 text-center text-gray-500">
                هیچ داده‌ای برای نمایش وجود ندارد. حداقل یک دانشکده را انتخاب
                کنید.
              </p>
            )}
          </div>

          {/* بخش نمودار ۲ */}
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

            {/* داده‌های نمودار ۲ که از هوک دریافت شده و فیلتر شده‌اند */}
            {chartData2 && chartData2.length > 0 ? (
              <ChartComponent2 data={chartData2} />
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

import { useState, useEffect, useRef } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MyInput from "../Elements/MyInput";
import type { Teacher } from "../types/Teacher";
import { initialMockTeachers } from "./HistoryPanel";
import { useNavigate } from "react-router-dom";
import { useChartData } from "../hooks/useChartData"; // Import the custom hook
import LoadingSpinner from "../Elements/LoadingSpinner"; // Make sure LoadingSpinner is imported

export default function MainDashboardPanel() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Teacher[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { chartData1, chartData2, isLoading, error } = useChartData(); // Use the custom hook

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const results = initialMockTeachers
      .filter((teacher) => {
        const searchLower = value.toLowerCase();
        return (
          teacher.firstName.toLowerCase().includes(searchLower) ||
          teacher.lastName.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 5);

    setSearchResults(results);
    setShowDropdown(true);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    navigate(`/dashboard/records/${teacher.id}`);
    setShowDropdown(false);
    setSearchText("");
  };

  return (
    <div className="box-border grid h-full grid-cols-1 gap-4 overflow-y-auto rounded-[25px] lg:grid-cols-3 lg:gap-[30px]">
      <div className="col-span-1 grid h-full grid-rows-[auto_auto_auto] gap-4 lg:col-span-2 lg:gap-[30px]">
        <div className="rounded-[25px] p-2">
          <div className="relative items-center rounded-[25px] pr-[10px]">
            <MyInput
              placeholder="جستجو"
              value={searchText}
              onChange={handleSearch}
              className="bg-transparent"
            />

            {/* Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-50 mt-1 w-full rounded-[15px] bg-white shadow-lg"
              >
                {searchResults.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => handleTeacherSelect(teacher)}
                    className="w-full px-4 py-2 text-right text-sm text-black first:rounded-t-[15px] last:rounded-b-[15px] hover:bg-gray-100"
                  >
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner text="در حال بارگذاری نمودارها..." />
        ) : error ? (
          <div className="py-8 text-center text-red-600">
            خطا در بارگذاری نمودارها: {error}
          </div>
        ) : (
          <>
            <div className="rounded-[25px] bg-white p-4 shadow">
              <h2 className="mb-2 text-center text-xl font-bold text-gray-800 sm:text-2xl">
                مرتبۀ علمی
              </h2>
              <div className="h-fit">
                <ChartComponent1 data={chartData1 || []} />
              </div>
            </div>

            <div className="rounded-[25px] bg-white p-4 shadow">
              <h2 className="mb-2 text-center text-xl font-bold text-gray-800 sm:text-2xl">
                آمار تفکیکی اعضای هیئت علمی
              </h2>
              <div className="h-fit">
                <ChartComponent2 data={chartData2 || []} />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="col-span-1 flex flex-col items-center justify-center rounded-[25px] bg-white p-4 shadow lg:pt-[10px]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#8D8D8D] text-sm text-white sm:h-32 sm:w-32 sm:text-base">
          Pic
        </div>
        <div className="flex content-center items-center justify-center pt-4 text-3xl text-black sm:pt-6 sm:text-4xl">
          اسم کاربر
        </div>
        <div className="grid w-full grid-cols-4 gap-2 p-4 pt-8 sm:gap-4">
          <div className="col-span-1 flex h-16 items-center justify-center rounded-[25px] bg-red-500 text-sm sm:h-20 sm:text-base">
            نقش
          </div>
          <button className="col-span-3 flex h-16 cursor-pointer items-center justify-center rounded-[25px] border-none bg-[#D9D9D9] p-2 text-center text-xl font-bold text-black transition-colors duration-300 hover:bg-[#A6A6A6] sm:h-20 sm:text-2xl">
            مدت زمان
          </button>
        </div>
      </div>
    </div>
  );
}

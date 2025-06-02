import { useState, useEffect, useRef } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MyInput from "../Elements/MyInput";
import type { Teacher } from "../types/Teacher";

import { useNavigate } from "react-router-dom";
import { useChartData } from "../hooks/useChartData"; // Import the custom hook
import LoadingSpinner from "../Elements/LoadingSpinner";

interface ApiTeacher {
  id: number;
  firstName: string;
  lastName: string;
  facultyName: string;
  academicRank: number;
}

interface ApiResponse {
  data: ApiTeacher[];
  error: boolean;
  message: string[];
}

export default function MainDashboardPanel() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Teacher[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { chartData1, chartData2} = useChartData(); // Use the custom hook

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          "https://faculty.liara.run/api/teacher/read-teacher?PageNumber=1&PageSize=9999",
          {
            headers: {
              accept: "*/*",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch teachers");
        }

        const apiData: ApiResponse = await response.json();

        if (!apiData.error) {
          const convertedTeachers: Teacher[] = apiData.data.map(
            (apiTeacher) => ({
              id: apiTeacher.id,
              firstName: apiTeacher.firstName,
              lastName: apiTeacher.lastName,
              faculty: apiTeacher.facultyName,
              rank: getRankString(apiTeacher.academicRank),
            }),
          );

          setTeachers(convertedTeachers);
        } else {
          throw new Error(apiData.message.join(", "));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Helper function to convert rank number to string
  const getRankString = (rank: number): string => {
    switch (rank) {
      case 0:
        return "استاد";
      case 1:
        return "دانشیار";
      case 2:
        return "استادیار";
      default:
        return "نامشخص";
    }
  };

  // Close dropdown when clicking outside
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

    const searchTerms = value.trim().toLowerCase().split(/\s+/);

    const results = teachers.filter((teacher) => {
      if (searchTerms.length === 1) {
        const searchTerm = searchTerms[0];
        return (
          teacher.firstName.toLowerCase().includes(searchTerm) ||
          teacher.lastName.toLowerCase().includes(searchTerm)
        );
      } else {
        return searchTerms.every(
          (term) =>
            teacher.firstName.toLowerCase().includes(term) ||
            teacher.lastName.toLowerCase().includes(term),
        );
      }
    });

    setSearchResults(results);
    setShowDropdown(true);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    navigate(`/dashboard/records/${teacher.id}`);
    setShowDropdown(false);
    setSearchText("");
  };

  if (selectedTeacher) {
    return <UserInfo teacher={selectedTeacher} />;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        خطا در دریافت اطلاعات: {error}
      </div>
    );
  }

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

            {showDropdown && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 absolute z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded-[15px] bg-white shadow-lg"
              >
                {searchResults.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => handleTeacherSelect(teacher)}
                    className="w-full px-4 py-2 text-right text-sm text-black first:rounded-t-[15px] last:rounded-b-[15px] hover:bg-gray-100"
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

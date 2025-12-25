import { useState, useEffect, useRef, useCallback } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MyInput from "../Elements/MyInput";
import type { Teacher } from "../types/Teacher";
import UserInfo from "./UserInfo";
import { useNavigate } from "react-router-dom";
import { useChartData } from "../hooks/useChartData";
import LoadingSpinner from "../Elements/LoadingSpinner";
import {
  searchTeachers,
  getSentTeacherNotificationsV2,
} from "../Services/apiEndpoints";
import { useDebounce } from "../hooks/useDebounce";

interface ApiTeacher {
  id: number;
  firstName: string;
  lastName: string;
  facultyNameInPersian: string;
  facultyNameInEnglish: string;
  academicRank: number;
  tId: string;
  createTime: string;
}

interface ApiResponse {
  data: ApiTeacher[];
  error: boolean;
  message: string[];
}

interface SentNotification {
  title: string;
  teacherName: string;
  status: string;
}

export default function MainDashboardPanel() {
  // Static faculties to show in charts
  const staticFaculties = [
    "هسته‌ای",
    "علوم و فناوري زيستي",
    "مدیریت و حسابداری",
  ];

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Teacher[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use static faculties for both charts
  const { chartData1, chartData2 } = useChartData(
    staticFaculties,
    staticFaculties,
  );

  const [selectedTeacher] = useState<Teacher | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Add state for latest notifications
  const [latestNotifications, setLatestNotifications] = useState<
    SentNotification[]
  >([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState<string | null>(null);

  // Add state for user name
  const [userName, setUserName] = useState<string>("اسم کاربر");

  // Debounce search text (500ms delay)
  const debouncedSearchText = useDebounce(searchText, 500);

  // Get user name from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.firstName && parsedUserData.lastName) {
          setUserName(`${parsedUserData.firstName} ${parsedUserData.lastName}`);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Perform API search when debounced search text changes
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    console.log(`🔍 MainDashboard: Starting search for: "${searchQuery}"`);

    try {
      const terms = searchQuery.trim().split(/\s+/);
      let response: ApiResponse | null = null;

      if (terms.length === 1) {
        // Single word: try as LastName first
        console.log(`🔍 MainDashboard: Trying LastName="${terms[0]}"`);
        try {
          const lastNameResponse = (await searchTeachers({
            lastName: terms[0],
            pageSize: 10,
          })) as ApiResponse;

          console.log(`📥 MainDashboard: LastName response:`, lastNameResponse);

          if (!lastNameResponse.error && lastNameResponse.data.length > 0) {
            console.log(
              `✅ MainDashboard: Found ${lastNameResponse.data.length} results with LastName`,
            );
            response = lastNameResponse;
          }
        } catch (lastNameError) {
          // If LastName search fails (e.g., 400 with "ایتمی وجود ندارد"), continue to FirstName search
          console.log(
            `⚠️ MainDashboard: LastName search failed, will try FirstName:`,
            lastNameError,
          );
        }

        // If no results with LastName, try FirstName
        if (!response) {
          console.log(
            `🔍 MainDashboard: No LastName results, trying FirstName="${terms[0]}"`,
          );
          try {
            const firstNameResponse = (await searchTeachers({
              firstName: terms[0],
              pageSize: 10,
            })) as ApiResponse;

            console.log(
              `📥 MainDashboard: FirstName response:`,
              firstNameResponse,
            );

            if (!firstNameResponse.error && firstNameResponse.data.length > 0) {
              console.log(
                `✅ MainDashboard: Found ${firstNameResponse.data.length} results with FirstName`,
              );
              response = firstNameResponse;
            }
          } catch (firstNameError) {
            console.log(
              `⚠️ MainDashboard: FirstName search also failed:`,
              firstNameError,
            );
          }
        }

        if (!response) {
          console.log(`❌ MainDashboard: No results found for "${terms[0]}"`);
        }
      } else if (terms.length >= 2) {
        // Two or more words: first is FirstName, second is LastName
        console.log(
          `🔍 MainDashboard: Trying FirstName="${terms[0]}" + LastName="${terms[1]}"`,
        );
        try {
          response = (await searchTeachers({
            firstName: terms[0],
            lastName: terms[1],
            pageSize: 10,
          })) as ApiResponse;

          console.log(`📥 MainDashboard: Combined response:`, response);
        } catch (combinedError) {
          console.log(
            `⚠️ MainDashboard: Combined search failed:`,
            combinedError,
          );
        }
      }

      if (response && !response.error && response.data.length > 0) {
        const convertedTeachers: Teacher[] = response.data.map(
          (apiTeacher: ApiTeacher) => ({
            id: apiTeacher.id,
            firstName: apiTeacher.firstName,
            lastName: apiTeacher.lastName,
            faculty: apiTeacher.facultyNameInPersian || "",
            rank: getRankString(apiTeacher.academicRank),
            academicRank: apiTeacher.academicRank,
            phoneNumber: "",
            email: "",
            group: "",
            lastDegree: "",
            employmentStatus: "",
            isTeaching: false,
            nationalCode: "",
            points: 0,
          }),
        );

        console.log(
          `✅ MainDashboard: Displaying ${convertedTeachers.length} results`,
        );
        setSearchResults(convertedTeachers);
        setShowDropdown(true);
      } else {
        console.log(`❌ MainDashboard: No valid results to display`);
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (err) {
      console.error("❌ MainDashboard: Search error:", err);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Trigger search when debounced text changes
  useEffect(() => {
    void performSearch(debouncedSearchText);
  }, [debouncedSearchText, performSearch]);

  // Add state for latest notifications
  useEffect(() => {
    const fetchLatestNotifications = async () => {
      setNotifLoading(true);
      try {
        const response = await getSentTeacherNotificationsV2(1, 3);
        if (!response.error) {
          setLatestNotifications(response.data);
        } else {
          throw new Error(response.message.join(", "));
        }
      } catch (err) {
        setNotifError(
          err instanceof Error ? err.message : "خطا در دریافت اعلان‌ها",
        );
      } finally {
        setNotifLoading(false);
      }
    };
    fetchLatestNotifications();
  }, []);

  // Helper function to convert rank number to string (matching UserInfo.tsx)
  const getRankString = (rank: number): string => {
    switch (rank) {
      case 0:
        return "استادیار";
      case 1:
        return "دانشیار";
      case 2:
        return "استاد تمام";
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
    // Actual search is triggered by debounced value in useEffect
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    navigate(`/dashboard/records/${teacher.id}`);
    setShowDropdown(false);
    setSearchText("");
  };

  if (selectedTeacher) {
    return <UserInfo teacher={selectedTeacher} />;
  }

  return (
    <div className="box-border grid h-full grid-cols-1 gap-4 rounded-[25px] p-2 sm:gap-5 md:p-0 lg:grid-cols-3 lg:gap-[30px]">
      <div className="col-span-1 grid h-full grid-rows-[auto_1fr_1fr] gap-4 sm:gap-5 lg:col-span-2 lg:grid-rows-[0.4fr_2fr_2fr] lg:gap-[30px]">
        <div className="rounded-[25px]">
          <div className="relative items-center rounded-[25px] px-2 sm:pr-[10px]">
            <MyInput
              placeholder="جستجو"
              value={searchText}
              onChange={handleSearch}
              className="bg-transparent"
            />

            {/* Search Loading Indicator */}
            {isSearching && searchText.trim() && (
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <LoadingSpinner size="sm" showText={false} />
              </div>
            )}

            {/* Updated Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-[15px] bg-white shadow-lg sm:max-h-[300px]"
              >
                {searchResults.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => handleTeacherSelect(teacher)}
                    className="w-full px-4 py-2 text-right text-sm text-black first:rounded-t-[15px] last:rounded-b-[15px] hover:bg-gray-100 sm:text-base"
                  >
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[25px] bg-white p-3 shadow sm:p-4">
          <h2 className="mb-2 text-center text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl">
            مرتبۀ علمی
          </h2>
          <div className="h-[200px] sm:h-[240px] lg:h-[280px]">
            <ChartComponent1 data={chartData1 || []} />
          </div>
        </div>

        <div className="rounded-[25px] bg-white p-3 shadow sm:p-4">
          <h2 className="mb-2 text-center text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl">
            آمار تفکیکی اعضای هیئت علمی
          </h2>
          <div className="h-[200px] sm:h-[240px] lg:h-[280px]">
            <ChartComponent2 data={chartData2 || []} />
          </div>
        </div>
      </div>
      <div className="col-span-1 flex h-full min-h-[500px] flex-col items-center justify-start rounded-[25px] bg-white py-6 sm:py-8 lg:justify-center lg:pt-[10px]">
        <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full bg-[#8D8D8D] sm:h-[130px] sm:w-[130px]">
          <img
            src="/user-avatar.png"
            alt="User Avatar"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML =
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' class='h-24 w-24'><path fill-rule='evenodd' d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z' clip-rule='evenodd'/></svg>`;
            }}
          />
        </div>
        <div className="pt-4 text-center text-2xl text-black sm:pt-[30px] sm:text-3xl lg:text-4xl xl:text-5xl">
          {userName}
        </div>

        {/* New notifications section */}
        <div className="mt-4 flex w-full flex-col gap-3 px-4 sm:mt-6 sm:gap-4 sm:p-5 lg:mt-8">
          <button
            onClick={() => navigate("/dashboard/sent-notifications")}
            className="w-full rounded-[20px] bg-[#1B4965] px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#3388BC] sm:rounded-[25px] sm:px-6 sm:py-3 sm:text-lg lg:text-xl"
          >
            بررسی وضعیت اعلان‌ها
          </button>
          <div className="flex flex-col gap-2 rounded-[20px] bg-gray-50 p-3 sm:rounded-[25px] sm:p-4">
            <h3 className="mb-1 text-base font-semibold text-gray-800 sm:mb-2 sm:text-lg">
              آخرین اعلان‌ها
            </h3>
            {notifLoading ? (
              <div className="text-center text-sm text-gray-500 sm:text-base">
                در حال بارگذاری...
              </div>
            ) : notifError ? (
              <div className="text-center text-sm text-red-500 sm:text-base">
                {notifError}
              </div>
            ) : latestNotifications.length === 0 ? (
              <div className="text-center text-sm text-gray-500 sm:text-base">
                اعلانی وجود ندارد
              </div>
            ) : (
              latestNotifications.map((notification) => (
                <div
                  key={
                    notification.title +
                    notification.teacherName +
                    notification.status
                  }
                  className="flex flex-col gap-1 rounded-lg bg-white p-2.5 shadow-sm sm:p-3"
                >
                  <div className="flex flex-row items-center justify-between gap-2">
                    <span className="text-xs font-medium text-gray-800 sm:text-sm">
                      {notification.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] whitespace-nowrap sm:py-1 sm:text-xs ${notification.status.trim() === "Sent" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {notification.status.trim() === "Sent"
                        ? "ارسال شد"
                        : "ناموفق"}
                    </span>
                  </div>
                  <div className="text-[10px] text-black sm:text-xs">
                    {notification.teacherName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

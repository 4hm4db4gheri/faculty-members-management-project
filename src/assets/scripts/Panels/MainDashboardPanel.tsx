import { useState, useEffect, useRef } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MyInput from "../Elements/MyInput";
import type { Teacher } from "../types/Teacher";
import UserInfo from "./UserInfo";
import { useNavigate } from "react-router-dom";
import { useChartData } from "../hooks/useChartData";
import LoadingSpinner from "../Elements/LoadingSpinner";
import {
  getTeachers,
  getSentTeacherNotificationsV2,
} from "../Services/apiEndpoints";

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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for latest notifications
  const [latestNotifications, setLatestNotifications] = useState<
    SentNotification[]
  >([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState<string | null>(null);

  // Fetch teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const response = (await getTeachers()) as ApiResponse;

        if (response.error) {
          throw new Error(response.message[0] || "Failed to fetch teachers");
        }

        const convertedTeachers: Teacher[] = response.data.map(
          (apiTeacher: ApiTeacher) => ({
            id: apiTeacher.id,
            firstName: apiTeacher.firstName,
            lastName: apiTeacher.lastName,
            faculty: apiTeacher.facultyNameInPersian,
            rank: getRankString(apiTeacher.academicRank),
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

        setTeachers(convertedTeachers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

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
    <div className="box-border grid h-full grid-cols-3 gap-[30px] rounded-[25px]">
      <div className="col-span-2 grid h-full grid-rows-[0.4fr_2fr_2fr] gap-[30px]">
        <div className="rounded-[25px]">
          <div className="relative items-center rounded-[25px] pr-[10px]">
            <MyInput
              placeholder="جستجو"
              value={searchText}
              onChange={handleSearch}
              className="bg-transparent"
            />

            {/* Updated Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 absolute z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded-[15px] bg-white shadow-lg"
              >
                {searchResults.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => handleTeacherSelect(teacher)}
                    className="w-full px-4 py-2 text-right text-black first:rounded-t-[15px] last:rounded-b-[15px] hover:bg-gray-100"
                  >
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[25px] bg-white shadow">
          <h2 className="text-center text-2xl font-bold">مرتبۀ علمی</h2>
          <div className="h-fit">
            <ChartComponent1 data={chartData1 || []} />
          </div>
        </div>

        <div className="rounded-[25px] bg-white shadow">
          <h2 className="text-center text-2xl font-bold">
            آمار تفکیکی اعضای هیئت علمی
          </h2>
          <div className="h-fit">
            <ChartComponent2 data={chartData2 || []} />
          </div>
        </div>
      </div>
      <div className="col-span-1 flex h-full flex-col items-center justify-center rounded-[25px] bg-white pt-[10px]">
        <div className="flex h-[130px] w-[130px] items-center justify-center rounded-full bg-[#8D8D8D]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="h-24 w-24"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex content-center items-center justify-center pt-[30px] text-5xl text-black">
          اسم کاربر
        </div>

        {/* New notifications section */}
        <div className="mt-8 flex w-full flex-col gap-4 p-5">
          <button
            onClick={() => navigate("/dashboard/sent-notifications")}
            className="w-full rounded-[25px] bg-[#1B4965] px-6 py-3 text-xl font-semibold text-white transition-colors hover:bg-[#3388BC]"
          >
            بررسی وضعیت اعلان‌ها
          </button>
          <div className="flex flex-col gap-2 rounded-[25px] bg-gray-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              آخرین اعلان‌ها
            </h3>
            {notifLoading ? (
              <div className="text-center text-gray-500">
                در حال بارگذاری...
              </div>
            ) : notifError ? (
              <div className="text-center text-red-500">{notifError}</div>
            ) : latestNotifications.length === 0 ? (
              <div className="text-center text-gray-500">اعلانی وجود ندارد</div>
            ) : (
              latestNotifications.map((notification) => (
                <div
                  key={
                    notification.title +
                    notification.teacherName +
                    notification.status
                  }
                  className="flex flex-col gap-1 rounded-lg bg-white p-3 shadow-sm"
                >
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      {notification.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${notification.status.trim() === "Sent" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {notification.status.trim() === "Sent"
                        ? "ارسال شد"
                        : "ناموفق"}
                    </span>
                  </div>
                  <div className="text-xs text-black">
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

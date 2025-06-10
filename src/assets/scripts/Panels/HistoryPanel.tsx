import { useState, useMemo, useEffect } from "react";
import MyPagination from "../Elements/MyPagination";
import MyInput from "../Elements/MyInput";
import MyPopup from "../Elements/MyPopup";
import MyTeacherContainer from "../Elements/MyTeacherContainer";
import AdvancedSearch from "../Elements/AdvancedSearch";
import UserInfo from "../Panels/UserInfo";
import type { Teacher } from "../types/Teacher";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { ApiService } from "../Services/ApiService";

interface HistoryPanelProps {
  onTeacherSelect: (teacher: Teacher) => void;
}

// Update Teacher interface to match API response
interface ApiTeacher {
  id: number;
  firstName: string;
  lastName: string;
  facultyNameInPersian: string;
  facultyNameInEnglish: string;
  academicRank: number;
  tId: string;
  createTime: string;
  // ...other fields can be added as needed
}

interface ApiResponse {
  data: ApiTeacher[];
  error: boolean;
  message: string[];
}

export default function HistoryPanel({ onTeacherSelect }: HistoryPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPdfPopupOpen, setIsPdfPopupOpen] = useState(false);
  const [isExcelPopupOpen, setIsExcelPopupOpen] = useState(false);
  const [isTeachersUploadOpen, setIsTeachersUploadOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedSearchResults, setAdvancedSearchResults] = useState<
    Teacher[] | null
  >(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchName, setSearchName] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("همه");
  const [selectedDegree, setSelectedDegree] = useState("همه");

  const handleFileUpload = (file: File) => {
    // Here you would handle the file upload to backend
    console.log(`File was uploaded: ${file.name}`);
  };

  const handleTeachersUpload = (file: File) => {
    // TODO: Implement API call to upload teachers list
    console.log(`Teachers list file uploaded: ${file.name}`);
    // In the future, you would:
    // 1. Send the file to the server
    // 2. Process the response
    // 3. Update the teachers list if successful
    // 4. Show appropriate toast messages
  };

  const handleAdvancedSearchResults = (results: Teacher[]) => {
    if (results.length === 1) {
      setSelectedTeacher(results[0]);
      setShowUserInfo(true);
    } else {
      setAdvancedSearchResults(results);
      setShowUserInfo(false);
    }
  };

  // Function to convert academicRank number to string
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

  // Fetch teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.get<ApiResponse>(
          "/panel/v1/teacher/read-teachers?PageNumber=1&PageSize=1000",
        );

        if (!response.error) {
          // Convert API data to match your Teacher interface
          const convertedTeachers: Teacher[] = response.data.map(
            (apiTeacher) => ({
              id: apiTeacher.id,
              firstName: apiTeacher.firstName,
              lastName: apiTeacher.lastName,
              faculty: apiTeacher.facultyNameInPersian,
              rank: getRankString(apiTeacher.academicRank),
            }),
          );

          setTeachers(convertedTeachers);
        } else {
          throw new Error(response.message.join(", "));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch teachers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Updated filtering logic
  const filteredTeachers = useMemo(() => {
    if (advancedSearchResults) {
      return advancedSearchResults;
    }
    if (!searchText.trim()) return teachers;

    const searchTerms = searchText.trim().toLowerCase().split(/\s+/);

    return teachers.filter((teacher) => {
      if (searchTerms.length === 1) {
        const term = searchTerms[0];
        return (
          teacher.firstName.toLowerCase().includes(term) ||
          teacher.lastName.toLowerCase().includes(term) ||
          teacher.faculty.toLowerCase().includes(term) ||
          teacher.rank.toLowerCase().includes(term)
        );
      } else {
        return searchTerms.every(
          (term) =>
            teacher.firstName.toLowerCase().includes(term) ||
            teacher.lastName.toLowerCase().includes(term) ||
            teacher.faculty.toLowerCase().includes(term) ||
            teacher.rank.toLowerCase().includes(term),
        );
      }
    });
  }, [searchText, advancedSearchResults, teachers]);

  // Pagination logic
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
  const currentTeachers = filteredTeachers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page whenever search text changes
  };

  // Add useEffect to reset page when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTeachers.length]); // Reset page when number of results changes

  if (showUserInfo && selectedTeacher) {
    return <UserInfo teacher={selectedTeacher} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        خطا در دریافت اطلاعات: {error}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] gap-4">
      {/* Search Section */}
      <div className="mb-4">
        <div className="grid h-full grid-cols-10 gap-6 rounded-[25px] px-2 pt-5">
          {/* Single Search Field */}
          <div className="col-span-6">
            <MyInput
              placeholder="جستجو..."
              value={searchText}
              onChange={handleSearch}
            />
          </div>

          {/* Update the advanced search button */}
          <button
            onClick={() => setIsAdvancedSearchOpen(true)}
            className="col-span-1 flex h-10 w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white px-4 py-4 text-xl text-black shadow-xs ring-1 ring-gray-300 transition-colors duration-300 ring-inset hover:bg-gray-50"
            title="جستجوی پیشرفته"
          >
            <img
              src="./src/assets/images/AdvancedSearch.svg"
              alt="جستجوی پیشرفته"
              className="h-6 w-6"
            />
          </button>

          <button
            onClick={() => setIsPdfPopupOpen(true)}
            className="col-span-1 my-2 mr-20 flex h-10 w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]"
          >
            PDF
          </button>
          <button
            onClick={() => setIsExcelPopupOpen(true)}
            className="col-span-1 my-2 mr-20 flex h-10 w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]"
          >
            Excel
          </button>
        </div>
        <div className="justify-end text-end">
          <button
            onClick={() => setIsTeachersUploadOpen(true)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            آپلود لیست اساتید
          </button>
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-4">
        <div className="col-span-2 content-end pr-20 pb-4 text-start text-black">
          نام استاد
        </div>
        <div className="col-span-1 content-end pb-4 text-center text-black">
          دانشکده
        </div>
        <div className="col-span-1 content-end pb-4 text-center text-black">
          رتبه علمی
        </div>
      </div>

      {/* Teachers List Container */}
      <div className="flex flex-col gap-5 overflow-hidden">
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-5 pb-4">
            {currentTeachers.map((teacher) => (
              <MyTeacherContainer
                key={teacher.id}
                teacher={teacher}
                onClick={onTeacherSelect}
              />
            ))}

            {currentTeachers.length === 0 && (
              <div className="text-center text-gray-500">
                هیچ نتیجه‌ای یافت نشد
              </div>
            )}
          </div>
        </div>

        {/* Fixed Pagination at Bottom */}
        {totalPages > 1 && (
          <div className="flex-shrink-0 py-4">
            <MyPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Popups */}
      <MyPopup
        isOpen={isPdfPopupOpen}
        onClose={() => setIsPdfPopupOpen(false)}
        type="pdf"
        onUpload={handleFileUpload}
      />
      <MyPopup
        isOpen={isExcelPopupOpen}
        onClose={() => setIsExcelPopupOpen(false)}
        type="excel"
        onUpload={handleFileUpload}
      />
      <MyPopup
        isOpen={isTeachersUploadOpen}
        onClose={() => setIsTeachersUploadOpen(false)}
        type="excel"
        onUpload={handleTeachersUpload}
        title="آپلود لیست اساتید"
      />

      {/* Add AdvancedSearch component */}
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearchResults={handleAdvancedSearchResults}
        teachers={teachers}
        searchName={searchName}
        setSearchName={setSearchName}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        selectedDegree={selectedDegree}
        setSelectedDegree={setSelectedDegree}
      />
    </div>
  );
}

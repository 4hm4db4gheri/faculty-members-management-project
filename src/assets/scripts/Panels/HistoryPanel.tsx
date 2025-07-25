import { useState, useMemo, useEffect } from "react";
import MyPagination from "../Elements/MyPagination";
import MyInput from "../Elements/MyInput";
import MyPopup from "../Elements/MyPopup";
import MyTeacherContainer from "../Elements/MyTeacherContainer";
import AdvancedSearch from "../Elements/AdvancedSearch";
import UserInfo from "../Panels/UserInfo";
import type { Teacher } from "../types/Teacher";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { getTeachers, uploadTeachersExcel } from "../Services/apiEndpoints";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import AdvancedSearchIcon from "../../images/AdvancedSearch.svg";

interface HistoryPanelProps {
  onTeacherSelect: (teacher: Teacher) => void;
}

interface Record {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface ApiTeacher {
  id: number;
  firstName: string;
  lastName: string;
  facultyName: string; 
  academicRank: number;
  employmentStatus: number;
  nationalCode: string;
  group: string; 
  tId: string;
  createTime: string;
  gender: number;
  fatherName: string;
  maritalStatus: number;
  birthDate: string;
  nationality: string;
  birthPlace: string;
  birthCertificateNumber: string;
  birthCertificateSerialAndSerie: string;
  birthCertificateIssuingPlace: string;
  firstNameInEnglish: string;
  lastNameInEnglish: string;
  gregorianBirthDate: string;
  groupNameInPersian: string;
  groupNameInEnglish: string;
  personalNumber: string;
  emailAddress: string;
  websiteAddress: string;
  address: string;
  officeNumber: string;
  phoneNumber: string;
  homeTelephoneNumber: string;
  userNumber: string;
  employeeNumber: string;
  employmentEndDate: string;
  lastDegree: string;
  degreeObtainingDate: string;
  degreeObtainingDateGregorian: string;
  universityOfStudy: string;
  studyField: string;
  educationalOrientation: string;
  paye: number;
  academicPromotionDate: string;
  halatOstad: string;
  employmentDate: string;
  insuranceTypeAndNumber: string;
  bankAndAccountNumber: string;
  shebaNumber: string;
  mablaghAkharinHokmEstekhdami: string;
  lastStatus: string;
  lastStatusDate: string;
  isTeaching: boolean;
  facultyOfMission: string;
  lastPromotionDate: string;
  payeType: string;
  bandeAyeenName: string;
  universityEmail: string;
  educationalRecords: Record[] | null;
  industrialRecords: Record[] | null;
  executiveRecords: Record[] | null;
  researchRecords: Record[] | null;
  promotionRecords: Record[] | null;
  statusChangeRecords: Record[] | null;
}

interface ApiResponse {
  data: ApiTeacher[];
  error: boolean;
  message: string[];
}

interface UploadResponse {
  data: string[];
  error: boolean;
  message: string[];
}

export default function HistoryPanel({ onTeacherSelect }: HistoryPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const resetSearchFields = () => {
    setSearchName("");
    setSelectedFaculty("همه");
    setSelectedDegree("همه");
  };

  const handleExportExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = teachers.map((teacher) => ({
        نام: teacher.firstName,
        "نام خانوادگی": teacher.lastName,
        دانشکده: teacher.faculty,
        "رتبه علمی": teacher.rank,
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Adjust column widths
      const columnWidths = [
        { wch: 15 }, // نام
        { wch: 20 }, // نام خانوادگی
        { wch: 25 }, // دانشکده
        { wch: 15 }, // رتبه علمی
      ];
      ws["!cols"] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "لیست اساتید");

      // Save the file
      XLSX.writeFile(
        wb,
        `teachers-list-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      toast.success("فایل Excel با موفقیت دانلود شد");
    } catch (err) {
      toast.error("خطا در ایجاد فایل Excel");
      console.error("Excel Export Error:", err);
    }
  };

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = (await getTeachers()) as ApiResponse;
      if (!response.error) {
        const convertedTeachers: Teacher[] = response.data.map(
          (apiTeacher: ApiTeacher) => ({
            id: apiTeacher.id,
            firstName: apiTeacher.firstName,
            lastName: apiTeacher.lastName,
            faculty: apiTeacher.facultyName,
            rank: getRankString(apiTeacher.academicRank),
            phoneNumber: apiTeacher.phoneNumber || "",
            email: apiTeacher.emailAddress || "",
            group: apiTeacher.group || "",
            lastDegree: apiTeacher.lastDegree || "",
            employmentStatus:
              apiTeacher.employmentStatus === 1 ? "شاغل" : "بازنشسته",
            isTeaching: apiTeacher.isTeaching ?? false,
            nationalCode: apiTeacher.nationalCode || "",
            points: 0,
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

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleTeachersUpload = async (file: File) => {
    setIsLoading(true);

    // Check for valid file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xls",
      ".xlsx",
    ];

    if (
      !validTypes.some(
        (type) => file.name.toLowerCase().endsWith(type) || file.type === type,
      )
    ) {
      toast.error("لطفا فقط فایل اکسل (.xls یا .xlsx) آپلود کنید");
      setIsLoading(false);
      return;
    }

    try {
      const result = (await uploadTeachersExcel(file)) as UploadResponse;

      if (result.error) {
        result.message.forEach((error: string) => {
          toast.warn(error, {
            autoClose: 10000, // Keep error messages visible longer
          });
        });
      } else if (result.data && result.data.length > 0) {
        result.data.forEach((error: string) => {
          toast.warn(error, {
            autoClose: 10000,
          });
        });
      } else {
        toast.success("آپلود با موفقیت انجام شد");
        await fetchTeachers(); // Refresh the teachers list
      }
      // Close the popup immediately after upload attempt
      setIsTeachersUploadOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در آپلود فایل");
    } finally {
      setIsLoading(false);
    }
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

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowUserInfo(true);
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
    return (
      <UserInfo
        teacher={selectedTeacher}
        onBack={() => {
          setShowUserInfo(false);
          setSelectedTeacher(null);
        }}
      />
    );
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
          <div className="col-span-1 content-center">
            <button
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white px-4 py-4 text-xl text-black shadow-xs ring-1 ring-gray-300 transition-colors duration-300 ring-inset hover:bg-gray-50"
              title="جستجوی پیشرفته"
            >
              <img
                src={AdvancedSearchIcon}
                alt="جستجوی پیشرفته"
                className="h-6 w-6"
              />
            </button>
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <button
              onClick={() => setIsTeachersUploadOpen(true)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              آپلود لیست اساتید
            </button>
          </div>
          <div className="col-span-1 content-center">
            <button
              onClick={handleExportExcel}
              className="flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white px-4 py-2 text-xl text-black shadow-xs ring-1 ring-gray-300 transition-colors duration-300 hover:bg-gray-50"
            >
              <span className="flex items-center">
                <span className="mr-2">Excel</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </div>
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
                onClick={handleTeacherSelect}
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

      {/* Upload Teachers Popup */}
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
        onClose={() => {
          setIsAdvancedSearchOpen(false);
          resetSearchFields();
        }}
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

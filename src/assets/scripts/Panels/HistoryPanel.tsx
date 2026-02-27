import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import MyPagination from "../Elements/MyPagination";
import MyInput from "../Elements/MyInput";
import MyPopup from "../Elements/MyPopup";
import MyTeacherContainer from "../Elements/MyTeacherContainer";
import AdvancedSearch from "../Elements/AdvancedSearch";
import UserInfo from "../Panels/UserInfo";
import type { Teacher } from "../types/Teacher";
import LoadingSpinner from "../Elements/LoadingSpinner";
import {
  getTeachers,
  searchTeachers,
  uploadTeachersExcel,
} from "../Services/apiEndpoints";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import AdvancedSearchIcon from "../../images/AdvancedSearch.svg";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";

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

export default function HistoryPanel() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchResults, setSearchResults] = useState<Teacher[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreTeachers, setHasMoreTeachers] = useState(true);
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

  const API_PAGE_SIZE = 50;
  const ITEMS_PER_PAGE = 6;
  const PAGES_PER_API_PAGE = API_PAGE_SIZE / ITEMS_PER_PAGE; // 10
  const PREFETCH_THRESHOLD_PAGES = 2; // when user enters page 9/10, prefetch next 50

  const loadedApiPagesRef = useRef<Set<number>>(new Set());
  const debouncedSearchText = useDebounce(searchText, 500);

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
    } catch {
      toast.error("خطا در آپلود فایل");
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
    navigate(`/dashboard/records/${teacher.id}`);
  };

  // Function to convert academicRank number to string (matching UserInfo.tsx)
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

  const mapApiTeacherToTeacher = useCallback(
    (apiTeacher: ApiTeacher): Teacher => ({
      id: apiTeacher.id,
      firstName: apiTeacher.firstName,
      lastName: apiTeacher.lastName,
      faculty: apiTeacher.facultyName,
      rank: getRankString(apiTeacher.academicRank),
      academicRank: apiTeacher.academicRank,
      phoneNumber: apiTeacher.phoneNumber || "",
      email: apiTeacher.emailAddress || "",
      group: apiTeacher.group || "",
      lastDegree: apiTeacher.lastDegree || "",
      employmentStatus: apiTeacher.employmentStatus === 1 ? "شاغل" : "بازنشسته",
      isTeaching: apiTeacher.isTeaching ?? false,
      nationalCode: apiTeacher.nationalCode || "",
      points: 0,
    }),
    [],
  );

  const fetchTeachersPage = useCallback(
    async (pageNumber: number, mode: "replace" | "append") => {
      const response = (await getTeachers(
        pageNumber,
        API_PAGE_SIZE,
      )) as ApiResponse;
      if (response.error) {
        throw new Error(response.message.join(", "));
      }

      const convertedTeachers: Teacher[] = response.data.map(
        mapApiTeacherToTeacher,
      );
      const reachedEnd = convertedTeachers.length < API_PAGE_SIZE;

      setTeachers((prev) => {
        if (mode === "replace") return convertedTeachers;
        const existingIds = new Set(prev.map((t) => t.id));
        const merged = [...prev];
        for (const t of convertedTeachers) {
          if (!existingIds.has(t.id)) merged.push(t);
        }
        return merged;
      });

      loadedApiPagesRef.current.add(pageNumber);
      if (reachedEnd) setHasMoreTeachers(false);

      return { reachedEnd, received: convertedTeachers.length };
    },
    [API_PAGE_SIZE, mapApiTeacherToTeacher],
  );

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHasMoreTeachers(true);
    loadedApiPagesRef.current = new Set();

    try {
      await fetchTeachersPage(1, "replace");
    } catch (err) {
      setError("خطا در دریافت اطلاعات");
      console.error("Failed to fetch teachers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTeachersPage]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Perform API search when debounced search text changes
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      console.log(`🔍 HistoryPanel: Starting search for: "${searchQuery}"`);

      try {
        const terms = searchQuery.trim().split(/\s+/);
        let response: ApiResponse | null = null;

        if (terms.length === 1) {
          // Single word: try as LastName first
          console.log(`🔍 HistoryPanel: Trying LastName="${terms[0]}"`);
          try {
            const lastNameResponse = (await searchTeachers({
              lastName: terms[0],
              pageSize: 1000,
            })) as ApiResponse;

            console.log(
              `📥 HistoryPanel: LastName response:`,
              lastNameResponse,
            );

            if (!lastNameResponse.error && lastNameResponse.data.length > 0) {
              console.log(
                `✅ HistoryPanel: Found ${lastNameResponse.data.length} results with LastName`,
              );
              response = lastNameResponse;
            }
          } catch (lastNameError) {
            // If LastName search fails (e.g., 400 with "ایتمی وجود ندارد"), continue to FirstName search
            console.log(
              `⚠️ HistoryPanel: LastName search failed, will try FirstName:`,
              lastNameError,
            );
          }

          // If no results with LastName, try FirstName
          if (!response) {
            console.log(
              `🔍 HistoryPanel: No LastName results, trying FirstName="${terms[0]}"`,
            );
            try {
              const firstNameResponse = (await searchTeachers({
                firstName: terms[0],
                pageSize: 1000,
              })) as ApiResponse;

              console.log(
                `📥 HistoryPanel: FirstName response:`,
                firstNameResponse,
              );

              if (
                !firstNameResponse.error &&
                firstNameResponse.data.length > 0
              ) {
                console.log(
                  `✅ HistoryPanel: Found ${firstNameResponse.data.length} results with FirstName`,
                );
                response = firstNameResponse;
              }
            } catch (firstNameError) {
              console.log(
                `⚠️ HistoryPanel: FirstName search also failed:`,
                firstNameError,
              );
            }
          }

          if (!response) {
            console.log(`❌ HistoryPanel: No results found for "${terms[0]}"`);
          }
        } else if (terms.length >= 2) {
          // Two or more words: first is FirstName, second is LastName
          console.log(
            `🔍 HistoryPanel: Trying FirstName="${terms[0]}" + LastName="${terms[1]}"`,
          );
          try {
            response = (await searchTeachers({
              firstName: terms[0],
              lastName: terms[1],
              pageSize: 1000,
            })) as ApiResponse;

            console.log(`📥 HistoryPanel: Combined response:`, response);
          } catch (combinedError) {
            console.log(
              `⚠️ HistoryPanel: Combined search failed:`,
              combinedError,
            );
          }
        }

        if (response && !response.error && response.data.length > 0) {
          const convertedTeachers: Teacher[] = response.data.map(
            mapApiTeacherToTeacher,
          );
          console.log(
            `✅ HistoryPanel: Displaying ${convertedTeachers.length} results`,
          );
          setSearchResults(convertedTeachers);
        } else {
          console.log(`❌ HistoryPanel: No valid results to display`);
          setSearchResults([]);
        }
      } catch (err) {
        console.error("❌ HistoryPanel: Search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [mapApiTeacherToTeacher],
  );

  // Trigger search when debounced text changes
  useEffect(() => {
    if (debouncedSearchText.trim()) {
      void performSearch(debouncedSearchText);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchText, performSearch]);

  // Helper: true if teacher's first or last name starts with or contains the query (prefix/partial match)
  const teacherMatchesSearch = useCallback(
    (teacher: Teacher, query: string) => {
      const q = query.trim();
      if (!q) return false;
      const first = (teacher.firstName || "").trim();
      const last = (teacher.lastName || "").trim();
      return (
        first.startsWith(q) ||
        last.startsWith(q) ||
        first.includes(q) ||
        last.includes(q)
      );
    },
    [],
  );

  // Updated filtering logic: advanced search > API search + client-side prefix match on loaded teachers > base list
  const filteredTeachers = useMemo(() => {
    if (advancedSearchResults) {
      return advancedSearchResults;
    }
    if (searchText.trim()) {
      const q = searchText.trim();
      const fromApi = searchResults;
      const fromClient = teachers.filter((t) => teacherMatchesSearch(t, q));
      const seen = new Set(fromApi.map((t) => t.id));
      const merged = [...fromApi];
      for (const t of fromClient) {
        if (!seen.has(t.id)) {
          seen.add(t.id);
          merged.push(t);
        }
      }
      return merged;
    }
    return teachers;
  }, [
    searchText,
    searchResults,
    advancedSearchResults,
    teachers,
    teacherMatchesSearch,
  ]);

  // Pagination logic
  const loadedTotalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
  const totalPages = useMemo(() => {
    // During filtering/advanced search, only paginate what we currently have.
    if (advancedSearchResults || searchText.trim()) {
      return Math.max(1, loadedTotalPages);
    }

    // For the base list, we don't know the real total. If API might have more,
    // show one extra API-chunk worth of pages so the user can navigate forward.
    const extraPages = hasMoreTeachers ? PAGES_PER_API_PAGE : 0;
    return Math.max(1, loadedTotalPages + extraPages);
  }, [
    advancedSearchResults,
    searchText,
    loadedTotalPages,
    hasMoreTeachers,
    PAGES_PER_API_PAGE,
  ]);

  const currentTeachers = filteredTeachers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page whenever search text changes
    if (value.trim()) {
      setIsSearching(true); // Show loading immediately when user starts typing
    }
  };

  const ensureDataForPage = useCallback(
    async (page: number) => {
      // Don't auto-fetch when advanced search is controlling the list.
      if (advancedSearchResults) return;

      const requiredApiPage = Math.ceil(page / PAGES_PER_API_PAGE);
      const positionInApiPage = ((page - 1) % PAGES_PER_API_PAGE) + 1; // 1..10
      const shouldPrefetchNext =
        positionInApiPage > PAGES_PER_API_PAGE - PREFETCH_THRESHOLD_PAGES; // 9 or 10

      const pagesToFetch: number[] = [];

      if (hasMoreTeachers && !loadedApiPagesRef.current.has(requiredApiPage)) {
        pagesToFetch.push(requiredApiPage);
      }

      if (hasMoreTeachers && shouldPrefetchNext) {
        const nextApiPage = requiredApiPage + 1;
        if (!loadedApiPagesRef.current.has(nextApiPage)) {
          pagesToFetch.push(nextApiPage);
        }
      }

      if (pagesToFetch.length === 0 || isFetchingMore) return;

      setIsFetchingMore(true);
      try {
        for (const p of pagesToFetch) {
          const result = await fetchTeachersPage(p, "append");
          if (result.reachedEnd) break;
        }
      } catch (err) {
        console.error("Failed to fetch more teachers:", err);
        toast.error("خطا در دریافت اطلاعات بیشتر");
      } finally {
        setIsFetchingMore(false);
      }
    },
    [
      advancedSearchResults,
      PAGES_PER_API_PAGE,
      PREFETCH_THRESHOLD_PAGES,
      hasMoreTeachers,
      isFetchingMore,
      fetchTeachersPage,
    ],
  );

  // Reset page only when advanced search results change
  // (searchText already handled in handleSearch)
  const prevAdvancedResultsRef = useRef(advancedSearchResults);

  useEffect(() => {
    if (prevAdvancedResultsRef.current !== advancedSearchResults) {
      setCurrentPage(1);
      prevAdvancedResultsRef.current = advancedSearchResults;
    }
  }, [advancedSearchResults]);

  // Keep current page valid when pagination shrinks (e.g., API returns no more records)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Fetch needed data when user navigates pages (and prefetch near the end of each 50-record chunk)
  useEffect(() => {
    void ensureDataForPage(currentPage);
  }, [currentPage, ensureDataForPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
    <div className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-2 p-1 sm:gap-3 sm:p-2 md:gap-4 md:p-0 lg:grid-rows-[auto_auto_1fr_auto]">
      {/* Search Section - موبایل: flex، دسکتاپ: گرید نسخه اول */}
      <div className="mb-1 sm:mb-2 md:mb-4 lg:mb-4">
        <div className="flex h-full gap-2 rounded-[15px] px-1 pt-2 sm:gap-2 sm:rounded-[20px] sm:px-2 sm:pt-3 md:gap-3 md:rounded-[25px] lg:grid lg:grid-cols-10 lg:gap-6 lg:rounded-[25px] lg:px-2 lg:pt-5">
          <div className="flex-1 lg:col-span-6">
            <div className="relative w-full">
              <MyInput
                placeholder="جستجو..."
                value={searchText}
                onChange={handleSearch}
                className="text-sm sm:text-base"
              />
              {isSearching && searchText.trim() && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-2 sm:pr-4">
                  <LoadingSpinner size="sm" showText={false} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center lg:col-span-1 lg:content-center">
            <button
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="flex h-10 cursor-pointer items-center justify-center rounded-[10px] border-none bg-white px-3 py-2 text-lg text-black shadow-xs ring-1 ring-gray-300 transition-colors duration-300 ring-inset hover:bg-gray-50 sm:h-12 sm:rounded-[15px] sm:px-4 md:rounded-[25px] md:px-5 lg:h-10 lg:w-full lg:rounded-[25px] lg:px-4"
              title="جستجوی پیشرفته"
            >
              <img src={AdvancedSearchIcon} alt="جستجوی پیشرفته" className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* دسکتاپ: دکمه آپلود و Excel در همان ردیف */}
          <div className="hidden items-center justify-center lg:col-span-2 lg:flex">
            <button
              onClick={() => setIsTeachersUploadOpen(true)}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-base text-white hover:bg-blue-600"
            >
              آپلود لیست اساتید
            </button>
          </div>
          <div className="hidden content-center lg:col-span-1 lg:block">
            <button
              onClick={handleExportExcel}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white px-4 py-2 text-lg text-black shadow-xs ring-1 ring-gray-300 transition-colors duration-300 hover:bg-gray-50"
            >
              <span className="flex items-center">
                <span className="mr-2">Excel</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Headers */}
      <div className="hidden grid-cols-4 md:grid">
        <div className="col-span-2 content-end px-2 pb-2 text-start text-xs text-black sm:px-4 sm:pb-3 sm:text-sm md:text-base lg:pr-20 lg:text-lg">
          نام استاد
        </div>
        <div className="col-span-1 content-end pb-2 text-center text-xs text-black sm:pb-3 sm:text-sm md:text-base lg:text-lg">
          دانشکده
        </div>
        <div className="col-span-1 content-end pb-2 text-center text-xs text-black sm:pb-3 sm:text-sm md:text-base lg:text-lg">
          رتبه علمی
        </div>
      </div>

      {/* Teachers List Container */}
      <div className="flex flex-col gap-2 overflow-hidden sm:gap-3 md:gap-5">
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-2 pb-2 sm:gap-3 sm:pb-3 md:gap-5 md:pb-4">
            {currentTeachers.map((teacher) => (
              <MyTeacherContainer
                key={teacher.id}
                teacher={teacher}
                onClick={handleTeacherSelect}
              />
            ))}

            {currentTeachers.length === 0 && (
              <div className="text-center text-gray-500">
                {isFetchingMore &&
                !searchText.trim() &&
                !advancedSearchResults ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="md" />
                  </div>
                ) : (
                  "هیچ نتیجه‌ای یافت نشد"
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Pagination at Bottom */}
        {totalPages > 1 && (
          <div className="flex-shrink-0 pt-4 pb-4">
            <MyPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Action Buttons at Bottom - فقط موبایل/تبلت؛ دسکتاپ (lg+) دکمه‌ها در بالا */}
      <div className="flex gap-2 pb-2 sm:pb-3 lg:hidden">
        <button
          onClick={() => setIsTeachersUploadOpen(true)}
          className="flex-1 rounded-lg bg-blue-500 px-2 py-1 text-[10px] text-white hover:bg-blue-600 sm:px-3 sm:py-1.5 sm:text-xs"
        >
          آپلود اساتید
        </button>
        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 py-1 text-[10px] text-black shadow-sm transition-colors hover:bg-gray-50 sm:px-3 sm:py-1.5 sm:text-xs"
        >
          <span className="mr-1">Excel</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 sm:h-4 sm:w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
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
        }}
        onResetForm={resetSearchFields}
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

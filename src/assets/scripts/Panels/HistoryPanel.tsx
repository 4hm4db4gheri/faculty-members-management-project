import { useState, useMemo, useEffect } from "react";
import MyPagination from "../Elements/MyPagination";
import MyInput from "../Elements/MyInput";
import MyPopup from "../Elements/MyPopup";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  faculty: string;
  rank: string;
}

interface HistoryPanelProps {
  onTeacherSelect: (teacher: Teacher) => void;
}

const initialMockTeachers: Teacher[] = [
  // First 20 teachers with firstName "جواد"
  {
    id: 1,
    firstName: "جواد",
    lastName: "محمدی",
    faculty: "کامپیوتر",
    rank: "استاد",
  },
  {
    id: 2,
    firstName: "جواد",
    lastName: "علوی",
    faculty: "مکانیک",
    rank: "دانشیار",
  },
  {
    id: 3,
    firstName: "جواد",
    lastName: "رضایی",
    faculty: "برق",
    rank: "استادیار",
  },
  {
    id: 4,
    firstName: "جواد",
    lastName: "حسینی",
    faculty: "کامپیوتر",
    rank: "استاد",
  },
  {
    id: 5,
    firstName: "جواد",
    lastName: "مرادی",
    faculty: "عمران",
    rank: "دانشیار",
  },
  {
    id: 6,
    firstName: "جواد",
    lastName: "زارعی",
    faculty: "کامپیوتر",
    rank: "استاد",
  },
  {
    id: 7,
    firstName: "جواد",
    lastName: "امیری",
    faculty: "برق",
    rank: "استادیار",
  },
  {
    id: 8,
    firstName: "جواد",
    lastName: "فتحی",
    faculty: "مکانیک",
    rank: "دانشیار",
  },
  {
    id: 9,
    firstName: "جواد",
    lastName: "سعیدی",
    faculty: "عمران",
    rank: "استاد",
  },
  {
    id: 10,
    firstName: "جواد",
    lastName: "نادری",
    faculty: "کامپیوتر",
    rank: "دانشیار",
  },
  {
    id: 11,
    firstName: "جواد",
    lastName: "کاظمی",
    faculty: "برق",
    rank: "استاد",
  },
  {
    id: 12,
    firstName: "جواد",
    lastName: "لطفی",
    faculty: "مکانیک",
    rank: "استادیار",
  },
  {
    id: 13,
    firstName: "جواد",
    lastName: "حمیدی",
    faculty: "کامپیوتر",
    rank: "دانشیار",
  },
  {
    id: 14,
    firstName: "جواد",
    lastName: "بهرامی",
    faculty: "عمران",
    rank: "استاد",
  },
  {
    id: 15,
    firstName: "جواد",
    lastName: "مجیدی",
    faculty: "برق",
    rank: "استادیار",
  },
  {
    id: 16,
    firstName: "جواد",
    lastName: "سلیمی",
    faculty: "کامپیوتر",
    rank: "دانشیار",
  },
  {
    id: 17,
    firstName: "جواد",
    lastName: "جوادی",
    faculty: "مکانیک",
    rank: "استاد",
  },
  {
    id: 18,
    firstName: "جواد",
    lastName: "نیکخواه",
    faculty: "عمران",
    rank: "استادیار",
  },
  {
    id: 19,
    firstName: "جواد",
    lastName: "الهی",
    faculty: "برق",
    rank: "دانشیار",
  },
  {
    id: 20,
    firstName: "جواد",
    lastName: "رحمانی",
    faculty: "کامپیوتر",
    rank: "استاد",
  },
  // ... rest of the teachers remain unchanged
  {
    id: 21,
    firstName: "کاظم",
    lastName: "کاظمی",
    faculty: "برق",
    rank: "استاد",
  },
  {
    id: 22,
    firstName: "لیلا",
    lastName: "لطفی",
    faculty: "مکانیک",
    rank: "استادیار",
  },
  {
    id: 23,
    firstName: "حمید",
    lastName: "حمیدی",
    faculty: "کامپیوتر",
    rank: "دانشیار",
  },
  {
    id: 24,
    firstName: "بهاره",
    lastName: "بهرامی",
    faculty: "عمران",
    rank: "استاد",
  },
  {
    id: 25,
    firstName: "مجید",
    lastName: "مجیدی",
    faculty: "برق",
    rank: "استادیار",
  },
  {
    id: 26,
    firstName: "سارا",
    lastName: "سلیمی",
    faculty: "کامپیوتر",
    rank: "دانشیار",
  },
  {
    id: 27,
    firstName: "جواد",
    lastName: "جوادی",
    faculty: "مکانیک",
    rank: "استاد",
  },
  {
    id: 28,
    firstName: "نیما",
    lastName: "نیکخواه",
    faculty: "عمران",
    rank: "استادیار",
  },
  {
    id: 29,
    firstName: "الهه",
    lastName: "الهی",
    faculty: "برق",
    rank: "دانشیار",
  },
  {
    id: 30,
    firstName: "رامین",
    lastName: "رحمانی",
    faculty: "کامپیوتر",
    rank: "استاد",
  },
  {
    id: 31,
    firstName: "کاظم",
    lastName: "کاظمی",
    faculty: "برق",
    rank: "استاد",
  },
  {
    id: 32,
    firstName: "لیلا",
    lastName: "لطفی",
    faculty: "مکانیک",
    rank: "استادیار",
  },
  {
    id: 33,
    firstName: "حمید",
    lastName: "حمیدی",
    faculty: "کامپیوتر",
    rank: "دانشیار",
  },
  {
    id: 34,
    firstName: "بهاره",
    lastName: "بهرامی",
    faculty: "عمران",
    rank: "استاد",
  },
  {
    id: 35,
    firstName: "مجید",
    lastName: "مجیدی",
    faculty: "برق",
    rank: "استادیار",
  },
  {
    id: 36,
    firstName: "سارا",
    lastName: "سلیمی",
    faculty: "کامپیوتر",
    rank: "دانشیار",
  },
  {
    id: 37,
    firstName: "جواد",
    lastName: "جوادی",
    faculty: "مکانیک",
    rank: "استاد",
  },
  {
    id: 38,
    firstName: "نیما",
    lastName: "نیکخواه",
    faculty: "عمران",
    rank: "استادیار",
  },
  {
    id: 39,
    firstName: "الهه",
    lastName: "الهی",
    faculty: "برق",
    rank: "دانشیار",
  },
  {
    id: 40,
    firstName: "رامین",
    lastName: "رحمانی",
    faculty: "کامپیوتر",
    rank: "استاد",
  },
];

export default function HistoryPanel({ onTeacherSelect }: HistoryPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isPdfPopupOpen, setIsPdfPopupOpen] = useState(false);
  const [isExcelPopupOpen, setIsExcelPopupOpen] = useState(false);

  const handleFileUpload = (file: File) => {
    // Here you would handle the file upload to backend
    console.log(`File was uploaded: ${file.name}`);
  };

  const handleTeacherClick = (teacher: Teacher) => {
    onTeacherSelect(teacher);
  };

  // Filter teachers based on search criteria
  const filteredTeachers = useMemo(() => {
    if (!searchText) return initialMockTeachers;

    const searchLower = searchText.toLowerCase();
    const results = new Set(); // To track unique records
    const priorityResults: Teacher[] = [];

    // First priority: First name matches
    initialMockTeachers.forEach((teacher) => {
      if (
        teacher.firstName.toLowerCase().startsWith(searchLower) &&
        !results.has(teacher.id)
      ) {
        priorityResults.push(teacher);
        results.add(teacher.id);
      }
    });

    // Second priority: Last name matches
    initialMockTeachers.forEach((teacher) => {
      if (
        teacher.lastName.toLowerCase().startsWith(searchLower) &&
        !results.has(teacher.id)
      ) {
        priorityResults.push(teacher);
        results.add(teacher.id);
      }
    });

    // Third priority: Faculty matches
    initialMockTeachers.forEach((teacher) => {
      if (
        teacher.faculty.toLowerCase().startsWith(searchLower) &&
        !results.has(teacher.id)
      ) {
        priorityResults.push(teacher);
        results.add(teacher.id);
      }
    });

    // Fourth priority: Rank matches
    initialMockTeachers.forEach((teacher) => {
      if (
        teacher.rank.toLowerCase().startsWith(searchLower) &&
        !results.has(teacher.id)
      ) {
        priorityResults.push(teacher);
        results.add(teacher.id);
      }
    });

    // If no exact matches found, try including partial matches
    if (priorityResults.length === 0) {
      initialMockTeachers.forEach((teacher) => {
        if (
          (teacher.firstName.toLowerCase().includes(searchLower) ||
            teacher.lastName.toLowerCase().includes(searchLower) ||
            teacher.faculty.toLowerCase().includes(searchLower) ||
            teacher.rank.toLowerCase().includes(searchLower)) &&
          !results.has(teacher.id)
        ) {
          priorityResults.push(teacher);
          results.add(teacher.id);
        }
      });
    }

    return priorityResults;
  }, [searchText]);

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

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] overflow-hidden">
      {/* Search Section */}
      <div className="mb-4">
        <div className="grid h-full grid-cols-10 gap-6 rounded-[25px] px-2 py-5">
          {/* Single Search Field */}
          <div className="col-span-6">
            <MyInput
              placeholder="جستجو..."
              value={searchText}
              onChange={handleSearch}
            />
          </div>

          {/* Keep existing buttons */}
          <button className="col-span-1 flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
            جستجو پ
          </button>
          <button
            onClick={() => setIsPdfPopupOpen(true)}
            className="col-span-1 my-2 mr-20 flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]"
          >
            PDF
          </button>
          <button
            onClick={() => setIsExcelPopupOpen(true)}
            className="col-span-1 my-2 mr-20 flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]"
          >
            Excel
          </button>
        </div>
      </div>

      {/* Table Headers */}
      <div className="mb-4 grid grid-cols-4">
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
              <button
                key={teacher.id}
                onClick={() => handleTeacherClick(teacher)}
                className="grid h-18 grid-cols-4 rounded-[25px] bg-white text-left transition-colors hover:bg-gray-50"
              >
                <div className="col-span-2 content-center pr-20 text-start text-black">
                  {`${teacher.firstName} ${teacher.lastName}`}
                </div>
                <div className="col-span-1 content-center text-center text-black">
                  {teacher.faculty}
                </div>
                <div className="col-span-1 content-center text-center text-black">
                  {teacher.rank}
                </div>
              </button>
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
    </div>
  );
}

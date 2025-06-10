import React from "react";
import MyInput from "./MyInput";
import MyDropdown from "./MyDropdown";
import type { Teacher } from "../types/Teacher";
import { toast } from "react-toastify"; // Import toast

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (teachers: Teacher[]) => void;
  teachers: Teacher[];
  searchName: string;
  setSearchName: (value: string) => void;
  selectedFaculty: string;
  setSelectedFaculty: (value: string) => void;
  selectedDegree: string;
  setSelectedDegree: (value: string) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  onSearchResults,
  teachers,
  searchName,
  setSearchName,
  selectedFaculty,
  setSelectedFaculty,
  selectedDegree,
  setSelectedDegree,
}) => {
  const facultyOptions = ["کامپیوتر", "برق", "مکانیک", "عمران"] as const;
  const groupOptions = ["گروه ۱", "گروه ۲", "گروه ۳"] as const;
  const statusOptions = ["استاد", "استادیار", "دانشیار"] as const;

  const handleSearch = () => {
    const results = teachers.filter((teacher) => {
      const nameMatch =
        !searchName ||
        teacher.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchName.toLowerCase());

      const facultyMatch =
        selectedFaculty === "همه" || teacher.faculty === selectedFaculty;

      const degreeMatch =
        selectedDegree === "همه" || teacher.rank === selectedDegree;

      return nameMatch && facultyMatch && degreeMatch;
    });

    if (results.length === 0) {
      toast.info("هیچ استادی یافت نشد."); // Replaced alert
    } else {
      onSearchResults(results);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#282828] opacity-50"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 top-1/2 z-50 mx-auto grid w-full max-w-4xl -translate-y-1/2 transform grid-rows-6 rounded-[25px] bg-white p-6 shadow-xl">
        <div className="row-span-1 content-center py-4 text-center text-xl font-bold text-black">
          جست و جو پیشرفته
        </div>
        <div className="row-span-4 content-center px-4 text-center">
          <div className="grid h-full grid-cols-2 gap-12">
            <div className="col-span-1">
              <div className="grid h-full grid-rows-3">
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 items-center gap-2">
                    <div className="col-span-1 content-center text-right text-black">
                      نام یا نام خانوادگی
                    </div>
                    <div className="col-span-2 w-full content-center">
                      <MyInput
                        placeholder="نمونه: علی علوی"
                        className="w-full text-black"
                        value={searchName}
                        onChange={setSearchName}
                      />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 items-center gap-2">
                    <div className="col-span-1 content-center text-right text-black">
                      امتیازات
                    </div>
                    <div className="col-span-2 w-full content-center">
                      <MyInput
                        placeholder="امتیازات"
                        className="w-full text-black"
                      />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 items-center gap-2">
                    <div className="col-span-1 content-center text-right text-black">
                      گروه
                    </div>
                    <div className="col-span-2 w-full content-center">
                      <MyDropdown
                        options={groupOptions}
                        defaultOption="همه" // Use selectedGroup instead of "همه"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="grid h-full grid-rows-3">
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 items-center gap-2">
                    <div className="col-span-1 content-center text-right text-black">
                      کد ملی
                    </div>
                    <div className="col-span-2 w-full content-center">
                      <MyInput
                        placeholder="کد ملی"
                        className="w-full text-black"
                      />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 items-center gap-2">
                    <div className="col-span-1 content-center text-right text-black">
                      دانشکده
                    </div>
                    <div className="col-span-2 w-full content-center">
                      <MyDropdown
                        options={facultyOptions}
                        defaultOption={selectedFaculty} // Now using prop
                        onSelect={setSelectedFaculty} // Now using prop
                      />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 items-center gap-2">
                    <div className="col-span-1 content-center text-right text-black">
                      رتبه علمی
                    </div>
                    <div className="col-span-2 w-full content-center">
                      <MyDropdown
                        options={statusOptions}
                        defaultOption={selectedDegree} // Now using prop
                        onSelect={setSelectedDegree} // Now using prop
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-1 flex items-center justify-center py-4">
          <button
            className="rounded-[25px] bg-[#3388BC] px-12 py-3 text-white transition-colors hover:bg-[#2D769F]"
            onClick={handleSearch}
          >
            جست و جو
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedSearch;

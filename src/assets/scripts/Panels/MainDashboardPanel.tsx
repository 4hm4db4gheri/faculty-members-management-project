import { useState, useEffect, useRef } from "react";
import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";
import MyInput from "../Elements/MyInput";
import UserInfo from "./UserInfo";
import type { Teacher } from "../types/Teacher";
import { initialMockTeachers } from "./HistoryPanel"; // Update import to use named import

export default function MainDashboardPanel() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Teacher[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    const results = initialMockTeachers.filter((teacher) => {
      const searchLower = value.toLowerCase();
      return (
        teacher.firstName.toLowerCase().includes(searchLower) ||
        teacher.lastName.toLowerCase().includes(searchLower)
      );
    }); // Removed the slice(0, 5)

    setSearchResults(results);
    setShowDropdown(true);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDropdown(false);
    setSearchText("");
  };

  if (selectedTeacher) {
    return <UserInfo teacher={selectedTeacher} />;
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
            <ChartComponent1 />
          </div>
        </div>

        <div className="rounded-[25px] bg-white shadow">
          <h2 className="text-center text-2xl font-bold">
            آمار تفکیکی اعضای هیئت علمی
          </h2>
          <div className="h-fit">
            <ChartComponent2 />
          </div>
        </div>
      </div>
      <div className="col-span-1 flex h-full flex-col items-center justify-center rounded-[25px] bg-white pt-[10px]">
        <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[#8D8D8D]">
          Pic
        </div>
        <div className="flex content-center items-center justify-center pt-[30px] text-5xl text-black">
          اسم کاربر
        </div>
        <div className="grid h-[23%] grid-cols-4 gap-[10px] p-5 pt-[125px]">
          <div className="col-span-1 flex h-full items-center justify-center rounded-[25px] bg-red-500">
            نقش
          </div>
          <button className="col-span-3 flex h-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-[#D9D9D9] p-[10px_20px] text-center text-3xl font-bold text-black transition-colors duration-300 hover:bg-[#A6A6A6]">
            مدت زمان
          </button>
        </div>
      </div>
    </div>
  );
}

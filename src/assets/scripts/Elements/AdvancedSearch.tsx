import React from "react";
import MyInput from "./MyInput";
import MyDropdown from "./MyDropdown";
import type { Teacher } from "../types/Teacher";
import { toast } from "react-toastify";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (teachers: Teacher[]) => void;
  onResetForm?: () => void;
  teachers: Teacher[];
  searchName: string;
  setSearchName: (value: string) => void;
  selectedFaculty: string;
  setSelectedFaculty: (value: string) => void;
  selectedDegree: string;
  setSelectedDegree: (value: string) => void;
}

const facultyOptions = [
  "همه",
  "علوم و فناوري زيستي",
  "علوم زمين",
  "علوم رياضي",
  "فيزيك",
  "علوم شيمي و نفت",
  "معماري و شهرسازي",
  "فناوري‌هاي نوين و مهندسي هوا فضا",
  "مهندسي مكانيك و انرژي",
  "انرژي",
  "مهندسي برق (الكترونيك و مخابرات)",
  "مهندسی و علوم کامپیوتر",
  "مهندسي عمران، آب و محيط زيست",
  "مهندسي مواد",
  "مهندسي برق (كنترل و قدرت)",
  "ادبيات و علوم انساني",
  "الهیات و ادیان",
  "حقوق",
  "علوم اقتصادي و سياسي",
  "مديريت و حسابداري",
  "علوم تربيتي و روان‌شناسي",
  "علوم ورزشي و تندرستي",
];

const groupOptions = [
  "همه",
  "معماري كامپيوتر و شبكه",
  "نرم‌افزار و سيستم‌هاي اطلاعاتي",
  "هوش مصنوعي، رباتيك و رايانش شناختي",
  "علوم تربيتي",
  "روان‌شناسي",
  "علم اطلاعات و دانش‌شناسي",
  "مشاوره",
  "فلسفه و كلام اسلامي",
  "اديان و عرفان",
  "حقوق خصوصي",
  "حقوق عمومي",
  "حقوق بين‌الملل",
  "زبان و ادبيات فارسي",
  "زبان و ادبيات انگليسي",
  "زبان و ادبيات عربي",
  "زبان و ادبيات فرانسه",
  "زبان و ادبيات روسي",
  "زبان و ادبيات آلماني",
  "زبان و ادبيات چيني",
  "تاريخ",
  "باستان‌شناسي",
  "علوم اجتماعي",
  "مديريت",
  "حسابداري",
  "اقتصاد",
  "علوم سياسي",
  "شيمي",
  "فيزيك",
  "رياضي",
  "زيست‌شناسي",
  "زمين‌شناسي",
  "تربيت بدني و علوم ورزشي",
  "معماري و شهرسازي",
  "مهندسي عمران، آب و محيط زيست",
  "مهندسي برق (الكترونيك و مخابرات)",
  "مهندسي برق (كنترل و قدرت)",
  "مهندسي مكانيك و انرژي",
  "فناوري‌هاي نوين و مهندسي هوا فضا",
  "مهندسي مواد",
  "انرژي",
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  onSearchResults,
  onResetForm,
  teachers,
  searchName,
  setSearchName,
  selectedFaculty,
  setSelectedFaculty,
  selectedDegree,
  setSelectedDegree,
}) => {
  const [points, setPoints] = React.useState("");
  const [selectedGroup, setSelectedGroup] = React.useState("همه");
  const [nationalCode, setNationalCode] = React.useState("");

  const statusOptions = ["همه", "استاد", "استادیار", "دانشیار"];

  const handleSearch = () => {
    const results = teachers.filter((teacher) => {
      const nameMatch =
        !searchName ||
        teacher.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchName.toLowerCase());

      const facultyMatch =
        selectedFaculty === "همه" ||
        teacher.faculty.toLowerCase().includes(selectedFaculty.toLowerCase());

      const degreeMatch =
        selectedDegree === "همه" || teacher.rank === selectedDegree;

      const groupMatch =
        selectedGroup === "همه" || teacher.group === selectedGroup;

      const nationalCodeMatch =
        !nationalCode || teacher.nationalCode.includes(nationalCode);

      const pointsMatch = !points || teacher.points === parseInt(points);

      return (
        nameMatch &&
        facultyMatch &&
        degreeMatch &&
        groupMatch &&
        nationalCodeMatch &&
        pointsMatch
      );
    });

    if (results.length === 0) {
      toast.info("هیچ استادی یافت نشد.");
    } else {
      onSearchResults(results);
      // Don't reset form values when searching - just close the modal
      onClose();
    }
  };

  const handleClose = (resetForm = true) => {
    if (resetForm) {
      setPoints("");
      setSelectedGroup("همه");
      setNationalCode("");
      // Also reset the parent form fields
      if (onResetForm) {
        onResetForm();
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#282828] opacity-50"
        onClick={() => handleClose()}
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
                        value={points}
                        onChange={setPoints}
                        type="number"
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
                        defaultOption={selectedGroup}
                        onSelect={(selected) => {
                          if (typeof selected === "string") {
                            setSelectedGroup(selected);
                          }
                        }}
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
                        value={nationalCode}
                        onChange={setNationalCode}
                        type="text"
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
                        defaultOption={selectedFaculty}
                        onSelect={(selected) => {
                          if (typeof selected === "string") {
                            setSelectedFaculty(selected);
                          }
                        }}
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
                        defaultOption={selectedDegree}
                        onSelect={(selected) => {
                          if (typeof selected === "string") {
                            setSelectedDegree(selected);
                          }
                        }}
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

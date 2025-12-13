import React, { useEffect, useState } from "react";
import MyInput from "./MyInput";
import MyDropdown from "./MyDropdown";
import type { Teacher } from "../types/Teacher";
import { toast } from "react-toastify";
import { getFaculties, getFacultyGroups } from "../Services/apiEndpoints";
import LoadingSpinner from "../Elements/LoadingSpinner";

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

// Faculty options will be fetched from API

// All available groups (used when "همه" is selected)
const allGroupOptions = [
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
  const [groupOptions, setGroupOptions] = useState<string[]>(allGroupOptions);
  const [facultyOptions, setFacultyOptions] = useState<string[]>(["همه"]);
  const [facultyGroupsCache, setFacultyGroupsCache] = useState<
    Map<string, string[]>
  >(new Map());
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Helper function to get academic rank text (matching UserInfo.tsx)
  const getAcademicRankText = (rank?: number): string => {
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

  const statusOptions = ["همه", "استادیار", "دانشیار", "استاد تمام"];

  // Fetch faculties when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchFaculties = async () => {
      // If faculties are already loaded, skip fetching
      if (facultyOptions.length > 1) {
        return;
      }

      try {
        const response = await getFaculties();
        if (!response.error && response.data) {
          // Add "همه" at the beginning
          setFacultyOptions(["همه", ...response.data]);
        } else {
          toast.error("خطا در دریافت لیست دانشکده‌ها");
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
        toast.error("خطا در دریافت لیست دانشکده‌ها");
      }
    };

    fetchFaculties();
  }, [isOpen, facultyOptions.length]);

  // Pre-fetch all faculty groups when modal opens and faculties are loaded
  useEffect(() => {
    if (!isOpen || facultyOptions.length <= 1) return;

    const fetchAllFacultyGroups = async () => {
      // If cache is already populated, skip fetching
      if (facultyGroupsCache.size > 0) {
        return;
      }

      const cache = new Map<string, string[]>();

      // Fetch groups for all faculties (excluding "همه")
      const facultiesToFetch = facultyOptions.filter(
        (faculty) => faculty !== "همه",
      );

      try {
        // Fetch all faculties in parallel
        const fetchPromises = facultiesToFetch.map(async (faculty) => {
          try {
            const response = await getFacultyGroups(faculty);
            if (!response.error && response.data) {
              cache.set(faculty, response.data);
            }
          } catch (error) {
            console.error(`Error fetching groups for ${faculty}:`, error);
            // Continue with other faculties even if one fails
          }
        });

        await Promise.all(fetchPromises);
        setFacultyGroupsCache(cache);
      } catch (error) {
        console.error("Error fetching faculty groups:", error);
        toast.error("خطا در دریافت گروه‌های دانشکده");
      }
    };

    fetchAllFacultyGroups();
  }, [isOpen, facultyOptions, facultyGroupsCache.size]);

  // Update group options when faculty changes (using cached data)
  useEffect(() => {
    // If "همه" is selected, show all groups
    if (selectedFaculty === "همه") {
      setGroupOptions(allGroupOptions);
      setIsLoadingGroups(false);
      // Reset group selection if it's not in all groups
      setSelectedGroup((prev) => {
        if (prev !== "همه" && !allGroupOptions.includes(prev)) {
          return "همه";
        }
        return prev;
      });
      return;
    }

    // Use cached data if available
    const cachedGroups = facultyGroupsCache.get(selectedFaculty);
    if (cachedGroups !== undefined) {
      // Data is loaded (could be empty array)
      if (cachedGroups.length === 0) {
        // No groups found for this faculty
        setGroupOptions(["گروهی پیدا نشد"]);
      } else {
        const facultyGroups = ["همه", ...cachedGroups];
        setGroupOptions(facultyGroups);
        // Reset group selection if current selection is not in the new list
        setSelectedGroup((prev) => {
          if (!facultyGroups.includes(prev)) {
            return "همه";
          }
          return prev;
        });
      }
      setIsLoadingGroups(false);
    } else {
      // If not in cache yet, show loading state
      setGroupOptions(["در حال بارگذاری..."]);
      setIsLoadingGroups(true);
    }
  }, [selectedFaculty, facultyGroupsCache]);

  // Update group options when cache is populated
  useEffect(() => {
    if (selectedFaculty === "همه" || !isLoadingGroups) {
      return;
    }

    const cachedGroups = facultyGroupsCache.get(selectedFaculty);
    if (cachedGroups !== undefined) {
      // Data is loaded (could be empty array)
      if (cachedGroups.length === 0) {
        // No groups found for this faculty
        setGroupOptions(["گروهی پیدا نشد"]);
      } else {
        const facultyGroups = ["همه", ...cachedGroups];
        setGroupOptions(facultyGroups);
        // Reset group selection if current selection is not in the new list
        setSelectedGroup((prev) => {
          if (!facultyGroups.includes(prev)) {
            return "همه";
          }
          return prev;
        });
      }
      setIsLoadingGroups(false);
    }
  }, [facultyGroupsCache, selectedFaculty, isLoadingGroups]);

  const handleSearch = () => {
    const results = teachers.filter((teacher) => {
      const nameMatch =
        !searchName ||
        teacher.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchName.toLowerCase());

      const facultyMatch =
        selectedFaculty === "همه" ||
        (typeof teacher.faculty === "string" &&
          teacher.faculty
            .toLowerCase()
            .includes(selectedFaculty.toLowerCase())) ||
        (typeof teacher.faculty === "number" &&
          teacher.faculty.toString().includes(selectedFaculty));

      const degreeMatch =
        selectedDegree === "همه" ||
        teacher.rank === selectedDegree ||
        (teacher.academicRank !== undefined &&
          getAcademicRankText(teacher.academicRank) === selectedDegree);

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
      setGroupOptions(allGroupOptions); // Reset to all groups
      // Also reset the parent form fields
      if (onResetForm) {
        onResetForm();
      }
    }
    // Note: We keep the cache even when closing, so it's ready for next time
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
                      <div className="relative w-full">
                        <MyDropdown
                          options={groupOptions}
                          defaultOption={selectedGroup}
                          onSelect={(selected) => {
                            if (
                              typeof selected === "string" &&
                              selected !== "در حال بارگذاری..." &&
                              selected !== "گروهی پیدا نشد"
                            ) {
                              setSelectedGroup(selected);
                            }
                          }}
                          disabledOptions={
                            isLoadingGroups
                              ? ["در حال بارگذاری..."]
                              : groupOptions.includes("گروهی پیدا نشد")
                                ? ["گروهی پیدا نشد"]
                                : []
                          }
                          isLoading={isLoadingGroups}
                        />
                        {isLoadingGroups && (
                          <div className="absolute top-1/2 left-3 -translate-y-1/2">
                            <LoadingSpinner size="sm" showText={false} />
                          </div>
                        )}
                      </div>
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

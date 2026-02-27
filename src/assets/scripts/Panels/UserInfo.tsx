import { useState, useEffect, useRef } from "react";
import Timeline from "./../../components/TimeLineComponent";
import type {
  Teacher,
  IndustrialRecord,
  ExecutiveRecord,
  ResearchRecord,
  PromotionRecord,
  StatusChangeRecord,
  Course,
} from "../types/Teacher";
import { ApiService } from "../Services/ApiService";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { toast } from "react-toastify";
import NotFoundPage from "./NotFoundPage";
import FemaleProfessorAvatar from "../../images/arab-woman-face-covered-with-hijab-muslim-woman-muslim-girl-avatar-avatar-icon-in-flat-style-smiling-girl-in-a-scarf-isolated-illustration-vector.jpg";
import { gregorianToJalali } from "../utils/dateUtils";

interface UserInfoProps {
  teacher: Teacher;
  onBack?: () => void;
}

interface DetailedTeacherResponse {
  data: Teacher;
  error: boolean;
  message: string[];
}

export default function UserInfo({ teacher, onBack }: UserInfoProps) {
  const tabs = [
    "اطلاعات کاربر",
    "سوابق علمی پژوهشی",
    "ارتباط با صنعت",
    "سوابق آموزشی",
    "سوابق اجرایی",
    "سوابق ارتقا و تبدیل وضعیت",
    "تایم لاین",
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [detailedTeacher, setDetailedTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const [tabsOverflow, setTabsOverflow] = useState(false);

  // Fetch detailed teacher data
  useEffect(() => {
    const fetchDetailedTeacher = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.get<DetailedTeacherResponse>(
          `/panel/v1/teacher/read-teacher-by-id/${teacher.id}`,
        );

        if (!response.error) {
          setDetailedTeacher(response.data);
        } else {
          throw new Error(response.message.join(", "));
        }
      } catch {
        setError("خطا در دریافت اطلاعات");
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedTeacher();
  }, [teacher.id]);

  // Detect when tabs overflow so we can show the horizontal scrollbar and reserve space for it
  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;

    const update = () => {
      // epsilon avoids flicker due to sub-pixel layout rounding
      setTabsOverflow(el.scrollWidth > el.clientWidth + 1);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [tabs.length]);

  // Helper function to get faculty name
  const getFacultyName = (
    facultyName?: string,
    facultyNameInPersian?: string,
    facultyNameEnglish?: string,
    facultyOfMission?: string,
    facultyId?: number | string,
  ): string => {
    // First priority: Persian name (when backend adds it)
    if (facultyNameInPersian && typeof facultyNameInPersian === "string") {
      return facultyNameInPersian;
    }

    // Second priority: Faculty of Mission (Persian name from another field)
    if (facultyOfMission && typeof facultyOfMission === "string") {
      return facultyOfMission;
    }

    // Third priority: English name (currently available)
    if (facultyNameEnglish) {
      return facultyNameEnglish;
    }

    // Fourth priority: Generic faculty name
    if (facultyName && typeof facultyName === "string") {
      return facultyName;
    }

    // Fifth priority: If faculty is a string ID, use it
    if (typeof facultyId === "string") {
      return facultyId;
    }

    return "نامشخص";
  };

  // Helper function to detect if text is Persian/Arabic (RTL) or English (LTR)
  const isRTL = (text: string): boolean => {
    // Check if text contains Persian/Arabic characters
    const persianArabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return persianArabicPattern.test(text);
  };

  // Helper function to get gender text
  const getGenderText = (gender?: number): string => {
    switch (gender) {
      case 0:
        return "مرد";
      case 1:
        return "زن";
      default:
        return "نامشخص";
    }
  };

  // Helper function to get marital status text
  const getMaritalStatusText = (status?: number): string => {
    switch (status) {
      case 0:
        return "مجرد";
      case 1:
        return "متاهل";
      default:
        return "نامشخص";
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "نامشخص";
    try {
      // Extract year to determine if it's Jalali or Gregorian
      const yearMatch = dateString.match(/^(\d{4})-/);
      if (!yearMatch) return dateString;

      const year = parseInt(yearMatch[1]);

      // If year is less than 1600, it's already a Jalali date
      if (year < 1600) {
        // Just format the existing Jalali date
        const parts = dateString.split("T")[0].split("-");
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      } else {
        // It's a Gregorian date, convert to Jalali
        return gregorianToJalali(dateString);
      }
    } catch {
      return dateString;
    }
  };

  // Helper function to get academic rank text
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

  // Helper function to get employment status text
  const getEmploymentStatusText = (status?: number | string): string => {
    if (typeof status === "string") return status;
    switch (status) {
      case 0:
        return "رسمی";
      case 1:
        return "پیمانی";
      case 2:
        return "قراردادی";
      default:
        return "نامشخص";
    }
  };

  // Render Industrial Records
  const renderIndustrialRecords = (
    records: IndustrialRecord[] | null | undefined,
    title: string,
  ) => {
    if (!records || records.length === 0) {
      return (
        <div className="space-y-2 sm:space-y-4">
          <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
          <p className="text-sm text-gray-500 sm:text-base">
            هیچ موردی یافت نشد.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
        <ul className="list-inside list-disc space-y-2 text-xs text-gray-700 sm:space-y-3 sm:text-sm md:text-base">
          {records.map((record, index) => (
            <li key={record.id || index}>
              <span className="font-semibold">{record.organizationName}</span> -{" "}
              {formatDate(record.date)}
              {record.description && (
                <p className="mt-1 mr-4 text-sm text-gray-500">
                  {record.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render Executive Records
  const renderExecutiveRecords = (
    records: ExecutiveRecord[] | null | undefined,
    title: string,
  ) => {
    if (!records || records.length === 0) {
      return (
        <div className="space-y-2 sm:space-y-4">
          <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
          <p className="text-sm text-gray-500 sm:text-base">
            هیچ موردی یافت نشد.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
        <ul className="list-inside list-disc space-y-2 text-xs text-gray-700 sm:space-y-3 sm:text-sm md:text-base">
          {records.map((record, index) => (
            <li key={record.id || index}>
              <span className="font-semibold">
                {formatDate(record.startDate)} تا {formatDate(record.endDate)}
              </span>
              {record.description && (
                <p className="mt-1 mr-2 text-xs text-gray-500 sm:mr-4 sm:text-sm">
                  {record.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render Research Records
  const renderResearchRecords = (
    records: ResearchRecord[] | null | undefined,
    title: string,
  ) => {
    if (!records || records.length === 0) {
      return (
        <div className="space-y-2 sm:space-y-4">
          <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
          <p className="text-sm text-gray-500 sm:text-base">
            هیچ موردی یافت نشد.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
        <ol className="space-y-1.5 text-xs text-gray-700 sm:space-y-2 sm:text-sm md:text-base">
          {records.map((record, index) => {
            const textDirection = isRTL(record.reference) ? "rtl" : "ltr";
            const textAlign = textDirection === "rtl" ? "right" : "left";

            return (
              <li
                key={record.id || index}
                className={`list-inside list-decimal rounded-lg px-2 py-1.5 transition-colors duration-200 sm:px-3 sm:py-2 ${
                  record.url ? "cursor-pointer hover:bg-blue-100" : ""
                }`}
                style={{ direction: textDirection, textAlign }}
                onClick={() => {
                  if (record.url) {
                    window.open(record.url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <span className="text-xs text-gray-700 sm:text-sm">
                  {record.reference}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  // Render Promotion Records
  const renderPromotionRecords = (
    records: PromotionRecord[] | null | undefined,
    title: string,
  ) => {
    if (!records || records.length === 0) {
      return (
        <div className="space-y-2 sm:space-y-4">
          <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
          <p className="text-sm text-gray-500 sm:text-base">
            هیچ موردی یافت نشد.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
        <ul className="list-inside list-disc space-y-2 text-xs text-gray-700 sm:space-y-3 sm:text-sm md:text-base">
          {records.map((record, index) => (
            <li key={record.id || index}>
              ارتقا از{" "}
              <span className="font-semibold">
                {getAcademicRankText(record.fromAcademicRank)}
              </span>{" "}
              به{" "}
              <span className="font-semibold">
                {getAcademicRankText(record.toAcademicRank)}
              </span>{" "}
              - {formatDate(record.promotionDate)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render Status Change Records
  const renderStatusChangeRecords = (
    records: StatusChangeRecord[] | null | undefined,
    title: string,
  ) => {
    if (!records || records.length === 0) {
      return (
        <div className="space-y-2 sm:space-y-4">
          <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
          <p className="text-sm text-gray-500 sm:text-base">
            هیچ موردی یافت نشد.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
        <ul className="list-inside list-disc space-y-2 text-xs text-gray-700 sm:space-y-3 sm:text-sm md:text-base">
          {records.map((record, index) => (
            <li key={record.id || index}>
              تغییر از{" "}
              <span className="font-semibold">
                {getEmploymentStatusText(record.fromStatus)}
              </span>{" "}
              به{" "}
              <span className="font-semibold">
                {getEmploymentStatusText(record.toStatus)}
              </span>{" "}
              - {formatDate(record.statusChangeDate)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Helper function to convert day number to Persian day name
  const getDayName = (dayNumber: number): string => {
    const days = [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ];
    return days[dayNumber] || "نامشخص";
  };

  // Render Courses (Educational Records)
  const renderCourses = (
    courses: Course[] | null | undefined,
    title: string,
  ) => {
    if (!courses || courses.length === 0) {
      return (
        <div className="space-y-2 sm:space-y-4">
          <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
          <p className="text-sm text-gray-500 sm:text-base">
            هیچ موردی یافت نشد.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-4">
        <h3 className="text-base font-bold sm:text-lg md:text-xl">{title}</h3>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 md:gap-4">
          {courses.map((course, index) => (
            <div
              key={course.id || index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3 md:p-4"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <h4 className="text-sm font-semibold text-gray-800 sm:text-base md:text-lg">
                  {course.title}
                </h4>
                <div className="space-y-1 text-xs text-gray-600 sm:text-sm">
                  <p>
                    <span className="font-medium">تعداد واحد:</span>{" "}
                    {course.creditHour} واحد
                  </p>
                  {course.activeDays && course.activeDays.length > 0 && (
                    <p>
                      <span className="font-medium">روزهای برگزاری:</span>{" "}
                      {course.activeDays
                        .map((day) => getDayName(day))
                        .join("، ")}
                    </p>
                  )}
                  {course.time && (
                    <p>
                      <span className="font-medium">ساعت:</span>{" "}
                      {new Date(course.time).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">وضعیت:</span>{" "}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs ${
                        course.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Show 404 page if there's an error or no teacher data found
  if (error || (!isLoading && !detailedTeacher)) {
    return <NotFoundPage />;
  }

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (!detailedTeacher) {
      return null;
    }

    switch (activeTab) {
      case "اطلاعات کاربر":
        return (
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6 md:mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base font-bold text-black sm:text-lg md:text-xl">
                  اطلاعات فردی
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    کد پرسنلی: {detailedTeacher.personalNumber || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    کد ملی: {detailedTeacher.nationalCode || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    تاریخ تولد: {formatDate(detailedTeacher.birthDate)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    محل تولد: {detailedTeacher.birthPlace || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    جنسیت: {getGenderText(detailedTeacher.gender)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    وضعیت تاهل:{" "}
                    {getMaritalStatusText(detailedTeacher.maritalStatus)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    نام پدر: {detailedTeacher.fatherName || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    ملیت: {detailedTeacher.nationality || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    مذهب: {detailedTeacher.religion || "نامشخص"}
                  </p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base font-bold text-black sm:text-lg md:text-xl">
                  اطلاعات تماس
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    تلفن: {detailedTeacher.phoneNumber || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    تلفن منزل: {detailedTeacher.homeTelephoneNumber || "نامشخص"}
                  </p>
                  <p className="text-xs break-words text-gray-700 sm:text-sm md:text-base">
                    ایمیل:{" "}
                    {detailedTeacher.emailAddress ||
                      detailedTeacher.email ||
                      "نامشخص"}
                  </p>
                  <p className="text-xs break-words text-gray-700 sm:text-sm md:text-base">
                    ایمیل دانشگاهی:{" "}
                    {detailedTeacher.universityEmail || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    دفتر: {detailedTeacher.officeNumber || "نامشخص"}
                  </p>
                  <p className="text-xs break-words text-gray-700 sm:text-sm md:text-base">
                    آدرس: {detailedTeacher.address || "نامشخص"}
                  </p>
                  <p className="text-xs break-words text-gray-700 sm:text-sm md:text-base">
                    وب‌سایت: {detailedTeacher.websiteAddress || "نامشخص"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base font-bold text-black sm:text-lg md:text-xl">
                اطلاعات شغلی
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8">
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    وضعیت اشتغال:{" "}
                    {getEmploymentStatusText(detailedTeacher.employmentStatus)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    تاریخ استخدام: {formatDate(detailedTeacher.employmentDate)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    تاریخ پایان خدمت:{" "}
                    {formatDate(detailedTeacher.employmentEndDate)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    رتبه علمی:{" "}
                    {getAcademicRankText(detailedTeacher.academicRank)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    آخرین مدرک: {detailedTeacher.lastDegree || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    رشته تحصیلی: {detailedTeacher.studyField || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    گرایش تحصیلی:{" "}
                    {detailedTeacher.educationalOrientation || "نامشخص"}
                  </p>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    دانشگاه محل تحصیل:{" "}
                    {detailedTeacher.universityOfStudy || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    تاریخ اخذ مدرک:{" "}
                    {formatDate(detailedTeacher.degreeObtainingDate)}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    پایه: {detailedTeacher.paye || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    نوع پایه: {detailedTeacher.payeType || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    حالت استاد: {detailedTeacher.halatOstad || "نامشخص"}
                  </p>
                  <p className="text-xs text-gray-700 sm:text-sm md:text-base">
                    آخرین وضعیت: {detailedTeacher.lastStatus || "نامشخص"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "سوابق علمی پژوهشی":
        return (
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6 md:mt-8">
            {renderResearchRecords(
              detailedTeacher.researchRecords,
              "مقالات و پژوهش‌ها",
            )}
          </div>
        );

      case "ارتباط با صنعت":
        return (
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6 md:mt-8">
            {renderIndustrialRecords(
              detailedTeacher.industrialRecords,
              "پروژه های صنعتی",
            )}
          </div>
        );

      case "سوابق آموزشی":
        return (
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6 md:mt-8">
            {renderCourses(detailedTeacher.courses, "دروس تدریس شده")}
          </div>
        );

      case "سوابق اجرایی":
        return (
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6 md:mt-8">
            {renderExecutiveRecords(
              detailedTeacher.executiveRecords,
              "سوابق اجرایی",
            )}
          </div>
        );

      case "سوابق ارتقا و تبدیل وضعیت":
        return (
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6 md:mt-8">
            {renderPromotionRecords(
              detailedTeacher.promotionRecords,
              "سوابق ارتقا",
            )}
            {renderStatusChangeRecords(
              detailedTeacher.statusChangeRecords,
              "تغییرات وضعیت",
            )}
          </div>
        );

      case "تایم لاین":
        return (
          <div className="min-h-screen">
            <Timeline teacherId={teacher.id} />
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{activeTab}</h3>
            <p>محتوای این بخش در حال تکمیل است.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* دسکتاپ: دکمه بازگشت مطلق */}
      {onBack && (
        <div className="absolute top-2 left-2 z-50 m-2 hidden sm:top-4 sm:left-4 sm:m-4 lg:block lg:m-10">
          <button
            onClick={onBack}
            className="rounded-xl bg-white px-2 py-1 text-xs text-gray-700 shadow-lg hover:bg-gray-50 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm"
          >
            بازگشت
          </button>
        </div>
      )}

      {/* موبایل: فقط دکمه بازگشت سمت چپ (تب‌ها زیر نام و عکس داخل باکس سفید) */}
      {onBack && (
        <div className="relative z-10 flex w-full justify-start pt-1 pr-2 sm:pt-2 sm:pr-3 lg:hidden">
          <button
            onClick={onBack}
            className="rounded-xl bg-white px-2 py-1 text-xs text-gray-700 shadow-lg hover:bg-gray-50 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm"
          >
            بازگشت
          </button>
        </div>
      )}

      {/* دسکتاپ: عکس پروفایل بالای صفحه (همان نسخه اول) */}
      <div className="hidden h-[220px] items-start px-4 lg:flex">
        <div className="relative z-30 mt-6 h-[220px] w-[150px] overflow-hidden rounded-2xl shadow-lg">
          <img
            src={
              detailedTeacher?.gender === 1
                ? FemaleProfessorAvatar
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="تصویر استاد"
            className="h-full w-full scale-120 object-cover object-center"
            style={{ objectPosition: "top center" }}
            onError={(e) => {
              e.currentTarget.src =
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            }}
          />
        </div>
      </div>

      {/* استایل اسکرول تب‌ها */}
      <style>
        {`
          .tabs-horizontal-scroll {
            scrollbar-width: thin;
            scrollbar-color: #9CA3AF transparent;
          }
          .tabs-horizontal-scroll::-webkit-scrollbar {
            height: 6px !important;
            display: block !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
          .tabs-horizontal-scroll::-webkit-scrollbar-track {
            background: transparent !important;
            border-radius: 3px;
            margin: 0 2px;
          }
          .tabs-horizontal-scroll::-webkit-scrollbar-thumb {
            background: #9CA3AF !important;
            border-radius: 3px;
            min-width: 20px;
          }
          .tabs-horizontal-scroll::-webkit-scrollbar-thumb:hover {
            background: #6B7280 !important;
          }
          .tabs-horizontal-scroll::-webkit-scrollbar-thumb:active {
            background: #4B5563 !important;
          }
        `}
      </style>

      {/* White container */}
      <div className="relative z-20 flex flex-1 flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-t-3xl lg:-mt-36">
        {/* دسکتاپ: نام و رتبه بالای تب‌ها */}
        <div className="mr-36 hidden border-b border-gray-100 pt-2 lg:block lg:pr-5 lg:pb-2">
          <p className="text-lg text-gray-600">
            {detailedTeacher?.academicRank !== undefined
              ? getAcademicRankText(detailedTeacher.academicRank)
              : teacher.rank || "نامشخص"}
          </p>
          <h1 className="text-2xl font-bold text-black">{`${detailedTeacher?.firstName || teacher.firstName} ${detailedTeacher?.lastName || teacher.lastName}`}</h1>
          <p className="pt-2 text-gray-600">
            دانشکده{" "}
            {getFacultyName(
              detailedTeacher?.facultyName,
              detailedTeacher?.facultyNameInPersian,
              detailedTeacher?.facultyNameInEnglish,
              detailedTeacher?.facultyOfMission,
              teacher.faculty,
            )}
          </p>
        </div>

        {/* موبایل: عکس + نام در یک ردیف */}
        <div className="flex items-start gap-4 border-b border-gray-200 p-4 sm:gap-6 sm:p-6 md:gap-8 md:p-8 lg:hidden">
          <div className="flex-shrink-0">
            <div className="relative h-[100px] w-[70px] overflow-hidden rounded-xl shadow-lg sm:h-[140px] sm:w-[100px] sm:rounded-2xl md:h-[180px] md:w-[130px]">
              <img
                src={
                  detailedTeacher?.gender === 1
                    ? FemaleProfessorAvatar
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="تصویر استاد"
                className="h-full w-full scale-120 object-cover object-center"
                style={{ objectPosition: "top center" }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 text-right sm:gap-2">
            <p className="text-xs text-gray-600 sm:text-sm md:text-base">
              {detailedTeacher?.academicRank !== undefined
                ? getAcademicRankText(detailedTeacher.academicRank)
                : teacher.rank || "نامشخص"}
            </p>
            <h1 className="text-base font-bold text-black sm:text-lg md:text-xl">
              {`${detailedTeacher?.firstName || teacher.firstName} ${detailedTeacher?.lastName || teacher.lastName}`}
            </h1>
            <p className="text-xs text-gray-600 sm:text-sm md:text-base">
              دانشکده{" "}
              {getFacultyName(
                detailedTeacher?.facultyName,
                detailedTeacher?.facultyNameInPersian,
                detailedTeacher?.facultyNameInEnglish,
                detailedTeacher?.facultyOfMission,
                teacher.faculty,
              )}
            </p>
          </div>
        </div>

        {/* تب‌ها — زیر نام و عکس، بالای محتوا (موبایل و دسکتاپ) */}
        <div className="relative z-10 w-full border-b border-gray-100">
          <div
            ref={tabsScrollRef}
            className={`tabs-horizontal-scroll overflow-x-auto overflow-y-hidden px-2 pt-2 lg:px-0 lg:pt-2 ${tabsOverflow ? "pb-2" : "pb-2"}`}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#9CA3AF transparent",
            }}
          >
            <div
              className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3"
              style={{ minWidth: "max-content" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`flex-shrink-0 whitespace-nowrap rounded-lg px-1.5 py-1 text-[9px] outline-none transition-all sm:rounded-xl sm:px-2 sm:py-1 sm:text-[10px] md:py-1.5 md:text-xs lg:origin-bottom lg:rounded-2xl lg:px-2 lg:py-3 lg:text-sm ${
                    activeTab === tab
                      ? "bg-white font-semibold text-black shadow-md sm:px-2.5 lg:scale-110 lg:px-4 lg:font-bold lg:shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* بخش محتوا — فقط اطلاعات مربوط به هر تب */}
        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 relative z-20 w-full flex-1 overflow-y-auto rounded-2xl bg-white p-3 sm:p-4 md:p-6 lg:rounded-2xl lg:p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

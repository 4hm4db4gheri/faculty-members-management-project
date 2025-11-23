import { useState, useEffect } from "react";
import Timeline from "./../../components/TimeLineComponent";
import type {
  Teacher,
  IndustrialRecord,
  ExecutiveRecord,
  ResearchRecord,
  PromotionRecord,
  StatusChangeRecord,
  EducationalRecord,
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

  // Helper function to get faculty name
  const getFacultyName = (
    facultyName?: string,
    facultyNameInPersian?: string,
    facultyNameEnglish?: string,
    facultyId?: number | string,
  ): string => {
    // First priority: Persian name (when backend adds it)
    if (facultyNameInPersian && typeof facultyNameInPersian === "string") {
      return facultyNameInPersian;
    }

    // Second priority: English name (currently available)
    if (facultyNameEnglish) {
      return facultyNameEnglish;
    }

    // Third priority: Generic faculty name
    if (facultyName && typeof facultyName === "string") {
      return facultyName;
    }

    // Fourth priority: If faculty is a string ID, use it
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
        return "مربی";
      case 1:
        return "استادیار";
      case 2:
        return "دانشیار";
      case 3:
        return "استاد";
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">هیچ موردی یافت نشد.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <ul className="list-inside list-disc space-y-3 text-gray-700">
          {records.map((record, index) => (
            <li key={record.id || index}>
              <span className="font-semibold">{record.organizationName}</span> -{" "}
              {formatDate(record.date)}
              {record.description && (
                <p className="mr-4 mt-1 text-sm text-gray-500">
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">هیچ موردی یافت نشد.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <ul className="list-inside list-disc space-y-3 text-gray-700">
          {records.map((record, index) => (
            <li key={record.id || index}>
              <span className="font-semibold">
                {formatDate(record.startDate)} تا {formatDate(record.endDate)}
              </span>
              {record.description && (
                <p className="mr-4 mt-1 text-sm text-gray-500">
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">هیچ موردی یافت نشد.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <ol className="space-y-2 text-gray-700">
          {records.map((record, index) => {
            const textDirection = isRTL(record.reference) ? "rtl" : "ltr";
            const textAlign = textDirection === "rtl" ? "right" : "left";

            return (
              <li
                key={record.id || index}
                className={`list-decimal list-inside px-3 py-2 rounded-lg transition-colors duration-200 ${
                  record.url ? "hover:bg-blue-100 cursor-pointer" : ""
                }`}
                style={{ direction: textDirection, textAlign }}
                onClick={() => {
                  if (record.url) {
                    window.open(record.url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <span className="text-sm text-gray-700">
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">هیچ موردی یافت نشد.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <ul className="list-inside list-disc space-y-3 text-gray-700">
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">هیچ موردی یافت نشد.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <ul className="list-inside list-disc space-y-3 text-gray-700">
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

  // Render Educational Records
  const renderEducationalRecords = (
    records: EducationalRecord[] | null | undefined,
    title: string,
  ) => {
    if (!records || records.length === 0) {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">هیچ موردی یافت نشد.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <ul className="list-inside list-disc space-y-3 text-gray-700">
          {records.map((record, index) => (
            <li key={record.id || index}>
              <span className="font-semibold">{record.title}</span> -{" "}
              {formatDate(record.date)}
              {record.description && (
                <p className="mr-4 mt-1 text-sm text-gray-500">
                  {record.description}
                </p>
              )}
            </li>
          ))}
        </ul>
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
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">اطلاعات فردی</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    کد پرسنلی: {detailedTeacher.personalNumber || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    کد ملی: {detailedTeacher.nationalCode || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    تاریخ تولد: {formatDate(detailedTeacher.birthDate)}
                  </p>
                  <p className="text-gray-700">
                    محل تولد: {detailedTeacher.birthPlace || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    جنسیت: {getGenderText(detailedTeacher.gender)}
                  </p>
                  <p className="text-gray-700">
                    وضعیت تاهل:{" "}
                    {getMaritalStatusText(detailedTeacher.maritalStatus)}
                  </p>
                  <p className="text-gray-700">
                    نام پدر: {detailedTeacher.fatherName || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    ملیت: {detailedTeacher.nationality || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    مذهب: {detailedTeacher.religion || "نامشخص"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">اطلاعات تماس</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    تلفن: {detailedTeacher.phoneNumber || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    تلفن منزل: {detailedTeacher.homeTelephoneNumber || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    ایمیل:{" "}
                    {detailedTeacher.emailAddress ||
                      detailedTeacher.email ||
                      "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    ایمیل دانشگاهی:{" "}
                    {detailedTeacher.universityEmail || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    دفتر: {detailedTeacher.officeNumber || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    آدرس: {detailedTeacher.address || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    وب‌سایت: {detailedTeacher.websiteAddress || "نامشخص"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-black">اطلاعات شغلی</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    وضعیت اشتغال:{" "}
                    {getEmploymentStatusText(detailedTeacher.employmentStatus)}
                  </p>
                  <p className="text-gray-700">
                    تاریخ استخدام: {formatDate(detailedTeacher.employmentDate)}
                  </p>
                  <p className="text-gray-700">
                    تاریخ پایان خدمت:{" "}
                    {formatDate(detailedTeacher.employmentEndDate)}
                  </p>
                  <p className="text-gray-700">
                    رتبه علمی:{" "}
                    {getAcademicRankText(detailedTeacher.academicRank)}
                  </p>
                  <p className="text-gray-700">
                    آخرین مدرک: {detailedTeacher.lastDegree || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    رشته تحصیلی: {detailedTeacher.studyField || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    گرایش تحصیلی:{" "}
                    {detailedTeacher.educationalOrientation || "نامشخص"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    دانشگاه محل تحصیل:{" "}
                    {detailedTeacher.universityOfStudy || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    تاریخ اخذ مدرک:{" "}
                    {formatDate(detailedTeacher.degreeObtainingDate)}
                  </p>
                  <p className="text-gray-700">
                    پایه: {detailedTeacher.paye || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    نوع پایه: {detailedTeacher.payeType || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    حالت استاد: {detailedTeacher.halatOstad || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    آخرین وضعیت: {detailedTeacher.lastStatus || "نامشخص"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "سوابق علمی پژوهشی":
        return (
          <div className="mt-8 space-y-6">
            {renderResearchRecords(
              detailedTeacher.researchRecords,
              "مقالات و پژوهش‌ها",
            )}
          </div>
        );

      case "ارتباط با صنعت":
        return (
          <div className="mt-8 space-y-6">
            {renderIndustrialRecords(
              detailedTeacher.industrialRecords,
              "پروژه های صنعتی",
            )}
          </div>
        );

      case "سوابق آموزشی":
        return (
          <div className="mt-8 space-y-6">
            {renderEducationalRecords(
              detailedTeacher.educationalRecords,
              "سوابق آموزشی",
            )}
          </div>
        );

      case "سوابق اجرایی":
        return (
          <div className="mt-8 space-y-6">
            {renderExecutiveRecords(
              detailedTeacher.executiveRecords,
              "سوابق اجرایی",
            )}
          </div>
        );

      case "سوابق ارتقا و تبدیل وضعیت":
        return (
          <div className="mt-8 space-y-6">
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
            <Timeline />
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
      {/* Back button */}
      {onBack && (
        <div className="absolute top-4 left-4 z-50 m-10">
          <button
            onClick={onBack}
            className="rounded-2xl bg-white px-4 py-2 text-gray-700 shadow-lg hover:bg-gray-50"
          >
            بازگشت
          </button>
        </div>
      )}

      {/* Profile photo section */}
      <div className="flex h-[220px] items-start px-4">
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
              // Fallback to default avatar if image fails to load
              e.currentTarget.src =
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            }}
          />
        </div>
      </div>

      {/* Content wrapper with tabs and white container */}
      <div className="relative -mt-36 flex-1 flex flex-col overflow-hidden">
        <div className="relative z-10 flex items-center gap-3 pr-46 pb-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`rounded-2xl px-2 py-3 text-sm whitespace-nowrap transition-all outline-none ${
                activeTab === tab
                  ? "scale-110 bg-white px-4 font-bold text-black shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative z-20 -mt-4 w-full flex-1 rounded-2xl bg-white p-8 overflow-y-auto">
          <div className="mr-36">
            <p className="pr-5 text-lg text-gray-600">
              {detailedTeacher?.academicRank !== undefined
                ? getAcademicRankText(detailedTeacher.academicRank)
                : teacher.rank || "نامشخص"}
            </p>
            <h1 className="pr-5 text-2xl font-bold text-black">{`${detailedTeacher?.firstName || teacher.firstName} ${detailedTeacher?.lastName || teacher.lastName}`}</h1>
            <p className="pt-2 pr-5 text-gray-600">
              دانشکده{" "}
              {getFacultyName(
                detailedTeacher?.facultyName,
                detailedTeacher?.facultyNameInPersian,
                detailedTeacher?.facultyNameInEnglish,
                teacher.faculty,
              )}
            </p>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Timeline from "./../../components/TimeLineComponent";
import type { Teacher, Record } from "../types/Teacher";
import { ApiService } from "../Services/ApiService";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { toast } from "react-toastify";
import FemaleProfessorAvatar from "../../images/arab-woman-face-covered-with-hijab-muslim-woman-muslim-girl-avatar-avatar-icon-in-flat-style-smiling-girl-in-a-scarf-isolated-illustration-vector.jpg";

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
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "خطا در دریافت اطلاعات";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedTeacher();
  }, [teacher.id]);

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
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR");
    } catch {
      return dateString;
    }
  };

  // Helper function to render records list
  const renderRecordsList = (
    records: Record[] | null | undefined,
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
        <ul className="list-inside list-disc space-y-2 text-gray-700">
          {records.map((record) => (
            <li key={record.id}>
              {record.title} - {formatDate(record.date)}
              {record.description && (
                <p className="mr-4 text-sm text-gray-500">
                  {record.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full items-center justify-center text-red-500">
          خطا در دریافت اطلاعات: {error}
        </div>
      );
    }

    if (!detailedTeacher) {
      return (
        <div className="flex h-full items-center justify-center text-gray-500">
          اطلاعات استاد یافت نشد
        </div>
      );
    }

    switch (activeTab) {
      case "اطلاعات کاربر":
        return (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">اطلاعات فردی</h3>
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
                <h3 className="text-xl font-bold">اطلاعات تماس</h3>
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
              <h3 className="text-xl font-bold">اطلاعات شغلی</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    وضعیت اشتغال: {detailedTeacher.employmentStatus || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    تاریخ استخدام: {formatDate(detailedTeacher.employmentDate)}
                  </p>
                  <p className="text-gray-700">
                    تاریخ پایان خدمت:{" "}
                    {formatDate(detailedTeacher.employmentEndDate)}
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
            {renderRecordsList(
              detailedTeacher.researchRecords,
              "مقالات و پژوهش‌ها",
            )}
          </div>
        );

      case "ارتباط با صنعت":
        return (
          <div className="mt-8 space-y-6">
            {renderRecordsList(
              detailedTeacher.industrialRecords,
              "پروژه های صنعتی",
            )}
          </div>
        );

      case "سوابق آموزشی":
        return (
          <div className="mt-8 space-y-6">
            {renderRecordsList(
              detailedTeacher.educationalRecords,
              "سوابق آموزشی",
            )}
          </div>
        );

      case "سوابق اجرایی":
        return (
          <div className="mt-8 space-y-6">
            {renderRecordsList(
              detailedTeacher.executiveRecords,
              "سوابق اجرایی",
            )}
          </div>
        );

      case "سوابق ارتقا و تبدیل وضعیت":
        return (
          <div className="mt-8 space-y-6">
            {renderRecordsList(detailedTeacher.promotionRecords, "سوابق ارتقا")}
            {renderRecordsList(
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
      <div className="relative -mt-36 flex-1">
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

        <div className="relative z-20 -mt-4 h-full w-full flex-1 rounded-2xl bg-white p-8">
          <div className="mr-36">
            <h1 className="pr-5 text-2xl font-bold text-black">
              {teacher.rank}
            </h1>
            <h2 className="pt-1 pr-5 text-3xl font-bold text-black">{`${teacher.firstName} ${teacher.lastName}`}</h2>
            <p className="pt-2 pr-5 text-gray-600">دانشکده {teacher.faculty}</p>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

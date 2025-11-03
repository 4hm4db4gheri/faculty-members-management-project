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

// Helper function to convert academicRank number to string
const getRankString = (rank?: number | string): string => {
  if (typeof rank === "string" && rank) return rank;
  if (typeof rank === "number") {
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
  }
  return "نامشخص";
};

export default function UserInfo({ teacher, onBack }: UserInfoProps) {
  const tabs = [
    "اطلاعات کاربر",
    "سوابق پژوهشی",
    "سوابق آموزشی",
    "ارتباط با صنعت",
    "سوابق اجرایی",
    "سوابق ارتقا و تبدیل وضعیت",
    "تایم لاین",
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [detailedTeacher, setDetailedTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facultyDisplay, setFacultyDisplay] = useState<string | null>(null);

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

  // Helper to format faculty display: prefer readable strings, handle objects,
  // and fall back to numeric IDs if no readable name is found.
  const formatFacultyDisplay = (...vals: Array<any>): string => {
    let numericCandidate: string | undefined;

    for (const v of vals) {
      if (v === undefined || v === null) continue;

      // If faculty comes as an object, try common name keys
      if (typeof v === "object") {
        const name =
          (v as any).name ||
          (v as any).title ||
          (v as any).facultyName ||
          (v as any).label;
        if (typeof name === "string") {
          const s = name.trim();
          if (!s) continue;
          if (isNaN(Number(s))) return s; // readable string
          if (!numericCandidate) numericCandidate = s; // remember numeric as fallback
        }
        continue;
      }

      // Coerce to string for numbers/strings
      const s = String(v).trim();
      if (!s) continue;
      if (isNaN(Number(s))) return s; // readable string
      if (!numericCandidate) numericCandidate = s; // numeric fallback
    }

    return numericCandidate ?? "نامشخص";
  };

  // Try to resolve numeric faculty IDs to readable names using backend data.
  const resolveFacultyName = async (val: any): Promise<string> => {
    if (val === undefined || val === null) return "نامشخص";

    // If it's an object, try to extract a name
    if (typeof val === "object") {
      const name =
        (val as any).name ||
        (val as any).title ||
        (val as any).facultyName ||
        (val as any).label;
      if (name && typeof name === "string") return name.trim() || "نامشخص";
      return "نامشخص";
    }

    const s = String(val).trim();
    if (!s) return "نامشخص";

    // If it's already a non-numeric string, return it
    if (isNaN(Number(s))) return s;

    // It's numeric (or numeric string): try to lookup via backend faculties list first
    try {
      const facResp: any = await ApiService.get("/panel/v1/teacher/faculties");
      if (facResp && !facResp.error && Array.isArray(facResp.data)) {
        const facList = facResp.data as string[];
        const idx = Number(s);
        // try direct index and index-1 (API indexing unknown)
        if (!Number.isNaN(idx)) {
          if (facList[idx]) return facList[idx];
          if (facList[idx - 1]) return facList[idx - 1];
        }
      }

      // Fallback: try to infer from teachers list (older heuristic)
      const resp: any = await ApiService.get(
        "/panel/v1/teacher/read-teachers?PageNumber=1&PageSize=1000",
      );
      if (!resp || resp.error) return `دانشکده #${s}`;

      const list = resp.data as any[] | undefined;
      if (Array.isArray(list)) {
        // Try to find a teacher entry that references this faculty id and extract a faculty name
        for (const item of list) {
          // direct faculty id fields
          if (
            item.faculty === s ||
            item.faculty === Number(s) ||
            item.facultyId === s ||
            item.facultyId === Number(s)
          ) {
            if (item.facultyName) return item.facultyName;
            if (item.facultyNameInPersian) return item.facultyNameInPersian;
          }

          // Search any field that equals the id and return a nearby facultyName if present
          for (const k of Object.keys(item)) {
            try {
              if (String(item[k]) === s) {
                if (item.facultyName) return item.facultyName;
                if (item.facultyNameInPersian) return item.facultyNameInPersian;
              }
            } catch {
              // ignore
            }
          }
        }
      }

      // If not found, as a sensible fallback return an ID-based label
      return `دانشکده #${s}`;
    } catch (err) {
      console.error("Error resolving faculty name:", err);
      return `دانشکده #${s}`;
    }
  };

  // Keep a resolved facultyDisplay in state so we can await backend lookup if needed
  useEffect(() => {
    let mounted = true;

    const compute = async () => {
      // Prefer detailed and teacher explicit names
      if (detailedTeacher?.facultyName) {
        if (mounted) setFacultyDisplay(detailedTeacher.facultyName);
        return;
      }
      if ((teacher as any).facultyName) {
        if (mounted) setFacultyDisplay((teacher as any).facultyName);
        return;
      }

      const candidate = detailedTeacher?.faculty ?? teacher.faculty;
      const resolved = await resolveFacultyName(candidate);
      if (mounted) setFacultyDisplay(resolved);
    };

    compute();

    return () => {
      mounted = false;
    };
  }, [detailedTeacher, teacher]);

  // Helper function to render records list
  const renderRecordsList = (
    records: Record[] | null | undefined,
    title: string,
  ) => {
    if (!records || !Array.isArray(records) || records.length === 0) {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500">هیچ موردی یافت نشد.</p>
        </div>
      );
    }

    const sorted = [...records].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {sorted.length} مورد
          </span>
        </div>
        <ul className="space-y-3 text-gray-700">
          {sorted.map((record) => (
            <li
              key={record.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3 hover:bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{record.title}</span>
                <span className="text-xs text-gray-500">
                  {formatDate(record.date)}
                </span>
              </div>
              {record.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {record.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Fetch detailed teacher data
  useEffect(() => {
    const fetchDetailedTeacher = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.get<DetailedTeacherResponse>(
          `/panel/v1/teacher/read-teacher-by-id/${teacher.id}`,
        );

        if (!response.error) {
          const teacherData = response.data;

          // If educationalRecords doesn't exist but courses does, use courses
          if (!teacherData.educationalRecords && (teacherData as any).courses) {
            teacherData.educationalRecords = (teacherData as any).courses;
          }

          // Convert academicRank to rank if needed
          if (
            (teacherData as any).academicRank !== undefined &&
            !teacherData.rank
          ) {
            teacherData.rank = getRankString((teacherData as any).academicRank);
          }

          setDetailedTeacher(teacherData);
        } else {
          throw new Error(response.message.join(", "));
        }
      } catch (err) {
        console.error("Error fetching teacher details:", err);
        setError("خطا در دریافت اطلاعات");
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedTeacher();
  }, [teacher.id]);

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
                  <p className="text-gray-700">
                    تاریخ ترفیع علمی:{" "}
                    {formatDate(detailedTeacher.academicPromotionDate)}
                  </p>
                  <p className="text-gray-700">
                    آخرین ترفیع: {formatDate(detailedTeacher.lastPromotionDate)}
                  </p>
                  <p className="text-gray-700">
                    دانشکده ماموریت:{" "}
                    {detailedTeacher.facultyOfMission || "نامشخص"}
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
                  <p className="text-gray-700">
                    تاریخ آخرین وضعیت:{" "}
                    {formatDate(detailedTeacher.lastStatusDate)}
                  </p>
                  <p className="text-gray-700">
                    نوع و شماره بیمه:{" "}
                    {detailedTeacher.insuranceTypeAndNumber || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    شماره شبا: {detailedTeacher.shebaNumber || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    بانک و شماره حساب:{" "}
                    {detailedTeacher.bankAndAccountNumber || "نامشخص"}
                  </p>
                  <p className="text-gray-700">
                    بند آیین‌نامه: {detailedTeacher.bandeAyeenName || "نامشخص"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "سوابق پژوهشی":
        return (
          <div className="mt-8 space-y-6">
            {renderRecordsList(detailedTeacher.researchRecords, "سوابق پژوهشی")}
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

        <div className="relative z-20 -mt-4 h-full w-full flex-1 rounded-2xl bg-white p-2">
          <div className="mr-36">
            <h1 className="pt-5 pr-7 text-3xl font-bold text-black">{`${detailedTeacher?.firstName ?? teacher.firstName} ${detailedTeacher?.lastName ?? teacher.lastName}`}</h1>
            <p className="pt-2 pr-7 text-gray-600">
              {facultyDisplay ??
                formatFacultyDisplay(detailedTeacher?.faculty, teacher.faculty)}
            </p>
            <p className="pt-1 pr-7 text-2xl font-bold text-black">
              {detailedTeacher?.rank ?? teacher.rank ?? "نامشخص"}
            </p>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

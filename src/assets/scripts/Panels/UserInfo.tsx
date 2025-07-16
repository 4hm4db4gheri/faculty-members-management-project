import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Timeline from "./../../components/TimeLineComponent";

interface UserInfoProps {
  onBack?: () => void;
}

export default function UserInfo({ onBack }: UserInfoProps) {
  const { teacherId } = useParams();
  // اگر teacherId صفر یا نامعتبر بود، از 1 به عنوان مقدار پیش‌فرض استفاده می‌کنیم
  const numericTeacherId = teacherId ? parseInt(teacherId) || 1 : 1;
  // Helper to show API value or 'تکمیل نشده' if value is empty/null/undefined
  const showValue = (value: any) => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return "تکمیل نشده";
    }
    return value;
  };
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
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch teacher info from API
  useEffect(() => {
    setLoading(true);
    // اگر teacherId صفر یا نامعتبر بود، از 1 به عنوان مقدار پیش‌فرض استفاده می‌کنیم
    const id = teacherId ? parseInt(teacherId) || 2 : 2;
    console.log("Fetching teacher with ID:", id);

    fetch(
      `https://faculty.liara.run/api/panel/v1/teacher/read-teacher-by-id/${id}`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        if (data && data.data) {
          setTeacher(data.data);
        } else {
          console.error("No teacher data found in response");
        }
      })
      .catch((error) => {
        console.error("Error fetching teacher data:", error);
        setTeacher(null);
      })
      .finally(() => setLoading(false));
  }, [teacherId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "اطلاعات کاربر":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">اطلاعات فردی</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    کد پرسنلی: {showValue(teacher.personalNumber)}
                  </p>
                  <p className="text-gray-700">
                    تاریخ تولد: {showValue(teacher.birthDate)}
                  </p>
                  <p className="text-gray-700">
                    محل تولد: {showValue(teacher.birthPlace)}
                  </p>
                  <p className="text-gray-700">
                    وضعیت تاهل:{" "}
                    {teacher.maritalStatus === 1
                      ? "متاهل"
                      : teacher.maritalStatus === 0
                        ? "مجرد"
                        : "تکمیل نشده"}
                  </p>
                  <p className="text-gray-700">
                    ملیت: {showValue(teacher.nationality)}
                  </p>
                  <p className="text-gray-700">
                    کد ملی: {showValue(teacher.nationalCode)}
                  </p>
                  <p className="text-gray-700">
                    دین: {showValue(teacher.religion)}
                  </p>
                  <p className="text-gray-700">
                    نام پدر: {showValue(teacher.fatherName)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">اطلاعات تماس</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    تلفن: {showValue(teacher.phoneNumber)}
                  </p>
                  <p className="text-gray-700">
                    ایمیل: {showValue(teacher.emailAddress)}
                  </p>
                  <p className="text-gray-700">
                    دفتر: {showValue(teacher.officeNumber)}
                  </p>
                  <p className="text-gray-700">
                    آدرس: {showValue(teacher.address)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "سوابق علمی پژوهشی":
        return (
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">مقالات پژوهشی</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {teacher.researchRecords &&
                teacher.researchRecords.length > 0 ? (
                  teacher.researchRecords.map((rec: any, idx: number) => (
                    <li
                      key={`research-${idx}-${rec.reference?.substring(0, 10) || idx}`}
                    >
                      {rec.reference || "تکمیل نشده"}
                      {rec.url && (
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-500"
                        >
                          [لینک]
                        </a>
                      )}
                    </li>
                  ))
                ) : (
                  <li>تکمیل نشده</li>
                )}
              </ul>
            </div>
          </div>
        );

      case "ارتباط با صنعت":
        return (
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">پروژه های صنعتی</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {teacher.industrialRecords &&
                teacher.industrialRecords.length > 0 ? (
                  teacher.industrialRecords.map((rec: any, idx: number) => (
                    <li
                      key={`industrial-${idx}-${rec.organizationName?.substring(0, 10) || idx}`}
                    >
                      {rec.organizationName || "تکمیل نشده"} -{" "}
                      {rec.description || "تکمیل نشده"}{" "}
                      {rec.date ? `(${rec.date})` : ""}
                    </li>
                  ))
                ) : (
                  <li>تکمیل نشده</li>
                )}
              </ul>
            </div>
          </div>
        );

      case "سوابق آموزشی":
        return (
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">سوابق آموزشی</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {teacher.courses && teacher.courses.length > 0 ? (
                  teacher.courses.map((course: string, idx: number) => (
                    <li
                      key={`course-${idx}-${course?.substring(0, 10) || idx}`}
                    >
                      {course || "تکمیل نشده"}
                    </li>
                  ))
                ) : (
                  <li>تکمیل نشده</li>
                )}
              </ul>
            </div>
          </div>
        );

      case "سوابق اجرایی":
        return (
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">سوابق اجرایی</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {teacher.executiveRecords &&
                teacher.executiveRecords.length > 0 ? (
                  teacher.executiveRecords.map((rec: any, idx: number) => (
                    <li
                      key={`executive-${idx}-${rec.description?.substring(0, 10) || idx}`}
                    >
                      {rec.description || "تکمیل نشده"}{" "}
                      {rec.startDate ? `(${rec.startDate}` : ""}
                      {rec.endDate
                        ? ` - ${rec.endDate})`
                        : rec.startDate
                          ? ")"
                          : ""}
                    </li>
                  ))
                ) : (
                  <li>تکمیل نشده</li>
                )}
              </ul>
            </div>
          </div>
        );

      case "سوابق ارتقا و تبدیل وضعیت":
        return (
          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">سوابق ارتقا و تبدیل وضعیت</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {teacher.promotionRecords &&
                teacher.promotionRecords.length > 0 ? (
                  teacher.promotionRecords.map((rec: any, idx: number) => (
                    <li
                      key={`promotion-${idx}-${rec.fromAcademicRank?.substring(0, 10) || idx}`}
                    >
                      {`از مرتبه ${rec.fromAcademicRank || "تکمیل نشده"} به ${rec.toAcademicRank || "تکمیل نشده"}`}{" "}
                      {rec.promotionDate ? `(${rec.promotionDate})` : ""}
                    </li>
                  ))
                ) : (
                  <li>تکمیل نشده</li>
                )}
              </ul>
            </div>
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>اطلاعات استاد یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Profile photo section */}
      <div className="flex h-[220px] items-start px-4">
        <div className="relative z-30 mt-6 h-[220px] w-[150px] overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="تصویر استاد"
            className="h-full w-full scale-120 object-cover object-center"
            style={{ objectPosition: "top center" }}
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
          <div className="mr-40">
            <h1 className="pr-5 text-2xl font-bold text-black">
              {(() => {
                switch (teacher.academicRank) {
                  case 0:
                    return "استادیار";
                  case 1:
                    return "دانشیار";
                  case 2:
                    return "استاد تمام";
                  default:
                    return "نامشخص";
                }
              })()}
            </h1>
            <h2 className="pt-1 pr-5 text-3xl font-bold text-black">{`${showValue(teacher.firstName)} ${showValue(teacher.lastName)}`}</h2>
            <p className="pt-2 pr-5 text-gray-600">
              دانشکده {(() => {
                debugger
                switch (teacher.faculty.toString()) {
                  case "0":
                    return "ادبيات و علوم انساني";
                  case "1":
                    return "الهیات و ادیان";
                  case "2":
                    return "حقوق";
                  case "3":
                    return "علوم اقتصادی و سیاسی";
                  case "4":
                    return "مدیریت و حسابداری";
                  case "5":
                    return "تربیت و روانشناسی";
                  case "6":
                    return "ورزش و تندرستی";
                  case "7":
                    return "علوم و فناوری زیستی";
                  case "8":
                    return "علوم زمین";
                  case "9":
                    return "ریاضی";
                  case "10":
                    return "فیزیک";
                  case "11":
                    return "شیمی و نفت";
                  case "12":
                    return "معماری و شهرسازی";
                  case "13":
                    return "فناوری‌های نوین و هواپیما";
                  case "14":
                    return "انرژی";
                  case "15":
                    return "مکانیک و انرژی";
                  case "16":
                    return "برق، الکترونیک و مخابرات";
                  case "17":
                    return "برق، کنترل و قدرت";
                  case "18":
                    return "مهندسی و علوم کامپیوتر";
                  case "19":
                    return "عمران و محیط زیست";
                  case "20":
                    return "هسته‌ای";
                  default:
                    return showValue(teacher.faculty);
                }
              })()}
            </p>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

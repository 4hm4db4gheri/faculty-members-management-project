import { useState } from "react";
import Timeline from "./../../components/TimeLineComponent";
import type { Teacher } from "../types/Teacher";

interface UserInfoProps {
  teacher: Teacher;
  onBack?: () => void; // Made optional with ?
}

export default function UserInfo({ teacher }: UserInfoProps) {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "اطلاعات کاربر":
        return (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">اطلاعات فردی</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">کد پرسنلی: ۱۲۳۴۵۶</p>
                  <p className="text-gray-700">تاریخ تولد: ۱۳۵۰/۰۶/۱۵</p>
                  <p className="text-gray-700">محل تولد: تهران</p>
                  <p className="text-gray-700">وضعیت تاهل: متاهل</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">اطلاعات تماس</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">تلفن: ۰۹۱۲۳۴۵۶۷۸۹</p>
                  <p className="text-gray-700">
                    ایمیل: ahmad.bagheri@uni.ac.ir
                  </p>
                  <p className="text-gray-700">
                    دفتر: دانشکده مهندسی کامپیوتر، طبقه سوم
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
              <h3 className="text-xl font-bold">مقالات</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>مقاله IEEE درباره هوش مصنوعی - ۲۰۲۳</li>
                <li>مقاله Springer درباره یادگیری ماشین - ۲۰۲۲</li>
                <li>مقاله ACM درباره پردازش تصویر - ۲۰۲۱</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">کتب</h3>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>مبانی هوش مصنوعی - انتشارات دانشگاه - ۱۴۰۱</li>
                <li>یادگیری عمیق کاربردی - انتشارات فنی - ۱۴۰۰</li>
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
                <li>همکاری با شرکت مپنا در پروژه پردازش تصویر - ۱۴۰۱</li>
                <li>مشاوره فنی شرکت صنایع الکترونیک - ۱۴۰۰</li>
                <li>پروژه هوشمندسازی خط تولید - ۱۳۹۹</li>
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

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Profile photo section */}
      <div className="flex h-[220px] items-start px-4">
        <div className="relative z-30 mt-4 h-[260px] w-[170px] overflow-hidden rounded-2xl shadow-lg">
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
        <div className="relative z-10 mb-1.5 flex items-center gap-3 pr-50">
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

        <div className="relative z-20 -mt-4 h-full w-full flex-1 rounded-2xl bg-white p-10">
          <div className="mr-40">
            <h1 className="text-2xl font-bold text-black">{teacher.rank}</h1>
            <h2 className="pt-4 text-3xl font-bold text-black">{`${teacher.firstName} ${teacher.lastName}`}</h2>
            <p className="pt-4 text-gray-600">دانشکده {teacher.faculty}</p>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

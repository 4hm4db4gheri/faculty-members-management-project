import { useState } from "react";
 import DashboardComponent from "../DashboardComponent";

export default function UserInfo() {
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
          <div className="space-y-4">
            <h3 className="text-xl font-bold">اطلاعات کلی</h3>
            <p>اطلاعات کلی استاد در این بخش نمایش داده می‌شود.</p>
          </div>
        );
      case "سوابق علمی پژوهشی":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">سوابق علمی پژوهشی</h3>
            <ul className="list-inside list-decimal space-y-2">
              <li>سابقه اول</li>
              <li>سابقه دوم</li>
              <li>سابقه سوم</li>
              <li>سابقه چهارم</li>
              <li>سابقه پنجم</li>
            </ul>
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
    <div className="flex h-full flex-col bg-[#EBF2FA]">
      <div className="flex px-6 py-6">
        <div className="mt-3 mr-6 ml-9 h-50 w-40 rounded-2xl bg-gray-200">
          {/* Profile image placeholder */}
        </div>
        <div className="mt-9 flex flex-col text-right">
          <h1 className="text-2xl font-bold">استاد تمام</h1>
          <h2 className="pt-4 text-3xl font-bold">احمد باقری</h2>
          <p className="pt-4 text-gray-600">
            دانشکده مهندسی کامپیوتر / نرم افزار و سیستم های اطلاعاتی
          </p>
        </div>
      </div>

      <div className="flex gap-7 p-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`rounded-2xl px-4 py-2 whitespace-nowrap transition-all outline-none ${
              activeTab === tab
                ? "scale-110 bg-white font-bold text-black shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* <DashboardComponent /> */}
      <div className="m-5 mt-0 rounded-2xl bg-white p-6">
        {renderTabContent()}
      </div>
    </div>
  );
  
}

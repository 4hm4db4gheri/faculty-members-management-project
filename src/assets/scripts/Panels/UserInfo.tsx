import { useState } from "react";
//  import DashboardComponent from "../DashboardComponent";

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
            <div className="mr-50 flex flex-col">
              <h1 className="text-2xl font-bold text-black">استاد تمام</h1>
              <h2 className="pt-4 text-3xl font-bold text-black">احمد باقری</h2>
              <p className="pt-4 text-gray-600">
                دانشکده مهندسی کامپیوتر / نرم افزار و سیستم های اطلاعاتی
              </p>
            </div>
            <div className="mt-4 border-t pt-4">
              <h3 className="text-xl font-bold">اطلاعات تکمیلی</h3>
              <p>اطلاعات تکمیلی استاد در این بخش نمایش داده می‌شود.</p>
            </div>
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
    <div className="mt-0 flex min-h-screen flex-col">
      {/* Profile photo section */}
      <div className="flex items-start px-2 h-[220px] ">
        <div className="relative z-20 h-[260px] w-[170px] rounded-2xl bg-gray-200 mt-4">
          {/* Profile image placeholder */}
        </div>
      </div>

      {/* Content wrapper with tabs and white container */}
      <div className="relative -mt-36 flex-1 ">
        {/* Tabs on top of white container */}
        <div className="relative z-10 flex items-center gap-2.5 pr-50">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`rounded-2xl px-3 py-1.5 text-sm whitespace-nowrap transition-all outline-none ${
                activeTab === tab
                  ? "scale-105 bg-white font-bold text-black shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* White container below tabs */}
        {/* <div className="relative z-0  min-h-[calc(100vh-80px)] rounded-2xl bg-white p-8"> */}
          <div className="relative z-0 -mt-4 flex-1 rounded-2xl h-[515px] w-[1100px] bg-white p-10">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );

 
}

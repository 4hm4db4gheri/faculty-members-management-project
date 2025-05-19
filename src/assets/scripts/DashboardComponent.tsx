import { useState } from "react";
import MainDashboardPanel from "./Panels/MainDashboardPanel";
import HistoryPanel from "./Panels/HistoryPanel";
import RoleManagementPanel from "./Panels/RoleManagementPanel";
import NotificationsPanel from "./Panels/NotificationsPanel";
import ImprovementChartPanel from "./Panels/ImprovementChartPanel";
import UserInfo from "./Panels/UserInfo";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  faculty: string;
  rank: string;
}

export default function DashboardComponent() {
  const [selectedItem, setSelectedItem] = useState<string>("dashboard"); // Default to the first item
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setSelectedTeacher(null); // Reset selected teacher when changing panels
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const renderPanel = () => {
    if (selectedTeacher && selectedItem === "records") {
      return (
        <UserInfo
          teacher={selectedTeacher}
          onBack={() => setSelectedTeacher(null)}
        />
      );
    }

    switch (selectedItem) {
      case "dashboard":
        return <MainDashboardPanel />;
      case "records":
        return <HistoryPanel onTeacherSelect={handleTeacherSelect} />;
      case "progress":
        return <ImprovementChartPanel />;
      case "roles":
        return <RoleManagementPanel />;
      case "notifications":
        return <NotificationsPanel />;
      default:
        return <MainDashboardPanel />; // Default to MainDashboard
    }
  };

  return (
    <div className="fixed top-0 right-0 m-0 flex h-screen w-screen flex-row-reverse items-center justify-end bg-[#1B4965] text-white">
      <div className="m-5 mr-0 flex h-[calc(100%-40px)] w-[calc(100%-40px)] flex-col rounded-[25px] bg-[#EBF2FA] p-5 text-base shadow-lg">
        {renderPanel()}
      </div>{" "}
      <div className="flex h-screen w-[22vw] flex-col items-stretch justify-start overflow-auto px-[0.5vw] pt-[2vh] text-2xl">
        <div className="m-5 mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#8D8D8D] text-lg font-bold text-white">
          Pic
        </div>
        <div className="flex items-center justify-center text-4xl">
          اسم سامانه
        </div>
        <div className="mx-auto my-5 h-[2px] w-[calc(100%-40px)] rounded bg-[#8D8D8D]"></div>

        {/* Navigation Buttons */}
        <button
          className={`m-[5px] inline-flex h-[80px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-2xl text-white transition-colors duration-300 ease-in-out outline-none ${selectedItem === "dashboard" ? "bg-[#3388BC]" : "bg-transparent hover:bg-[#3388BC33]"}`}
          onClick={() => handleSelect("dashboard")}
        >
          داشبورد
        </button>
        <button
          className={`m-[5px] inline-flex h-[80px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-2xl text-white transition-colors duration-300 ease-in-out outline-none ${selectedItem === "records" ? "bg-[#3388BC]" : "bg-transparent hover:bg-[#3388BC33]"}`}
          onClick={() => handleSelect("records")}
        >
          سوابق
        </button>
        <button
          className={`m-[5px] inline-flex h-[80px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-2xl text-white transition-colors duration-300 ease-in-out outline-none ${selectedItem === "progress" ? "bg-[#3388BC]" : "bg-transparent hover:bg-[#3388BC33]"}`}
          onClick={() => handleSelect("progress")}
        >
          نمودار پیشرفت
        </button>
        <button
          className={`m-[5px] inline-flex h-[80px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-2xl text-white transition-colors duration-300 ease-in-out outline-none ${selectedItem === "roles" ? "bg-[#3388BC]" : "bg-transparent hover:bg-[#3388BC33]"}`}
          onClick={() => handleSelect("roles")}
        >
          مدیریت نقش ها
        </button>
        <button
          className={`m-[5px] inline-flex h-[80px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-2xl text-white transition-colors duration-300 ease-in-out outline-none ${selectedItem === "notifications" ? "bg-[#3388BC]" : "bg-transparent hover:bg-[#3388BC33]"}`}
          onClick={() => handleSelect("notifications")}
        >
          اعلان ها
        </button>
      </div>
    </div>
  );
}

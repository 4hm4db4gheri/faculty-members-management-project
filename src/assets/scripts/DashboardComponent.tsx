import { useState, useEffect } from "react";
import { AuthService } from "./Services/AuthService";
import MainDashboardPanel from "./Panels/MainDashboardPanel";
import HistoryPanel from "./Panels/HistoryPanel";
import RoleManagementPanel from "./Panels/RoleManagementPanel";
import NotificationsPanel from "./Panels/NotificationsPanel";
import ImprovementChartPanel from "./Panels/ImprovementChartPanel";
import UserInfo from "./Panels/UserInfo";
import NotificationDetail from "./Panels/NotificationDetail";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  faculty: string;
  rank: string;
}

interface Notification {
  id: number;
  title: string;
  priority: string;
  tag: string;
}

export default function DashboardComponent() {
  const [selectedItem, setSelectedItem] = useState<string>("dashboard"); // Default to the first item
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    // Check if user has access when component mounts
    const checkAccess = () => {
      const hasAccess = AuthService.hasFullAccess();
      setHasFullAccess(hasAccess);

      // If user is on roles page but doesn't have access, redirect to dashboard
      if (!hasAccess && selectedItem === "roles") {
        setSelectedItem("dashboard");
      }
    };

    checkAccess();
  }, []);

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setSelectedTeacher(null); // Reset selected teacher when changing panels
    setSelectedNotification(null); // Reset selected notification when changing panels
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleNotificationSelect = (notification: Notification) => {
    setSelectedNotification(notification);
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

    if (selectedNotification && selectedItem === "notifications") {
      return (
        <NotificationDetail
          notification={selectedNotification}
          onBack={() => setSelectedNotification(null)}
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
        return (
          <NotificationsPanel onNotificationSelect={handleNotificationSelect} />
        );
      default:
        return <MainDashboardPanel />; // Default to MainDashboard
    }
  };

  return (
    <div className="fixed top-0 right-0 m-0 flex h-screen w-screen flex-row-reverse items-center justify-end bg-[#1B4965] text-white">
      <div className="m-5 mr-0 flex h-[calc(100%-40px)] w-[calc(100%-40px)] flex-col rounded-[25px] bg-[#EBF2FA] p-5 text-base shadow-lg">
        {renderPanel()}
      </div>{" "}
      <div className="flex h-screen w-[24vw] flex-col items-stretch justify-start overflow-auto px-[0.5vw] pt-[2vh] text-2xl">
        <div className="m-5 mx-auto flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[#8D8D8D] text-lg font-bold text-white">
          Pic
        </div>
        <div className="flex items-center justify-center text-5xl">
          اسم سامانه
        </div>
        <div className="mx-auto my-5 h-[2px] w-[calc(100%-40px)] rounded bg-[#8D8D8D]"></div>

        {/* Navigation Buttons */}
        <button
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${
            selectedItem === "dashboard"
              ? "bg-[#3388BC]"
              : "bg-transparent hover:bg-[#3388BC33]"
          }`}
          onClick={() => handleSelect("dashboard")}
        >
          داشبورد
        </button>
        <button
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${
            selectedItem === "records"
              ? "bg-[#3388BC]"
              : "bg-transparent hover:bg-[#3388BC33]"
          }`}
          onClick={() => handleSelect("records")}
        >
          سوابق
        </button>
        <button
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${
            selectedItem === "progress"
              ? "bg-[#3388BC]"
              : "bg-transparent hover:bg-[#3388BC33]"
          }`}
          onClick={() => handleSelect("progress")}
        >
          نمودار پیشرفت
        </button>
        {hasFullAccess && (
          <button
            className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${
              selectedItem === "roles"
                ? "bg-[#3388BC]"
                : "bg-transparent hover:bg-[#3388BC33]"
            }`}
            onClick={() => handleSelect("roles")}
          >
            مدیریت نقش ها
          </button>
        )}
        <button
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${
            selectedItem === "notifications"
              ? "bg-[#3388BC]"
              : "bg-transparent hover:bg-[#3388BC33]"
          }`}
          onClick={() => handleSelect("notifications")}
        >
          اعلان ها
        </button>
      </div>
    </div>
  );
}

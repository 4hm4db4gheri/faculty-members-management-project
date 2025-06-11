import { useState, useEffect } from "react";
import { AuthService } from "./Services/AuthService";
import MainDashboardPanel from "./Panels/MainDashboardPanel";
import HistoryPanel from "./Panels/HistoryPanel";
import RoleManagementPanel from "./Panels/RoleManagementPanel";
import NotificationsPanel from "./Panels/NotificationsPanel";
import ImprovementChartPanel from "./Panels/ImprovementChartPanel";
import UserInfo from "./Panels/UserInfo";
import NotificationDetail from "./Panels/NotificationDetail";
import SentNotificationsPanel from "./Panels/SentNotificationsPanel";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

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
          // onBack={() => setSelectedTeacher(null)}
        />
      );
    }

    debugger;
    if (selectedNotification && selectedItem === "notifications") {
      return (
        <NotificationDetail
          notificationId={selectedNotification.id}
          // onBack={() => setSelectedNotification(null)}
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

  function setIsSidebarOpen(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#1B4965] text-white lg:flex-row-reverse">
      {/* Hamburger menu for small screens */}
      <div className="absolute top-4 right-4 z-50 bg-[#1B4965] lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-md p-2 focus:ring-2 focus:ring-white focus:outline-none"
        >
          <svg
            className="h-8 w-8 bg-[#1B4965] text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="m-2 flex h-[calc(100%-40px)] w-[calc(100%-40px)] flex-1 flex-col overflow-auto rounded-[25px] bg-[#EBF2FA] p-4 text-base shadow-lg lg:m-5 lg:mr-0 lg:w-auto lg:p-5">
        <Routes>
          <Route path="/" element={<MainDashboardPanel />} />
          <Route
            path="records"
            element={<HistoryPanel onTeacherSelect={handleTeacherSelect} />}
          />
          <Route
            path="records/:teacherId"
            element={
              <UserInfo
                teacher={selectedTeacher!}
                onBack={() => navigate("/dashboard/records")}
              />
            }
          />
          <Route path="progress" element={<ImprovementChartPanel />} />
          {hasFullAccess && (
            <Route path="roles" element={<RoleManagementPanel />} />
          )}
          <Route
            path="notifications"
            element={
              <NotificationsPanel
                onNotificationSelect={handleNotificationSelect}
              />
            }
          />
          <Route
            path="notifications/:notificationId"
            element={
              <NotificationDetail
                notification={selectedNotification!}
                onBack={() => navigate("/dashboard/notifications")}
              />
            }
          />
          <Route
            path="sent-notifications"
            element={<SentNotificationsPanel />}
          />
        </Routes>
      </div>

      {/* Sidebar / Navigation Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col items-stretch justify-start bg-[#1B4965] transition-transform duration-300 ease-in-out lg:w-64 xl:w-72 ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"} lg:static lg:flex lg:translate-x-0 lg:p-4`}
      >
        {/* Close button for mobile sidebar */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md p-2 focus:ring-2 focus:ring-white focus:outline-none"
          >
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="m-5 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#8D8D8D] text-sm font-bold text-white sm:h-32 sm:w-32 md:text-lg lg:text-xl">
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

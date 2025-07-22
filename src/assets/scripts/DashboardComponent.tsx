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
  subject?: string;
  sendMethod?: string;
  sendDate?: string;
  description?: string;
}

export default function DashboardComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const hasAccess = AuthService.hasFullAccess();
      setHasFullAccess(hasAccess);

      if (!hasAccess && location.pathname === "/dashboard/roles") {
        navigate("/dashboard");
      }
    };

    checkAccess();
  }, [location.pathname, navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    navigate(`/dashboard/records/${teacher.id}`);
  };

  const handleNotificationSelect = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const getActiveClass = (path: string) => {
    const currentPath = location.pathname;
    if (path === "/dashboard" && currentPath === "/dashboard")
      return "bg-[#3388BC]";
    if (path !== "/dashboard" && currentPath.startsWith(path))
      return "bg-[#3388BC]";
    return "bg-transparent hover:bg-[#3388BC33]";
  };

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
                onBack={() => handleNavigate("/dashboard/records")}
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
                notificationId={selectedNotification?.id}
                initialTitle={selectedNotification?.title}
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
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col items-stretch justify-start bg-[#1B4965] transition-transform duration-300 ease-in-out lg:w-64 xl:w-72 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } lg:static lg:flex lg:translate-x-0 lg:p-4`}
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

        <div className="m-5 mx-auto mb-4 flex items-center justify-center bg-white w-32 h-32">
          <img
            src="src/assets/images/Sbu-logo.svg.png"
            alt="لوگو"
            className="h-full w-full bg-white object-contain"
          />
        </div>
        <div className="mb-4 flex items-center justify-center px-2 text-3xl sm:text-4xl">
          سماه
        </div>
        <div className="mx-auto my-3 h-[2px] w-[calc(100%-40px)] rounded bg-[#8D8D8D]"></div>

        {/* Navigation Buttons */}
        <button
          className={`m-1 inline-flex h-auto cursor-pointer items-center justify-center rounded-[25px] border-none p-3 text-center text-lg text-white transition-colors duration-300 ease-in-out outline-none sm:m-2 sm:p-4 sm:text-xl md:text-2xl lg:text-3xl ${getActiveClass(
            "/dashboard",
          )}`}
          onClick={() => {
            handleNavigate("/dashboard");
            setSelectedNotification(null);
          }}
        >
          داشبورد
        </button>
        <button
          className={`m-1 inline-flex h-auto cursor-pointer items-center justify-center rounded-[25px] border-none p-3 text-center text-lg text-white transition-colors duration-300 ease-in-out outline-none sm:m-2 sm:p-4 sm:text-xl md:text-2xl lg:text-3xl ${getActiveClass(
            "/dashboard/records",
          )}`}
          onClick={() => handleNavigate("/dashboard/records")}
        >
          سوابق
        </button>
        <button
          className={`m-1 inline-flex h-auto cursor-pointer items-center justify-center rounded-[25px] border-none p-3 text-center text-lg text-white transition-colors duration-300 ease-in-out outline-none sm:m-2 sm:p-4 sm:text-xl md:text-2xl lg:text-3xl ${getActiveClass(
            "/dashboard/progress",
          )}`}
          onClick={() => handleNavigate("/dashboard/progress")}
        >
          نمودار پیشرفت
        </button>
        {hasFullAccess && (
          <button
            className={`m-1 inline-flex h-auto cursor-pointer items-center justify-center rounded-[25px] border-none p-3 text-center text-lg text-white transition-colors duration-300 ease-in-out outline-none sm:m-2 sm:p-4 sm:text-xl md:text-2xl lg:text-3xl ${getActiveClass(
              "/dashboard/roles",
            )}`}
            onClick={() => handleNavigate("/dashboard/roles")}
          >
            مدیریت نقش ها
          </button>
        )}
        <button
          className={`m-1 inline-flex h-auto cursor-pointer items-center justify-center rounded-[25px] border-none p-3 text-center text-lg text-white transition-colors duration-300 ease-in-out outline-none sm:m-2 sm:p-4 sm:text-xl md:text-2xl lg:text-3xl ${getActiveClass(
            "/dashboard/notifications",
          )}`}
          onClick={() => {
            handleNavigate("/dashboard/notifications");
            setSelectedNotification(null);
          }}
        >
          اعلان ها
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

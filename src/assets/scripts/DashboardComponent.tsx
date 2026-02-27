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
import NotFoundPage from "./Panels/NotFoundPage";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { Teacher } from "./types/Teacher";

// Import SVG icons
import DashboardIcon from "../elements/dashboard (1).svg";
import HistoryIcon from "../elements/history.svg";
import ChartIcon from "../elements/chart.svg";
import RoleIcon from "../elements/role.svg";
import NotificationIcon from "../elements/notification.svg";
import ExitIcon from "../elements/exit.svg";
import SbuLogo from "../../assets/images/Sbu-logo.svg.png";

// Component to handle teacher details with URL parameter
function TeacherDetailWrapper() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();

  // Validate teacherId
  if (!teacherId) {
    navigate("/dashboard/records");
    return null;
  }

  const parsedId = parseInt(teacherId);
  
  // Check if teacherId is a valid number
  if (isNaN(parsedId) || parsedId <= 0 || !teacherId.match(/^\d+$/)) {
    // Invalid ID format (not a number or negative), show 404
    return <NotFoundPage />;
  }

  // Create a minimal teacher object with just the ID for now
  // The UserInfo component will fetch the full details
  const teacher: Teacher = {
    id: parsedId,
    firstName: "",
    lastName: "",
    faculty: "",
    rank: "",
    phoneNumber: "",
    email: "",
    group: "",
    lastDegree: "",
    employmentStatus: "",
    isTeaching: false,
    nationalCode: "",
    points: 0,
  };

  return (
    <UserInfo teacher={teacher} onBack={() => navigate("/dashboard/records")} />
  );
}

// Component to handle notification details with URL parameter validation
function NotificationDetailWrapper() {
  const { notificationId } = useParams<{ notificationId: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    id: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    // Validate notificationId
    if (!notificationId) {
      navigate("/dashboard/notifications");
      return;
    }

    const parsedId = parseInt(notificationId);
    
    // Check if notificationId is a valid number
    if (isNaN(parsedId) || parsedId <= 0 || !notificationId.match(/^\d+$/)) {
      // Invalid ID format, don't set notification (will show 404 below)
      return;
    }

    setNotification({
      id: parsedId,
      title: "",
    });
  }, [notificationId, navigate]);

  // If notification is null after validation, show 404
  if (!notificationId || !notificationId.match(/^\d+$/)) {
    return <NotFoundPage />;
  }

  return (
    <NotificationDetail
      notificationId={notification?.id}
      initialTitle={notification?.title}
    />
  );
}

export default function DashboardComponent() {
  const navigate = useNavigate();
  const location = useLocation();
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
      {/* Main Content Area - موبایل: فضا برای navbar پایین، دسکتاپ: عرض ثابت و اسکرول داخلی */}
      <div className="m-1 flex h-[calc(100%-60px)] w-[calc(100%-8px)] flex-col overflow-auto rounded-[15px] bg-[#EBF2FA] p-2 text-sm shadow-lg sm:m-2 sm:h-[calc(100%-70px)] sm:w-[calc(100%-16px)] sm:rounded-[20px] sm:p-3 sm:text-base lg:m-5 lg:mr-0 lg:flex lg:h-full lg:min-h-0 lg:min-w-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:rounded-[25px] lg:p-5 lg:text-base">
        <div className="min-h-0 flex-1 flex flex-col overflow-auto">
          <Routes>
          <Route path="/" element={<MainDashboardPanel />} />
          <Route path="records" element={<HistoryPanel />} />
          <Route path="records/:teacherId" element={<TeacherDetailWrapper />} />
          <Route path="progress" element={<ImprovementChartPanel />} />
          {hasFullAccess && (
            <Route path="roles" element={<RoleManagementPanel />} />
          )}
          <Route
            path="notifications"
            element={<NotificationsPanel />}
          />
          <Route
            path="notifications/:notificationId"
            element={<NotificationDetailWrapper />}
          />
          <Route
            path="sent-notifications"
            element={<SentNotificationsPanel />}
          />
          {/* Catch-all route for 404 errors within dashboard */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </div>
      </div>

      {/* Sidebar / Navigation Panel */}

      <div
        className={`fixed inset-y-0 right-0 z-40 flex w-[280px] flex-col items-stretch justify-between overflow-hidden bg-[#1B4965] transition-transform duration-300 ease-in-out sm:w-64 lg:w-64 xl:w-72 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } lg:static lg:flex lg:translate-x-0 lg:p-4`}
      >
        {/* Top section - Scrollable */}
        <div className="flex flex-1 flex-col overflow-y-auto">
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
          <div className="mx-auto mt-2 mb-2 flex h-20 w-20 items-center justify-center bg-white sm:mt-3 sm:mb-3 sm:h-24 sm:w-24 lg:mt-5 lg:mb-4 lg:h-32 lg:w-32">
            <img
              src={SbuLogo}
              alt="لوگو"
              className="h-full w-full bg-white object-contain"
            />
          </div>
          <div className="mb-2 flex items-center justify-center px-2 text-xl sm:mb-3 sm:text-2xl lg:mb-4 lg:text-4xl">
            سماه
          </div>
          <div className="mx-auto my-2 h-[2px] w-[calc(100%-32px)] rounded bg-[#8D8D8D] sm:w-[calc(100%-40px)] lg:my-3"></div>
          {/* Navigation Buttons */}
          <button
            className={`m-0.5 inline-flex h-auto cursor-pointer items-center justify-start rounded-[15px] border-none p-1.5 text-left text-xs text-white transition-colors duration-300 ease-in-out outline-none sm:m-1 sm:p-2 sm:text-sm lg:m-1.5 lg:rounded-[20px] lg:p-2.5 lg:text-lg xl:text-xl ${getActiveClass(
              "/dashboard",
            )}`}
            onClick={() => handleNavigate("/dashboard")}
          >
            <img
              src={DashboardIcon}
              alt="Dashboard"
              className="mr-1.5 h-5 w-5 pl-1 brightness-0 invert filter sm:mr-2 sm:h-6 sm:w-6 sm:pl-2 lg:h-8 lg:w-8"
            />
            داشبورد
          </button>
          <button
            className={`m-0.5 inline-flex h-auto cursor-pointer items-center justify-start rounded-[15px] border-none p-1.5 text-left text-xs text-white transition-colors duration-300 ease-in-out outline-none sm:m-1 sm:p-2 sm:text-sm lg:m-1.5 lg:rounded-[20px] lg:p-2.5 lg:text-lg xl:text-xl ${getActiveClass(
              "/dashboard/records",
            )}`}
            onClick={() => handleNavigate("/dashboard/records")}
          >
            <img
              src={HistoryIcon}
              alt="History"
              className="mr-1.5 h-5 w-5 pl-1 brightness-0 invert filter sm:mr-2 sm:h-6 sm:w-6 sm:pl-2 lg:h-8 lg:w-8"
            />
            سوابق
          </button>
          <button
            className={`m-0.5 inline-flex h-auto cursor-pointer items-center justify-start rounded-[15px] border-none p-1.5 text-left text-xs text-white transition-colors duration-300 ease-in-out outline-none sm:m-1 sm:p-2 sm:text-sm lg:m-1.5 lg:rounded-[20px] lg:p-2.5 lg:text-lg xl:text-xl ${getActiveClass(
              "/dashboard/progress",
            )}`}
            onClick={() => handleNavigate("/dashboard/progress")}
          >
            <img
              src={ChartIcon}
              alt="Chart"
              className="mr-1.5 h-5 w-5 pl-1 brightness-0 invert filter sm:mr-2 sm:h-6 sm:w-6 sm:pl-2 lg:h-8 lg:w-8"
            />
            نمودار پیشرفت
          </button>
          {hasFullAccess && (
            <button
              className={`m-0.5 inline-flex h-auto cursor-pointer items-center justify-start rounded-[15px] border-none p-1.5 text-left text-xs text-white transition-colors duration-300 ease-in-out outline-none sm:m-1 sm:p-2 sm:text-sm lg:m-1.5 lg:rounded-[20px] lg:p-2.5 lg:text-lg xl:text-xl ${getActiveClass(
                "/dashboard/roles",
              )}`}
              onClick={() => handleNavigate("/dashboard/roles")}
            >
              <img
                src={RoleIcon}
                alt="Role"
                className="mr-1.5 h-5 w-5 pl-1 brightness-0 invert filter sm:mr-2 sm:h-6 sm:w-6 sm:pl-2 lg:h-8 lg:w-8"
              />
              مدیریت نقش ها
            </button>
          )}
          <button
            className={`m-0.5 inline-flex h-auto cursor-pointer items-center justify-start rounded-[15px] border-none p-1.5 text-left text-xs text-white transition-colors duration-300 ease-in-out outline-none sm:m-1 sm:p-2 sm:text-sm lg:m-1.5 lg:rounded-[20px] lg:p-2.5 lg:text-lg xl:text-xl ${getActiveClass(
              "/dashboard/notifications",
            )}`}
            onClick={() => handleNavigate("/dashboard/notifications")}
          >
            <img
              src={NotificationIcon}
              alt="Notifications"
              className="mr-1.5 h-5 w-5 pl-1 brightness-0 invert filter sm:mr-2 sm:h-6 sm:w-6 sm:pl-2 lg:h-8 lg:w-8"
            />
            اعلان ها
          </button>
        </div>
        {/* Bottom section: Exit button - Always visible */}
        <div className="flex-shrink-0 border-t border-[#3388BC33]">
          <button
            className="m-0.5 inline-flex h-auto w-full cursor-pointer items-center justify-start rounded-[15px] border-none bg-transparent p-1.5 text-left text-xs text-white transition-colors duration-300 ease-in-out outline-none hover:bg-[#3388BC33] sm:m-1 sm:p-2 sm:text-sm lg:m-1.5 lg:rounded-[20px] lg:p-2.5 lg:text-lg xl:text-xl"
            onClick={() => {
              // Clear all authentication data using AuthService
              AuthService.clearAuth();
              // Navigate to login page
              navigate("/", { replace: true });
            }}
          >
            <img
              src={ExitIcon}
              alt="Exit"
              className="mr-1.5 h-5 w-5 pl-1 brightness-0 invert filter sm:mr-2 sm:h-6 sm:w-6 sm:pl-2 lg:h-8 lg:w-8"
            />
            خروج
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="flex h-[60px] flex-shrink-0 items-center justify-around border-t border-[#3388BC33] bg-[#1B4965] lg:hidden sm:h-[70px]">
        <button
          onClick={() => handleNavigate("/dashboard")}
          className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${getActiveClass("/dashboard") === "bg-[#3388BC]" ? "text-white" : "text-gray-400"}`}
        >
          <img src={DashboardIcon} alt="Dashboard" className="h-5 w-5 brightness-0 invert filter sm:h-6 sm:w-6" />
          <span className="mt-1 text-[10px] sm:text-xs">داشبورد</span>
        </button>
        <button
          onClick={() => handleNavigate("/dashboard/records")}
          className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${getActiveClass("/dashboard/records") === "bg-[#3388BC]" ? "text-white" : "text-gray-400"}`}
        >
          <img src={HistoryIcon} alt="History" className="h-5 w-5 brightness-0 invert filter sm:h-6 sm:w-6" />
          <span className="mt-1 text-[10px] sm:text-xs">سوابق</span>
        </button>
        <button
          onClick={() => handleNavigate("/dashboard/progress")}
          className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${getActiveClass("/dashboard/progress") === "bg-[#3388BC]" ? "text-white" : "text-gray-400"}`}
        >
          <img src={ChartIcon} alt="Chart" className="h-5 w-5 brightness-0 invert filter sm:h-6 sm:w-6" />
          <span className="mt-1 text-[10px] sm:text-xs">نمودار</span>
        </button>
        {hasFullAccess && (
          <button
            onClick={() => handleNavigate("/dashboard/roles")}
            className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${getActiveClass("/dashboard/roles") === "bg-[#3388BC]" ? "text-white" : "text-gray-400"}`}
          >
            <img src={RoleIcon} alt="Role" className="h-5 w-5 brightness-0 invert filter sm:h-6 sm:w-6" />
            <span className="mt-1 text-[10px] sm:text-xs">نقش‌ها</span>
          </button>
        )}
        <button
          onClick={() => handleNavigate("/dashboard/notifications")}
          className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${getActiveClass("/dashboard/notifications") === "bg-[#3388BC]" ? "text-white" : "text-gray-400"}`}
        >
          <img src={NotificationIcon} alt="Notifications" className="h-5 w-5 brightness-0 invert filter sm:h-6 sm:w-6" />
          <span className="mt-1 text-[10px] sm:text-xs">اعلان‌ها</span>
        </button>
        <button
          onClick={() => {
            AuthService.clearAuth();
            navigate("/", { replace: true });
          }}
          className="flex flex-col items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:text-white"
        >
          <img src={ExitIcon} alt="Exit" className="h-5 w-5 brightness-0 invert filter sm:h-6 sm:w-6" />
          <span className="mt-1 text-[10px] sm:text-xs">خروج</span>
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

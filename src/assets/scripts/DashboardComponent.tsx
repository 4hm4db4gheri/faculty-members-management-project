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

// Component to handle teacher details with URL parameter
function TeacherDetailWrapper() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();

  if (!teacherId) {
    navigate("/dashboard/records");
    return null;
  }

  // Create a minimal teacher object with just the ID for now
  // The UserInfo component will fetch the full details
  const teacher: Teacher = {
    id: parseInt(teacherId),
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

export default function DashboardComponent() {
  const navigate = useNavigate();
  const location = useLocation();
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
          <Route path="records" element={<HistoryPanel />} />
          <Route path="records/:teacherId" element={<TeacherDetailWrapper />} />
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
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col items-stretch justify-between bg-[#1B4965] transition-transform duration-300 ease-in-out lg:w-64 xl:w-72 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } lg:static lg:flex lg:translate-x-0 lg:p-4`}
      >
        {/* Top section */}
        <div className="flex flex-1 flex-col">
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
          <div className="m-5 mx-auto mb-4 flex h-32 w-32 items-center justify-center bg-white">
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
            className={`m-1 inline-flex h-auto cursor-pointer items-center justify-start rounded-[20px] border-none p-2.5 text-left text-base text-white transition-colors duration-300 ease-in-out outline-none sm:m-1.5 sm:p-3 sm:text-lg md:text-xl lg:text-2xl ${getActiveClass(
              "/dashboard",
            )}`}
            onClick={() => {
              handleNavigate("/dashboard");
              setSelectedNotification(null);
            }}
          >
            <img
              src={DashboardIcon}
              alt="Dashboard"
              className="mr-2 h-8 w-8 pl-2 brightness-0 invert filter"
            />
            داشبورد
          </button>
          <button
            className={`m-1 inline-flex h-auto cursor-pointer items-center justify-start rounded-[20px] border-none p-2.5 text-left text-base text-white transition-colors duration-300 ease-in-out outline-none sm:m-1.5 sm:p-3 sm:text-lg md:text-xl lg:text-2xl ${getActiveClass(
              "/dashboard/records",
            )}`}
            onClick={() => handleNavigate("/dashboard/records")}
          >
            <img
              src={HistoryIcon}
              alt="History"
              className="mr-2 h-8 w-8 pl-2 brightness-0 invert filter"
            />
            سوابق
          </button>
          <button
            className={`m-1 inline-flex h-auto cursor-pointer items-center justify-start rounded-[20px] border-none p-2.5 text-left text-base text-white transition-colors duration-300 ease-in-out outline-none sm:m-1.5 sm:p-3 sm:text-lg md:text-xl lg:text-2xl ${getActiveClass(
              "/dashboard/progress",
            )}`}
            onClick={() => handleNavigate("/dashboard/progress")}
          >
            <img
              src={ChartIcon}
              alt="Chart"
              className="mr-2 h-8 w-8 pl-2 brightness-0 invert filter"
            />
            نمودار پیشرفت
          </button>
          {hasFullAccess && (
            <button
              className={`m-1 inline-flex h-auto cursor-pointer items-center justify-start rounded-[20px] border-none p-2.5 text-left text-base text-white transition-colors duration-300 ease-in-out outline-none sm:m-1.5 sm:p-3 sm:text-lg md:text-xl lg:text-2xl ${getActiveClass(
                "/dashboard/roles",
              )}`}
              onClick={() => handleNavigate("/dashboard/roles")}
            >
              <img
                src={RoleIcon}
                alt="Role"
                className="mr-2 h-8 w-8 pl-2 brightness-0 invert filter"
              />
              مدیریت نقش ها
            </button>
          )}
          <button
            className={`m-1 inline-flex h-auto cursor-pointer items-center justify-start rounded-[20px] border-none p-2.5 text-left text-base text-white transition-colors duration-300 ease-in-out outline-none sm:m-1.5 sm:p-3 sm:text-lg md:text-xl lg:text-2xl ${getActiveClass(
              "/dashboard/notifications",
            )}`}
            onClick={() => {
              handleNavigate("/dashboard/notifications");
              setSelectedNotification(null);
            }}
          >
            <img
              src={NotificationIcon}
              alt="Notifications"
              className="mr-2 h-8 w-8 pl-2 brightness-0 invert filter"
            />
            اعلان ها
          </button>
        </div>
        {/* Bottom section: Exit button */}
        <button
          className={
            `m-1 inline-flex h-auto w-full cursor-pointer items-center justify-start rounded-[20px] border-none bg-transparent p-2.5 text-left text-base text-white transition-colors duration-300 ease-in-out outline-none hover:bg-[#3388BC33] sm:m-1.5 sm:p-3 sm:text-lg md:text-xl lg:text-2xl` // w-full for alignment
          }
          style={{ marginTop: "auto" }}
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
            className="mr-2 h-8 w-8 pl-2 brightness-0 invert filter"
          />
          خروج
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

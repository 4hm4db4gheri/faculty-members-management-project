import { useState, useEffect } from "react";
import { AuthService } from "./Services/AuthService";
import MainDashboardPanel from "./Panels/MainDashboardPanel";
import HistoryPanel from "./Panels/HistoryPanel";
import RoleManagementPanel from "./Panels/RoleManagementPanel";
import NotificationsPanel from "./Panels/NotificationsPanel";
import ImprovementChartPanel from "./Panels/ImprovementChartPanel";
import UserInfo from "./Panels/UserInfo";
import NotificationDetail from "./Panels/NotificationDetail";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"; // Import necessary hooks

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
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current URL location
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const hasAccess = AuthService.hasFullAccess();
      setHasFullAccess(hasAccess);

      // If user is on roles page but doesn't have access, redirect to dashboard
      // Now using location.pathname to check current route
      if (!hasAccess && location.pathname === "/dashboard/roles") {
        navigate("/dashboard"); // Redirect to dashboard if no access
      }
    };

    checkAccess();
  }, [location.pathname, navigate]); // Rerun effect if pathname changes

  // Function to handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    setSelectedTeacher(null); // Reset selected teacher when changing panels
    setSelectedNotification(null); // Reset selected notification when changing panels
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    navigate(`/dashboard/records/${teacher.id}`); // Navigate to a specific teacher's page
  };

  const handleNotificationSelect = (notification: Notification) => {
    setSelectedNotification(notification);
    navigate(`/dashboard/notifications/${notification.id}`); // Navigate to a specific notification's page
  };

  // Determine active item based on current URL path
  const getActiveClass = (path: string) => {
    return location.pathname === path
      ? "bg-[#3388BC]"
      : "bg-transparent hover:bg-[#3388BC33]";
  };

  return (
    <div className="fixed top-0 right-0 m-0 flex h-screen w-screen flex-row-reverse items-center justify-end bg-[#1B4965] text-white">
      <div className="m-5 mr-0 flex h-[calc(100%-40px)] w-[calc(100%-40px)] flex-col rounded-[25px] bg-[#EBF2FA] p-5 text-base shadow-lg">
        {/* Render nested routes */}
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
          />{" "}
          {/* TeacherDetail route */}
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
          />{" "}
          {/* NotificationDetail route */}
        </Routes>
      </div>
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
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${getActiveClass("/dashboard")}`}
          onClick={() => handleNavigate("/dashboard")}
        >
          داشبورد
        </button>
        <button
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${getActiveClass("/dashboard/records")}`}
          onClick={() => handleNavigate("/dashboard/records")}
        >
          سوابق
        </button>
        <button
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${getActiveClass("/dashboard/progress")}`}
          onClick={() => handleNavigate("/dashboard/progress")}
        >
          نمودار پیشرفت
        </button>
        {hasFullAccess && (
          <button
            className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${getActiveClass("/dashboard/roles")}`}
            onClick={() => handleNavigate("/dashboard/roles")}
          >
            مدیریت نقش ها
          </button>
        )}
        <button
          className={`m-[5px] inline-flex h-[90px] cursor-pointer items-center justify-center rounded-[25px] border-none text-center text-4xl text-white transition-colors duration-300 ease-in-out outline-none ${getActiveClass("/dashboard/notifications")}`}
          onClick={() => handleNavigate("/dashboard/notifications")}
        >
          اعلان ها
        </button>
      </div>
    </div>
  );
}

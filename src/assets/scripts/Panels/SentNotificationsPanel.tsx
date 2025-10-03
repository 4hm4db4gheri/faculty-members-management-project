import { useState, useEffect, useMemo } from "react";
import LoadingSpinner from "../Elements/LoadingSpinner";
import {
  getSentTeacherNotificationsV2,
  getNotifications,
} from "../Services/apiEndpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MyDropdown from "../Elements/MyDropdown";
import MyInput from "../Elements/MyInput";
import PersianDatePicker from "../Elements/PersianDatePicker";

interface SentNotification {
  title: string;
  teacherName: string;
  sendAt: string;
  status: string;
  sendType: number;
}

interface SentNotificationsApiResponse {
  data: SentNotification[];
  error: boolean;
  message: string[];
}

interface NotificationModel {
  id: number;
  title: string;
  sendType: number;
  notificationType: number;
  beforeSendDay: string;
  enabled: boolean;
}

interface NotificationResponse {
  data: NotificationModel[];
  error: boolean;
  message: string[];
}

interface Filters {
  notificationTitle: string; // عنوان (actual notification title from API)
  notificationType: string; // تیتر اعلان (یادآوری, اخطار, etc.)
  status: string;
  sendType: string;
  teacherName: string;
  date: string;
}

export default function SentNotificationsPanel() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<SentNotification[]>([]);
  const [notificationTitles, setNotificationTitles] = useState<string[]>([
    "همه",
  ]);
  const [filters, setFilters] = useState<Filters>({
    notificationTitle: "همه",
    notificationType: "همه",
    status: "همه",
    sendType: "همه",
    teacherName: "",
    date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch sent notifications
        const sentNotificationsResult: SentNotificationsApiResponse =
          await getSentTeacherNotificationsV2(1, 1000);
        if (!sentNotificationsResult.error) {
          setNotifications(sentNotificationsResult.data);
        } else {
          throw new Error(sentNotificationsResult.message.join(", "));
        }

        // Fetch notification templates to get titles
        const notificationsResult: NotificationResponse =
          await getNotifications();
        if (!notificationsResult.error) {
          const titles = notificationsResult.data.map((n) => n.title);
          setNotificationTitles(["همه", ...titles]);
        }
      } catch {
        setError("خطا در دریافت اطلاعات");
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map sendType to Persian
  const mapSendType = (sendType: number): string => {
    switch (sendType) {
      case 0:
        return "ایمیل";
      case 1:
        return "اس ام اس";
      case 2:
        return "سیستمی";
      default:
        return "نامشخص";
    }
  };

  // Convert ISO date to Persian date (fallback to YYYY/MM/DD if Intl not available)
  const toPersianDate = (isoDate: string): string => {
    try {
      const date = new Date(isoDate);
      if (
        typeof Intl !== "undefined" &&
        Intl.DateTimeFormat &&
        Intl.DateTimeFormat.supportedLocalesOf("fa").length > 0
      ) {
        return new Intl.DateTimeFormat("fa-IR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
      }
      // fallback: just show YYYY/MM/DD
      return date.toISOString().slice(0, 10).replace(/-/g, "/");
    } catch {
      return isoDate;
    }
  };

  // Map notification title to type (یادآوری, اخطار, etc.)
  const getNotificationTypeFromTitle = (title: string): string => {
    // This is a simple heuristic - you might need to adjust based on actual titles
    if (title.includes("اخطار نهایی") || title.includes("قطعی"))
      return "اخطار نهایی";
    if (title.includes("اخطار")) return "اخطار";
    if (title.includes("پیشنهاد")) return "پیشنهاد";
    return "یادآوری";
  };

  // Apply filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Filter by notification title (عنوان)
      if (filters.notificationTitle !== "همه") {
        if (notif.title !== filters.notificationTitle) return false;
      }

      // Filter by notification type (تیتر اعلان)
      if (filters.notificationType !== "همه") {
        const notifType = getNotificationTypeFromTitle(notif.title);
        if (notifType !== filters.notificationType) return false;
      }

      // Filter by status
      if (filters.status !== "همه") {
        const notifStatus =
          notif.status.trim() === "Sent" ? "ارسال شد" : "ناموفق";
        if (notifStatus !== filters.status) return false;
      }

      // Filter by send type
      if (filters.sendType !== "همه") {
        const sendTypeText = mapSendType(notif.sendType);
        if (sendTypeText !== filters.sendType) return false;
      }

      // Filter by teacher name
      if (filters.teacherName) {
        if (
          !notif.teacherName
            .toLowerCase()
            .includes(filters.teacherName.toLowerCase())
        ) {
          return false;
        }
      }

      // Filter by date (Persian date format YYYY/MM/DD)
      if (filters.date) {
        // Convert notification date to YYYY/MM/DD format for comparison
        const notifDate = new Date(notif.sendAt).toISOString().split("T")[0];
        const filterDate = filters.date.replace(/\//g, "-");

        // Simple comparison - you might need to convert Persian calendar to Gregorian
        // For now, we'll just compare the formatted dates
        if (notifDate !== filterDate) return false;
      }

      return true;
    });
  }, [notifications, filters]);

  const handleResetFilters = () => {
    setFilters({
      notificationTitle: "همه",
      notificationType: "همه",
      status: "همه",
      sendType: "همه",
      teacherName: "",
      date: "",
    });
  };

  const currentNotifications = filteredNotifications;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-2 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          وضعیت اعلان‌ها
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-[15px] bg-white px-3 py-2 text-sm whitespace-nowrap text-gray-700 shadow-lg hover:bg-gray-50 sm:rounded-2xl sm:px-4 sm:text-base"
        >
          برگشت
        </button>
      </div>

      {/* Inline Filters */}
      <div>
        <div className="mr-10 grid items-center grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* عنوان (Notification Title) */}
          <div className="group relative">
            <MyDropdown
              options={notificationTitles}
              defaultOption="همه"
              value={filters.notificationTitle}
              onSelect={(value) => {
                if (typeof value === "string")
                  setFilters({ ...filters, notificationTitle: value });
              }}
              className="w-full"
            />
            <span className="absolute -top-3 right-4 bg-[#EBF2FA] px-1 text-xs text-gray-500">
              تیتر اعلان
            </span>
          </div>

          {/* تیتر اعلان (Notification Type) */}
          <div className="group relative">
            <MyDropdown
              options={["همه", "یادآوری", "اخطار", "اخطار نهایی", "پیشنهاد"]}
              defaultOption="همه"
              value={filters.notificationType}
              onSelect={(value) => {
                if (typeof value === "string")
                  setFilters({ ...filters, notificationType: value });
              }}
              className="w-full"
            />
            <span className="absolute -top-3 right-4 bg-[#EBF2FA] px-1 text-xs text-gray-500">
              نوع اعلان
            </span>
          </div>

          {/* وضعیت (Status) */}
          <div className="group relative">
            <MyDropdown
              options={["همه", "ارسال شد", "ناموفق"]}
              defaultOption="همه"
              value={filters.status}
              onSelect={(value) => {
                if (typeof value === "string")
                  setFilters({ ...filters, status: value });
              }}
              className="w-full"
            />
            <span className="absolute -top-3 right-4 bg-[#EBF2FA] px-1 text-xs text-gray-500">
              وضعیت
            </span>
          </div>

          {/* نوع ارسال (Send Type) */}
          <div className="group relative">
            <MyDropdown
              options={["همه", "ایمیل", "اس ام اس", "سیستمی"]}
              defaultOption="همه"
              value={filters.sendType}
              onSelect={(value) => {
                if (typeof value === "string")
                  setFilters({ ...filters, sendType: value });
              }}
              className="w-full"
            />
            <span className="absolute -top-3 right-4 bg-[#EBF2FA] px-1 text-xs text-gray-500">
              نوع ارسال
            </span>
          </div>

          {/* نام استاد (Teacher Name) */}
          <div className="group relative">
            <MyInput
              placeholder="نام استاد"
              value={filters.teacherName}
              onChange={(value) =>
                setFilters({ ...filters, teacherName: value })
              }
            />
            <span className="absolute -top-3 right-4 bg-[#EBF2FA] px-1 text-xs text-gray-500">
              نام استاد
            </span>
          </div>

          {/* تاریخ (Date) - Persian Date Picker */}
          <div className="flex items-center gap-2">
            <PersianDatePicker
              value={filters.date}
              onChange={(date) => setFilters({ ...filters, date })}
            />
            {filters.date && (
              <span className="text-xs text-gray-600">
                {filters.date
                  .replace(/0/g, "۰")
                  .replace(/1/g, "۱")
                  .replace(/2/g, "۲")
                  .replace(/3/g, "۳")
                  .replace(/4/g, "۴")
                  .replace(/5/g, "۵")
                  .replace(/6/g, "۶")
                  .replace(/7/g, "۷")
                  .replace(/8/g, "۸")
                  .replace(/9/g, "۹")}
              </span>
            )}
          </div>
        </div>

        {/* Reset Filters Button */}
        {(filters.notificationTitle !== "همه" ||
          filters.notificationType !== "همه" ||
          filters.status !== "همه" ||
          filters.sendType !== "همه" ||
          filters.teacherName ||
          filters.date) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="rounded-[15px] bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              پاک کردن همه فیلترها
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-3 sm:gap-4">
          {/* Table header - Hidden on mobile */}
          <div className="hidden grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-2 rounded-[15px] bg-gray-100 p-3 font-bold text-gray-700 sm:grid sm:gap-4 sm:p-4">
            <div className="text-right text-sm sm:text-base">عنوان</div>
            <div className="text-right text-sm sm:text-base">نام استاد</div>
            <div className="text-center text-sm sm:text-base">تاریخ ارسال</div>
            <div className="text-center text-sm sm:text-base">وضعیت</div>
            <div className="text-center text-sm sm:text-base">نوع ارسال</div>
          </div>

          {currentNotifications.map((notification, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-2 rounded-[15px] bg-white p-3 shadow sm:grid-cols-[2fr_2fr_1fr_1fr_1fr] sm:items-center sm:gap-4 sm:p-4"
            >
              {/* Mobile view - stacked */}
              <div className="text-right sm:hidden">
                <h3 className="text-sm font-semibold text-gray-800">
                  {notification.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {notification.teacherName}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {toPersianDate(notification.sendAt)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      notification.status.trim() === "Sent"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {notification.status.trim() === "Sent"
                      ? "ارسال شد"
                      : "ناموفق"}
                  </span>
                  <span className="text-xs text-gray-600">
                    {mapSendType(notification.sendType)}
                  </span>
                </div>
              </div>

              {/* Desktop view - row */}
              <div className="hidden text-right sm:block">
                <h3 className="font-semibold text-gray-800">
                  {notification.title}
                </h3>
              </div>
              <div className="hidden text-right text-black sm:block">
                {notification.teacherName}
              </div>
              <div className="hidden text-center text-black sm:block">
                {toPersianDate(notification.sendAt)}
              </div>
              <div className="hidden text-center sm:block">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    notification.status.trim() === "Sent"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {notification.status.trim() === "Sent"
                    ? "ارسال شد"
                    : "ناموفق"}
                </span>
              </div>
              <div className="hidden text-center text-gray-600 sm:block">
                {mapSendType(notification.sendType)}
              </div>
            </div>
          ))}

          {currentNotifications.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500 sm:text-base">
              هیچ اعلانی یافت نشد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

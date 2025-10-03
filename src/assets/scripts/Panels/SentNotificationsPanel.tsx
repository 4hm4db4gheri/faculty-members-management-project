import { useState, useEffect } from "react";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { getSentTeacherNotificationsV2 } from "../Services/apiEndpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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

export default function SentNotificationsPanel() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<SentNotification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const result: SentNotificationsApiResponse =
          await getSentTeacherNotificationsV2(1, 1000);
        if (!result.error) {
          setNotifications(result.data);
        } else {
          throw new Error(result.message.join(", "));
        }
      } catch {
        setError("خطا در دریافت اطلاعات");
        toast.error("خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
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

  const currentNotifications = notifications;

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
    <div className="flex h-full flex-col gap-5 p-4">
      {/* Header with back button and title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">وضعیت اعلان‌ها</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-2xl bg-white px-4 py-2 whitespace-nowrap text-gray-700 shadow-lg hover:bg-gray-50"
        >
          برگشت
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-4 rounded-[15px] bg-gray-100 p-4 font-bold text-gray-700">
            <div className="text-right">عنوان</div>
            <div className="text-right">نام استاد</div>
            <div className="text-center">تاریخ ارسال</div>
            <div className="text-center">وضعیت</div>
            <div className="text-center">نوع ارسال</div>
          </div>

          {currentNotifications.map((notification, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-4 rounded-[15px] bg-white p-4 shadow"
            >
              <div className="text-right">
                <h3 className="font-semibold text-gray-800">
                  {notification.title}
                </h3>
              </div>
              <div className="text-right text-black">
                {notification.teacherName}
              </div>
              <div className="text-center text-black">
                {toPersianDate(notification.sendAt)}
              </div>
              <div className="text-center">
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
              <div className="text-center text-gray-600">
                {mapSendType(notification.sendType)}
              </div>
            </div>
          ))}

          {currentNotifications.length === 0 && (
            <div className="text-center text-gray-500">هیچ اعلانی یافت نشد</div>
          )}
        </div>
      </div>
    </div>
  );
}

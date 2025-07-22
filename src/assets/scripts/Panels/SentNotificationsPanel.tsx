import { useState, useEffect } from "react";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { getSentTeacherNotifications } from "../Services/apiEndpoints";
import { toast } from "react-toastify";

interface SentNotification {
  id: number;
  title: string;
  sendType: number;
  notificationType: number;
}

interface SentNotificationsApiResponse {
  data: SentNotification[];
  totalCount: number;
  error: boolean;
  message: string[];
}

export default function SentNotificationsPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<SentNotification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = (await getSentTeacherNotifications(
          1,
          1000,
        )) as SentNotificationsApiResponse;
        if (!response.error) {
          setNotifications(response.data);
        } else {
          throw new Error(response.message.join(", "));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "خطا در دریافت اطلاعات";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const mapImportance = (notificationType: number): string => {
    return notificationType === 1 ? "فوری" : "عادی";
  };

  const mapSendType = (sendType: number): string => {
    switch (sendType) {
      case 0:
        return "سیستمی";
      case 1:
        return "دستی";
      case 2:
        return "زمان‌بندی‌شده";
      default:
        return "نامشخص";
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
      <h2 className="text-2xl font-bold text-gray-800">اعلان‌های ارسال شده</h2>
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4">
          {currentNotifications.map((notification) => (
            <div
              key={notification.id}
              className="grid grid-cols-[2fr_1fr_1fr] items-center gap-4 rounded-[15px] bg-white p-4 shadow"
            >
              <div className="text-right">
                <h3 className="font-semibold text-gray-800">
                  {notification.title}
                </h3>
              </div>
              <div className="text-center">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    mapImportance(notification.notificationType) === "فوری"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {mapImportance(notification.notificationType)}
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

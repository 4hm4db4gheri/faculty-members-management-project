import { useEffect, useState } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyNotificationCard, {
  Notification,
} from "../Elements/MyNotificationCard";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  changeNotificationStatus,
} from "../Services/apiEndpoints";
import { toast } from "react-toastify";

interface NotificationsPanelProps {
  onNotificationSelect: (notification: Notification) => void;
}

interface notificationModel {
  id: number;
  title: string;
  sendType: number;
  notificationType: number;
  isEnable: boolean;
}

interface notificationResponse {
  data: notificationModel[];
  error: boolean;
  message: string[];
}

export default function NotificationsPanel({
  onNotificationSelect,
}: NotificationsPanelProps) {
  const navigate = useNavigate();
  const [importance, setImportance] = useState("همه");
  const [, setSelectedNotification] = useState<Notification | null>(null);

  const importanceOptions = [
    "همه",
    "یادآوری",
    "اخطار",
    "اخطار نهایی",
    "پیشنهاد",
  ] as const;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setnotification] = useState<notificationModel[]>([]);

  // لغو ارسال نوتیف
  const handleToggleNotification = async (id: number, enabled: boolean) => {
    try {
      const response = await changeNotificationStatus(id, enabled);

      if (response.error) {
        const errorMessage = enabled
          ? "خطا در فعال‌سازی نوتیف"
          : "خطا در غیرفعال‌سازی نوتیف";
        toast.error(errorMessage, {
          position: "bottom-left",
          style: {
            background: "#FEF2F2",
            color: "#991B1B",
            direction: "rtl",
          },
        });
        throw new Error(errorMessage);
      }

      // Update the local notification state
      setnotification((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isEnable: enabled } : notif,
        ),
      );

      // Show success message from API response or default message
      const successMessage =
        response.data ||
        (enabled ? "اعلان با موفقیت فعال شد" : "اعلان با موفقیت غیرفعال شد");
      toast.success(successMessage, {
        position: "bottom-left",
        style: {
          background: "#F0FDF4",
          color: "#166534",
          direction: "rtl",
        },
      });
    } catch (err) {
      // Error toast already shown above, just update error state
      setError(err instanceof Error ? err.message : "خطا در تغییر وضعیت نوتیف");
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setIsLoading(true);
        const data: notificationResponse = await getNotifications();

        if (!data.error) {
          setnotification(data.data);
        } else {
          throw new Error(data.message.join(", "));
        }
      } catch {
        setError("خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotification();
  }, []);

  const labelClasses = `
    absolute
    -top-3.5
    right-4
    px-1
    text-sm
    text-gray-500
    transition-colors
    group-hover:text-gray-700
  `
    .trim()
    .replace(/\s+/g, " ");

  const dropdownContainerClasses = "relative w-1/3";
  const dropdownClasses = "w-full pt-2";

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center">
        <p className="text-lg font-semibold text-red-500">خطا: {error}</p>
      </div>
    );
  }

  const filteredNotifications = notification
    .filter((notif) => {
      const importanceMatches =
        importance === "همه" ||
        getNotificationType(notif.notificationType) === importance;

      // Note: Time filter removed as API no longer provides date information
      return importanceMatches;
    })
    .sort((a, b) => a.id - b.id);

  return (
    <div>
      {/* Filters */}
      <div className="mt-4 mb-8 flex justify-start gap-6 px-6">
        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={importanceOptions}
            defaultOption="همه"
            value={importance}
            onSelect={(value) => {
              if (typeof value === "string") {
                setImportance(value);
              }
            }}
            className={dropdownClasses}
          />
          <span className={labelClasses}>اهمیت</span>
        </div>
      </div>
      {/* Notifications List */}
      <div className="space-y-2.5 px-4">
        {filteredNotifications.map((notif) => (
          <MyNotificationCard
            key={notif.id}
            notification={notif}
            isEnabled={notif.isEnable}
            onToggleEnabled={handleToggleNotification}
            onClick={() => {
              const notification = {
                id: notif.id,
                title: notif.title,
                priority: (() => {
                  switch (notif.notificationType) {
                    case 0:
                      return "یادآوری";
                    case 1:
                      return "اخطار";
                    case 2:
                      return "اخطار نهایی";
                    case 3:
                      return "پیشنهاد";
                    default:
                      return "یادآوری";
                  }
                })(),
                tag: (() => {
                  switch (notif.notificationType) {
                    case 0:
                      return "blue";
                    case 1:
                      return "yellow";
                    case 2:
                      return "red";
                    case 3:
                      return "green";
                    default:
                      return "blue";
                  }
                })(),
              };
              setSelectedNotification(notification);
              onNotificationSelect(notification);
              navigate(`/dashboard/notifications/${notif.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getNotificationType(notificationType: number): string {
  switch (notificationType) {
    case 0:
      return "یادآوری";
    case 1:
      return "اخطار";
    case 2:
      return "اخطار نهایی";
    case 3:
      return "پیشنهاد";
    default:
      return "یادآوری";
  }
}

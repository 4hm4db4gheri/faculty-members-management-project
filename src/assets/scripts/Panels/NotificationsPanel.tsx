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

interface NotificationsPanelProps {
  onNotificationSelect: (notification: Notification) => void;
}

interface notificationModel {
  id: number;
  title: string;
  sendType: number;
  notificationType: number;
  beforeSendDay: string;
  enabled: boolean;
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
  const [time, setTime] = useState("همه");
  const [, setSelectedNotification] = useState<Notification | null>(null);

  const importanceOptions = [
    "همه",
    "یادآوری",
    "اخطار",
    "اخطار نهایی",
    "پیشنهاد",
  ] as const;
  const timeOptions = ["همه", "امروز", "این هفته"] as const;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setnotification] = useState<notificationModel[]>([]);
  const [disabledNotifications, setDisabledNotifications] = useState<
    Set<number>
  >(() => {
    const saved = localStorage.getItem("disabledNotifications");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // لغو ارسال نوتیف
  const handleToggleNotification = async (id: number, enabled: boolean) => {
    try {
      const response = await changeNotificationStatus(id, enabled);

      if (response.error) {
        throw new Error(
          enabled ? "خطا در فعال‌سازی نوتیف" : "خطا در غیرفعال‌سازی نوتیف",
        );
      }

      setDisabledNotifications((prev) => {
        const newSet = new Set(prev);
        if (enabled) {
          // If enabling, remove from disabled set
          newSet.delete(id);
        } else {
          // If disabling, add to disabled set
          newSet.add(id);
        }
        // ذخیره در localStorage
        localStorage.setItem(
          "disabledNotifications",
          JSON.stringify([...newSet]),
        );
        return newSet;
      });
    } catch (err) {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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

  const dropdownContainerClasses = "relative w-5/5";
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

  const filteredNotifications = notification.filter((notif) => {
    const importanceMatches =
      importance === "همه" ||
      getNotificationType(notif.notificationType) === importance;

    const timeMatches =
      time === "همه" || matchesTimeFilter(notif.beforeSendDay, time);

    return importanceMatches && timeMatches;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mt-4 mb-8 flex justify-center gap-6 px-6">
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

        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={timeOptions}
            defaultOption="همه"
            value={time}
            onSelect={(value) => {
              if (typeof value === "string") {
                setTime(value);
              }
            }}
            className={dropdownClasses}
          />
          <span className={labelClasses}>زمان</span>
        </div>
      </div>
      {/* Notifications List */}
      <div className="space-y-2.5 px-4">
        {filteredNotifications.map((notif) => (
          <MyNotificationCard
            key={notif.id}
            notification={notif}
            isEnabled={!disabledNotifications.has(notif.id)}
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

function matchesTimeFilter(dateString: string, timeFilter: string): boolean {
  const date = new Date(dateString);
  const now = new Date();

  switch (timeFilter) {
    case "امروز":
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    case "این هفته": {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return date >= startOfWeek && date <= now;
    }
    default:
      return true;
  }
}

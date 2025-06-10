import { useEffect, useState } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyNotificationCard, {
  Notification,
} from "../Elements/MyNotificationCard";
import LoadingSpinner from "../Elements/LoadingSpinner";
import NotificationDetail from "./NotificationDetail";

interface NotificationsPanelProps {
  onNotificationSelect: (notification: Notification) => void;
}

interface notificationModel {
  id: number;
  title: string;
  sendType: number;
  notificationType: number;
  beforeSendDay: string;
}

interface notificationResponse {
  data: notificationModel[];
  error: boolean;
  message: string[];
}

export default function NotificationsPanel({
  onNotificationSelect,
}: NotificationsPanelProps) {
  const [importance, setImportance] = useState("همه");
  const [time, setTime] = useState("همه");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

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

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://faculty.liara.run/api/panel/v1/notification/list",
          {
            headers: {
              accept: "text/plain",
            },
          },
        );

        if (!response.ok) {
          throw new Error("اشکال در دریافت اطلاعات اعلان ها");
        }

        const data: notificationResponse = await response.json();

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
            }}
          />
        ))}
      </div>
      {selectedNotification && (
        <NotificationDetail
          notificationId={selectedNotification.id}
          initialTitle={selectedNotification.title}
        />
      )}
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
    case "این هفته":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return date >= startOfWeek && date <= now;
    default:
      return true;
  }
}

import { useEffect, useState } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyNotificationCard, {
  Notification,
} from "../Elements/MyNotificationCard";
import LoadingSpinner from "../Elements/LoadingSpinner";
// import NotificationDetail from "../Elements/NotificationDetail"; // Import the NotificationDetail component

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
  const [subject, setSubject] = useState("همه");
  const [importance, setImportance] = useState("همه");
  const [time, setTime] = useState("همه");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null); // State to manage the selected notification

  // Remove "همه" from options since it will be the default
  const subjectOptions = ["مقاله", "قرارداد"] as const;
  const importanceOptions = ["فوری", "عادی"] as const;
  const timeOptions = ["امروز", "این هفته"] as const;
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

  // const notifications: Notification[] = [
  //   {
  //     id: 1,
  //     title: "دیر شدن تحویل مقاله",
  //     priority: "اخطار فوری",
  //     tag: "red",
  //   },
  //   {
  //     id: 2,
  //     title: "تبدیل وضعیت به پیمانی",
  //     priority: "یادآوری",
  //     tag: "blue",
  //   },
  //   {
  //     id: 3,
  //     title: "دیر شدن تحویل مقاله",
  //     priority: "اخطار",
  //     tag: "yellow",
  //   },
  //   {
  //     id: 4,
  //     title: "تمدید قرارداد",
  //     priority: "پیشنهاد",
  //     tag: "green",
  //   },
  // ];

  // Using template literals instead of clsx
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

  return (
    <div>
      {/* Filters */}
      <div className="mt-2 mb-9 flex justify-between gap-6 px-4">
        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={subjectOptions}
            defaultOption="همه"
            onSelect={setSubject}
            className={dropdownClasses}
          />
          <span className={labelClasses}>موضوع</span>
        </div>

        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={importanceOptions}
            defaultOption="همه"
            onSelect={setImportance}
            className={dropdownClasses}
          />
          <span className={labelClasses}>اهمیت</span>
        </div>

        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={timeOptions}
            defaultOption="همه"
            onSelect={setTime}
            className={dropdownClasses}
          />
          <span className={labelClasses}>زمان</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5 px-4">
        {notification.map((notification) => (
          <MyNotificationCard
            key={notification.id}
            notification={notification}
            onClick={onNotificationSelect}
          />
        ))}
      </div>

      {/* Notification Detail Component */}
      {selectedNotification && (
        <NotificationDetail
          selectedNotification={selectedNotification}
        />
      )}
    </div>
  );
}

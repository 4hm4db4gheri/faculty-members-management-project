import { useState } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyNotificationCard, {
  Notification,
} from "../Elements/MyNotificationCard";

interface NotificationsPanelProps {
  onNotificationSelect: (notification: Notification) => void;
}

export default function NotificationsPanel({
  onNotificationSelect,
}: NotificationsPanelProps) {
  const [subject, setSubject] = useState("همه");
  const [importance, setImportance] = useState("همه");
  const [time, setTime] = useState("همه");

  // Remove "همه" from options since it will be the default
  const subjectOptions = ["مقاله", "قرارداد"] as const;
  const importanceOptions = ["فوری", "عادی"] as const;
  const timeOptions = ["امروز", "این هفته"] as const;

  const notifications: Notification[] = [
    {
      id: 1,
      title: "دیر شدن تحویل مقاله",
      priority: "اخطار فوری",
      tag: "red",
    },
    {
      id: 2,
      title: "تبدیل وضعیت به پیمانی",
      priority: "یادآوری",
      tag: "blue",
    },
    {
      id: 3,
      title: "دیر شدن تحویل مقاله",
      priority: "اخطار",
      tag: "yellow",
    },
    {
      id: 4,
      title: "تمدید قرارداد",
      priority: "پیشنهاد",
      tag: "green",
    },
  ];

  // Using template literals instead of clsx
  const labelClasses = `
    absolute
    -top-1.5
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

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex justify-between gap-6 p-8">
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
      <div className="space-y-5">
        {notifications.map((notification) => (
          <MyNotificationCard
            key={notification.id}
            notification={notification}
            onClick={onNotificationSelect}
          />
        ))}
      </div>
    </div>
  );
}

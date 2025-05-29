import React, { useState } from "react";

interface Notification {
  id: number;
  title: string;
  priority: string;
  tag: string;
}

interface NotificationsPanelProps {
  onNotificationSelect: (notification: Notification) => void;
}

export default function NotificationsPanel({
  onNotificationSelect,
}: NotificationsPanelProps) {
  const [subject, setSubject] = useState("");
  const [importance, setImportance] = useState("");
  const [time, setTime] = useState("");

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
  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex gap-10 p-8">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-full bg-white px-6 py-4 text-gray-600"
          dir="rtl"
        >
          <option value="" disabled>
            موضوع
          </option>
          <option value="all">همه</option>
          <option value="article">مقاله</option>
          <option value="contract">قرارداد</option>
        </select>

        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value)}
          className="w-full rounded-full bg-white px-6 py-2 text-gray-600"
          dir="rtl"
        >
          <option value="" disabled>
            اهمیت
          </option>
          <option value="all">همه</option>
          <option value="urgent">فوری</option>
          <option value="normal">عادی</option>
        </select>

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-full bg-white px-6 py-2 text-gray-600"
          dir="rtl"
        >
          <option value="" disabled>
            زمان
          </option>
          <option value="all">همه</option>
          <option value="today">امروز</option>
          <option value="week">این هفته</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-5">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex cursor-pointer items-center gap-5 rounded-2xl bg-white p-4 transition-colors hover:bg-gray-50"
            onClick={() => onNotificationSelect(notification)}
          >
            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  notification.tag === "red"
                    ? "bg-red-100 text-red-600"
                    : notification.tag === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : notification.tag === "yellow"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                }`}
              >
                {notification.priority}
              </span>
              {/* <span className="text-gray-600">{notification.time}</span> */}
            </div>
            <span className="text-gray-800">{notification.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

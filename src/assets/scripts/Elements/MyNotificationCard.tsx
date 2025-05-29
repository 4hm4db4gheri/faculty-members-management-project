export interface Notification {
  id: number;
  title: string;
  priority: string;
  tag: string;
  subject?: string;
  sendMethod?: string;
  sendDate?: string;
  description?: string;
}

interface MyNotificationCardProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export default function MyNotificationCard({
  notification,
  onClick,
}: MyNotificationCardProps) {
  const getTagStyles = (tag: string) => {
    const styles =
      {
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
        green: "bg-green-100 text-green-600",
      }[tag] || "bg-gray-100 text-gray-600";

    return styles;
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-5 rounded-2xl bg-white p-4 transition-colors hover:bg-gray-50"
      onClick={() => onClick(notification)}
    >
      <div className="flex items-center gap-4">
        <span
          className={`rounded-full px-3 py-1 text-sm ${getTagStyles(notification.tag)}`}
        >
          {notification.priority}
        </span>
      </div>
      <span className="text-gray-800">{notification.title}</span>
    </div>
  );
}

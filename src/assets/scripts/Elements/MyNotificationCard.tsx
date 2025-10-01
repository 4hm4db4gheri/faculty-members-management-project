// import MyNotificatinPanel, {
//   notificationModel,
// } from "./script/Panels/MyNotificatinPanel";

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

interface notificationModel {
  id: number;
  title: string;
  sendType: number;
  notificationType: number;
  beforeSendDay: string;
}

interface MyNotificationCardProps {
  notification: notificationModel;
  onClick: (notification: Notification) => void;
  isEnabled: boolean;
  onToggleEnabled: (id: number, enabled: boolean) => void;
}

export default function MyNotificationCard({
  notification,
  onClick,
  isEnabled,
  onToggleEnabled,
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
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 transition-colors hover:bg-gray-50">
      {/* Switch Toggle - iPhone Style */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleEnabled(notification.id, !isEnabled);
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none ${
          isEnabled
            ? "bg-green-500 focus:ring-green-500"
            : "bg-gray-300 focus:ring-gray-400"
        }`}
        role="switch"
        aria-checked={isEnabled}
        aria-label={`Toggle notification ${notification.title}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
            isEnabled ? "-translate-x-5.5" : "-translate-x-0.5"
          }`}
        />
      </button>
      <div
        className="flex flex-1 cursor-pointer items-center gap-3"
        onClick={() =>
          onClick({
            id: notification.id,
            title: notification.title,
            priority: "", // Provide appropriate value if available
            tag: getTypeColor(notification.notificationType),
            subject: undefined,
            sendMethod: undefined,
            sendDate: undefined,
            description: undefined,
          })
        }
      >
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${getTagStyles(
              getTypeColor(notification.notificationType),
            )}`}
          >
            {getTypeName(notification.notificationType)}
          </span>
        </div>
        <span className="text-sm text-gray-800">{notification.title}</span>
      </div>
    </div>
  );
}

// Helper function to map notificationType to color string
function getTypeColor(type: number): string {
  switch (type) {
    case 0:
      return "blue";
    case 1:
      return "yellow";
    case 2:
      return "red";
    case 3:
      return "green";
    default:
      return "gray";
  }
}
function getTypeName(type: number): string {
  switch (type) {
    case 0:
      return "یادآوری";
    case 1:
      return "اخطار";
    case 2:
      return "اخطار نهایی";
    case 3:
      return "پیشنهاد";
    default:
      return "gray";
  }
}

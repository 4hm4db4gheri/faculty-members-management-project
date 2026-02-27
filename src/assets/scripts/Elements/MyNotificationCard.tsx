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
  isEnable: boolean;
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
    <div className="flex min-h-[auto] items-center gap-2 rounded-xl bg-white px-3 py-2 transition-colors hover:bg-gray-50 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-2.5 lg:gap-3 lg:rounded-2xl lg:px-4 lg:py-2.5">
      {/* Switch Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleEnabled(notification.id, !isEnabled);
        }}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none sm:h-6 sm:w-11 lg:h-6 lg:w-11 ${
          isEnabled ? "bg-green-500 focus:ring-green-500" : "bg-gray-300 focus:ring-gray-400"
        }`}
        role="switch"
        aria-checked={isEnabled}
        aria-label={`Toggle notification ${notification.title}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out sm:h-5 sm:w-5 ${
            isEnabled ? "-translate-x-4.5 sm:-translate-x-5.5" : "-translate-x-0.5"
          }`}
        />
      </button>
      <div
        className="flex flex-1 cursor-pointer items-center gap-2 overflow-hidden sm:gap-3"
        onClick={() =>
          onClick({
            id: notification.id,
            title: notification.title,
            priority: "",
            tag: getTypeColor(notification.notificationType),
            subject: undefined,
            sendMethod: undefined,
            sendDate: undefined,
            description: undefined,
          })
        }
      >
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <span
            className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] sm:px-2 sm:text-xs ${getTagStyles(getTypeColor(notification.notificationType))}`}
          >
            {getTypeName(notification.notificationType)}
          </span>
        </div>
        <span className="truncate text-xs text-gray-800 sm:text-sm lg:text-sm">{notification.title}</span>
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

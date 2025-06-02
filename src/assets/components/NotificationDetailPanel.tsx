interface NotificationDetailPanelProps {
  notification: {
    id: number;
    title: string;
    content: string;
    date: string;
  };
  onBack: () => void;
}

export default function NotificationDetailPanel({ notification, onBack }: NotificationDetailPanelProps) {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <button
        onClick={onBack}
        className="mb-4 w-fit rounded-lg bg-[#3388BC] px-4 py-2 text-white hover:bg-[#1B4965]"
      >
        بازگشت
      </button>
      
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-[#1B4965]">{notification.title}</h2>
        <div className="mb-4 text-gray-600">{notification.date}</div>
        <div className="text-gray-800">{notification.content}</div>
      </div>
    </div>
  );
}
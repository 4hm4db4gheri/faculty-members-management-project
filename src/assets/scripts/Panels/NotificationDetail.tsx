import { useState, useEffect } from "react";
import MyDropdown from "../Elements/MyDropdown";
import { useParams } from "react-router-dom"; // Import useParams
import { Notification } from "../Elements/MyNotificationCard"; // Import Notification type
import LoadingSpinner from "../Elements/LoadingSpinner";

interface NotificationDetailProps {
  // notification: Notification; // No longer needed as prop
  onBack: () => void; // Add onBack prop for navigation
}

// Assume you have mock notifications or fetch from an API
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "دیر شدن تحویل مقاله",
    priority: "اخطار فوری",
    tag: "red",
    subject: "مقاله",
    sendMethod: "ایمیل",
    sendDate: "آنی",
    description: "شرح دیرکرد تحویل مقاله.",
  },
  {
    id: 2,
    title: "تبدیل وضعیت به پیمانی",
    priority: "یادآوری",
    tag: "blue",
    subject: "قرارداد",
    sendMethod: "پیامک",
    sendDate: "زمانبندی شده",
    description: "یادآوری برای تبدیل وضعیت به پیمانی.",
  },
  {
    id: 3,
    title: "دیر شدن تحویل مقاله",
    priority: "اخطار",
    tag: "yellow",
    subject: "مقاله",
    sendMethod: "هر دو",
    sendDate: "آنی",
    description: "اخطار ثانویه برای دیرکرد مقاله.",
  },
  {
    id: 4,
    title: "تمدید قرارداد",
    priority: "پیشنهاد",
    tag: "green",
    subject: "قرارداد",
    sendMethod: "ایمیل",
    sendDate: "زمانبندی شده",
    description: "پیشنهاد تمدید قرارداد سالانه.",
  },
];

export default function NotificationDetail({
  onBack,
}: NotificationDetailProps) {
  const { notificationId } = useParams<{ notificationId: string }>(); // Get notificationId from URL
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (notificationId) {
      const foundNotification = mockNotifications.find(
        (n) => n.id === parseInt(notificationId),
      );
      setNotification(foundNotification || null);
    }
  }, [notificationId]);

  const [formData, setFormData] = useState<NotificationForm>({
    subject: "",
    sendMethod: "",
    sendDate: "",
    description: "",
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        subject: notification.subject || "",
        sendMethod: notification.sendMethod || "",
        sendDate: notification.sendDate || "",
        description: notification.description || "",
      });
    }
  }, [notification]);

  const subjectOptions = ["دانشگاهی", "پژوهشی", "اداری"] as const;
  const sendMethodOptions = ["ایمیل", "پیامک", "هر دو"] as const;
  const sendDateOptions = ["آنی", "زمانبندی شده"] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the updated data to your backend
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

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

  const dropdownContainerClasses = "relative w-full";
  const dropdownClasses = "w-full pt-2";

  if (!notification) {
    return <LoadingSpinner text="در حال بارگذاری اطلاعات اعلان..." />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative min-h-screen space-y-7 p-4 text-right text-gray-900"
    >
      {/* Subject dropdown */}
      <div className={dropdownContainerClasses}>
        <MyDropdown
          options={subjectOptions}
          defaultOption={formData.subject || "موضوع"} // Use formData
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, subject: value }))
          }
          className={dropdownClasses}
        />
        <span className={labelClasses}>موضوع</span>
      </div>

      {/* Send method and date container */}
      <div className="flex justify-between gap-4">
        {/* Send method dropdown */}
        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={sendMethodOptions}
            defaultOption={formData.sendMethod || "نحوه ارسال"} // Use formData
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, sendMethod: value }))
            }
            className={dropdownClasses}
          />
          <span className={labelClasses}>نحوه ارسال</span>
        </div>

        {/* Send date dropdown */}
        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={sendDateOptions}
            defaultOption={formData.sendDate || "موعد ارسال"} // Use formData
            onSelect={(value) =>
              setFormData((prev) => ({ ...prev, sendDate: value }))
            }
            className={dropdownClasses}
          />
          <span className={labelClasses}>موعد ارسال</span>
        </div>
      </div>

      {/* Description textarea */}
      <div>
        <textarea
          name="description"
          placeholder="شرح اعلان"
          value={formData.description}
          onChange={handleDescriptionChange}
          rows={12}
          dir="rtl"
          className="h-full w-full resize-none rounded-2xl bg-white p-4 text-gray-900"
        />
      </div>

      {/* Submit button */}
      <div className="absolute right-0 bottom-30 left-0 flex justify-center">
        <button
          type="submit"
          className="rounded-2xl bg-[#3388BC] px-6 py-2 text-white transition-colors hover:bg-[#1B4965]"
        >
          اعمال تغییرات
        </button>
      </div>
      <button
        onClick={onBack}
        className="absolute top-4 left-4 rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        بازگشت
      </button>
    </form>
  );
}

// Add the NotificationForm interface here or import it from a shared types file
interface NotificationForm {
  subject: string;
  sendMethod: string;
  sendDate: string;
  description: string;
}

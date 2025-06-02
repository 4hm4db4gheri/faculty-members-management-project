// Import useState and useEffect hooks from React
import { useState, useEffect } from "react";
import MyDropdown from "../Elements/MyDropdown";

// Define TypeScript interfaces for component props and API response
interface NotificationDetailProps {
  notificationId?: number; // Optional notification ID prop
}

interface NotificationResponse {
  data: {
    id: number;
    title: string;
    sendType: number;
    notificationType: number;
    beforeSendDay: string;
    description?: string;
  };
  error: boolean;
  message: string[];
}

// Define TypeScript interface for form data structure
interface NotificationForm {
  subject: string; // موضوع
  sendMethod: string; // نحوه ارسال
  sendDate: string; // موعد ارسال
  description: string; // شرح اعلان
}

// Define main component
export default function NotificationDetail({
  notificationId,
}: NotificationDetailProps) {
  // Initialize form state using useState hook
  const [formData, setFormData] = useState<NotificationForm>({
    subject: "",
    sendMethod: "",
    sendDate: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch notification details effect
  useEffect(() => {
    const fetchNotificationDetails = async () => {
      if (!notificationId) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://faculty.liara.run/api/panel/v1/notification/get?Id=${notificationId}`,
          {
            headers: {
              accept: "text/plain",
            },
          },
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات اعلان");
        }

        const data: NotificationResponse = await response.json();

        if (!data.error && data.data) {
          setFormData({
            subject: data.data.title || "",
            sendMethod: getSendMethod(data.data.sendType),
            sendDate: getDateType(data.data.beforeSendDay),
            description: data.data.description || "",
          });
        } else {
          throw new Error(data.message?.join(", ") || "خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationDetails();
  }, [notificationId]);
  // Map sendType number to string
  const getSendMethod = (sendType: number): string => {
    switch (sendType) {
      case 0:
        return "پیامک";
      case 1:
        return "ایمیل";
      case 2:
        return "پیامک و ایمیل";
      default:
        return "";
    }
  };

  // Determine date type string based on beforeSendDay value
  const getDateType = (beforeSendDay: string): string => {
    return beforeSendDay ? "زمانبندی شده" : "آنی";
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Form submitted:", formData); // Log form data
  };

  // Handle textarea changes
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  // Add handler for subject input change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      subject: e.target.value,
    }));
  };

  const labelClasses = `
    absolute
    -top-4
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

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1B4965] border-t-transparent"></div>
          <span className="text-lg font-medium text-[#1B4965]">
            در حال بارگذاری...
          </span>
        </div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  // Component JSX
  return (
    <form
      onSubmit={handleSubmit}
      className="relative min-h-screen space-y-7 p-4 text-right text-gray-900"
    >
      {/* Subject input - replacing dropdown */}
      <div className="relative w-full">
        <input
          type="text"
          value={formData.subject}
          onChange={handleSubjectChange}
          className="mt-2 h-10 w-full rounded-4xl bg-white p-2 pt-4 text-right"
          // className="absolute -top-3 right-4 bg-white px-2 text-sm text-gray-600"
        />
        <span className={labelClasses}>موضوع</span>
      </div>

      {/* Send method and date container */}
      <div className="flex justify-between gap-4">
        {" "}
        {/* Send method dropdown */}
        <div className={dropdownContainerClasses}>
          <MyDropdown
            options={["پیامک", "ایمیل", "پیامک و ایمیل"]}
            defaultOption="نحوه ارسال"
            value={formData.sendMethod}
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
            options={["آنی", "زمانبندی شده"]}
            defaultOption="موعد ارسال"
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
    </form>
  );
}

// Import necessary hooks and components
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyDropdown from "../Elements/MyDropdown";
import { toast } from "react-toastify";
import { ApiService } from "../Services/ApiService";
import LoadingSpinner from "../Elements/LoadingSpinner";

// Define TypeScript interface for form data structure
interface NotificationForm {
  subject: string; // موضوع
  sendMethod: string; // نحوه ارسال
  sendDate: string; // موعد ارسال
  description: string; // شرح اعلان
}

// Define TypeScript interface for API response structure
interface ApiResponse {
  data: NotificationForm;
  error: boolean;
  message: string[];
}

// Define main component
export default function NotificationDetail() {
  const { notificationId } = useParams(); // Get notification ID from URL parameters
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Initialize form state using useState hook
  const [formData, setFormData] = useState<NotificationForm>({
    subject: "",
    sendMethod: "",
    sendDate: "",
    description: "",
  });

  // Define dropdown options
  const subjectOptions = ["دانشگاهی", "پژوهشی", "اداری"] as const;

  const sendMethodOptions = ["ایمیل", "پیامک", "هر دو"] as const;

  const sendDateOptions = ["آنی", "زمانبندی شده"] as const;

  // Fetch notification details on component mount
  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.get<ApiResponse>(
          `/panel/v1/notification/${notificationId}`,
        );

        if (!response.error) {
          setFormData(response.data);
        } else {
          throw new Error(response.message.join(", "));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "خطا در دریافت اطلاعات اعلان";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (notificationId) {
      fetchNotificationDetails();
    }
  }, [notificationId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiService.post<ApiResponse>(
        `/panel/v1/notification/${notificationId}/update`,
        formData,
      );

      if (!response.error) {
        toast.success("اعلان با موفقیت به‌روزرسانی شد");
      } else {
        throw new Error(response.message.join(", "));
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "خطا در به‌روزرسانی اعلان",
      );
    }
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

  const dropdownContainerClasses = "relative w-full";
  const dropdownClasses = "w-full pt-2";

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error message if there was an error fetching data
  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // Component JSX
  return (
    <form
      onSubmit={handleSubmit}
      className="relative min-h-screen space-y-7 p-4 text-right text-gray-900"
    >
      {/* Subject dropdown */}
      <div className={dropdownContainerClasses}>
        <MyDropdown
          options={subjectOptions}
          defaultOption="موضوع"
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
            defaultOption="نحوه ارسال"
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

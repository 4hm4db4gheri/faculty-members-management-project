import { useState, useEffect } from "react";
import MyDropdown from "../Elements/MyDropdown";
import LoadingSpinner from "../Elements/LoadingSpinner";
import { toast } from "react-toastify"; // Import toast

interface NotificationDetailProps {
  notificationId?: number;
  initialTitle?: string;
}

interface NotificationResponse {
  data?: {
    id: number;
    title: string;
    sendType: number;
    notificationType: number;
    beforeSendDay: string;
    description?: string;
    message?: string;
  };
  error: boolean;
  message: string[];
  status?: number;
}

interface UpdateNotificationRequest {
  id?: number;
  title: string;
  sendType: number;
  notificationType: number;
  beforeSendDay: string;
  description: string;
  message?: string;
}


interface NotificationForm {
  subject: string;
  sendMethod: string;
  sendDate: string[];
  description: string;
}

export default function NotificationDetail({
  notificationId,
  initialTitle,
}: NotificationDetailProps) {
  const [formData, setFormData] = useState<NotificationForm>({
    subject: initialTitle || "",
    sendMethod: "",
    sendDate: [],
    description: "",
  });

  // Update formData when initialTitle changes
  useEffect(() => {
    if (initialTitle) {
      setFormData((prev) => ({
        ...prev,
        subject: initialTitle,
      }));
    }
  }, [initialTitle]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      if (!notificationId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://faculty.liara.run/api/panel/v1/notification/get?Id=${notificationId}`,
          {
            headers: {
              accept: "text/plain",
            },
          },
        );
        const data: NotificationResponse = await response.json();
        console.log("Response Data:", data); // برای دیباگ


        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات اعلان");
        }

        if (!data.error && data.data) {
          setFormData({
            subject: data.data.title || "",
            sendMethod: getSendMethod(data.data.sendType),
            sendDate: getDateType(data.data.beforeSendDay),
            description: data.data.message || data.message?.join("\n") || "",
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

  const getDateType = (beforeSendDay: string): string[] => {
    try {
      const days = JSON.parse(beforeSendDay);
      if (Array.isArray(days)) {
        return days.sort((a, b) => a - b).map((day) => `${day} روز قبل`);
      }
      return [];
    } catch {
      return [];
    }
  };

  const getDateValues = (displayDates: string[]): number[] => {
    return displayDates
      .map((date) => parseInt(date.split(" ")[0]))
      .filter((num) => !isNaN(num))
      .sort((a, b) => a - b);

  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.subject.trim()) {
        throw new Error("موضوع نمی‌تواند خالی باشد");
      }

      if (!formData.sendMethod) {
        throw new Error("لطفاً نحوه ارسال را انتخاب کنید");
      }

      if (formData.sendDate.length === 0) {
        throw new Error("لطفاً موعد ارسال را انتخاب کنید");
      }

      const sendType = {
        پیامک: 0,
        ایمیل: 1,
        "پیامک و ایمیل": 2,
      }[formData.sendMethod];

      if (sendType === undefined) {
        throw new Error("نحوه ارسال نامعتبر است");
      }

      const sendDays = getDateValues(formData.sendDate);
      if (sendDays.length === 0) {
        throw new Error("موعد ارسال نامعتبر است");
      }
      const requestBody: UpdateNotificationRequest = {
        id: notificationId,
        title: formData.subject.trim(),
        sendType,
        notificationType: 0,
        beforeSendDay: JSON.stringify(sendDays),
        description: formData.description.trim(),
        message: formData.description.trim(), // ارسال متن شرح اعلان به عنوان پیام
      };
      console.log("Sending update request:", requestBody);
      const queryParams = new URLSearchParams({
        Id: notificationId?.toString() || "",
        Message: formData.description.trim(),
        SendType: sendType.toString(),
        BeforeSendDay: JSON.stringify(sendDays),
      });

      const response = await fetch(
        `https://faculty.liara.run/api/panel/v1/notification/update?${queryParams.toString()}`,
        {
          method: "PUT",
          headers: {
            accept: "text/plain",
          },
        },
      );

      let responseData: NotificationResponse;
      try {
        responseData = await response.json();
        console.log("Server response:", responseData);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("خطا در پردازش پاسخ سرور");
      }

      if (!response.ok) {
        throw new Error(response.statusText || "خطا در ارتباط با سرور");
      }
      if (responseData.error) {
        const errorMessage =
          responseData.message && Array.isArray(responseData.message)
            ? responseData.message.join("، ")
            : "خطا در بروزرسانی اعلان";
        throw new Error(errorMessage);
      }

      // Success case
      alert("اعلان با موفقیت بروزرسانی شد");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError(
        error instanceof Error ? error.message : "خطا در بروزرسانی اعلان",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative min-h-screen space-y-7 p-4 text-right"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">
          {error}
        </div>
      )}{" "}
      <div className="relative w-full">
        <input
          type="text"
          value={formData.subject}
          readOnly
          disabled
          placeholder="موضوع"
          className="mt-2 h-10 w-full cursor-not-allowed rounded-[25px] bg-white px-3 text-right text-gray-700"
        />
      </div>
      <div className="flex justify-between gap-4">
        <div className="relative w-full">
          <MyDropdown
            options={["پیامک", "ایمیل", "پیامک و ایمیل"]}
            defaultOption="نحوه ارسال"
            value={formData.sendMethod}
            onSelect={(value) => {
              if (typeof value === "string") {
                setFormData((prev) => ({ ...prev, sendMethod: value }));
              }
            }}
          />
        </div>

        <div className="relative w-full">
          <MyDropdown
            options={["1 روز قبل", "7 روز قبل", "30 روز قبل"]}
            defaultOption="موعد ارسال"
            value={formData.sendDate}
            multiSelect={true}
            onSelect={(values) => {
              if (Array.isArray(values)) {
                setFormData((prev) => ({ ...prev, sendDate: values }));
              }
            }}
          />
        </div>
      </div>
      <div>
        <textarea
          name="description"
          placeholder="شرح اعلان"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={12}
          dir="rtl"
          className="h-full w-full resize-none rounded-[25px] bg-white p-4 text-black"
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center gap-2 rounded-[25px] px-6 py-2 text-white transition-colors ${
            isSubmitting
              ? "cursor-not-allowed bg-gray-400"
              : "bg-[#3388BC] hover:bg-[#1B4965]"
          }`}
        >
          {isSubmitting && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {isSubmitting ? "در حال ارسال..." : "اعمال تغییرات"}
        </button>
      </div>
    </form>
  );
}

import { useState } from "react";
import { createNotification } from "../Services/apiEndpoints";
import { toast } from "react-toastify";

interface NotificationForm {
  subject: string;
  sendMethod: string;
  sendDate: string;
  description: string;
  [key: string]: string; // Index signature to match CreateNotificationRequest
}

interface ApiResponse {
  data?: unknown;
  error: boolean;
  message?: string[];
}

export default function NotificationManagementPanel() {
  const [formData, setFormData] = useState<NotificationForm>({
    subject: "",
    sendMethod: "",
    sendDate: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createNotification(formData) as unknown as ApiResponse;

      if (!response.error) {
        toast.success("اعلان با موفقیت ایجاد شد");
        setFormData({
          subject: "",
          sendMethod: "",
          sendDate: "",
          description: "",
        });
      } else {
        throw new Error(response.message?.join(", ") || "خطای نامشخص");
      }
    } catch (err) {
      toast.error("خطا در ایجاد اعلان");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex h-full min-h-screen flex-col rounded-lg bg-[#EBF2FA] p-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        <div className="flex flex-col space-y-2">
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="rounded-2xl bg-white p-2"
          >
            <option className="text-gray-500" value="" disabled>
              موضوع
            </option>
            <option value="academic">دانشگاهی</option>
            <option value="research">پژوهشی</option>
            <option value="administrative">اداری</option>
          </select>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <select
              name="sendMethod"
              value={formData.sendMethod}
              onChange={handleChange}
              className="w-full rounded-2xl bg-white p-2"
            >
              <option className="text-gray-500" value="" disabled>
                نحوه ارسال
              </option>

              <option value="email">ایمیل</option>
              <option value="sms">پیامک</option>
              <option value="both">هر دو</option>
            </select>
          </div>

          <div className="flex-1">
            <select
              name="sendDate"
              value={formData.sendDate}
              onChange={handleChange}
              className="w-full rounded-2xl bg-white p-2"
            >
              <option className="text-gray-500" value="" disabled>
                موعد ارسال{" "}
              </option>
              <option value="immediate">آنی</option>
              <option value="scheduled">زمانبندی شده</option>
            </select>
          </div>
        </div>

        <div>
          <textarea
            placeholder="شرح اعلان"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full resize-none rounded-2xl bg-white p-2"
            dir="rtl"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-2xl bg-[#3388BC] px-6 py-2 text-white transition-colors hover:bg-[#1B4965]"
          >
            اعمال تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}

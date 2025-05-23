// Import useState hook from React
import { useState } from "react";

// Define TypeScript interface for form data structure
interface NotificationForm {
  subject: string;      // موضوع
  sendMethod: string;   // نحوه ارسال
  sendDate: string;     // موعد ارسال
  description: string;  // شرح اعلان
}

// Define main component
export default function NotificationPanel() {
  // Initialize form state using useState hook
  const [formData, setFormData] = useState<NotificationForm>({
    subject: "",
    sendMethod: "",
    sendDate: "",
    description: "",
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission
    console.log("Form submitted:", formData);  // Log form data
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;  // Get input name and value
    setFormData((prev) => ({           // Update form state
      ...prev,                         // Keep existing values
      [name]: value,                   // Update changed field
    }));
  };

  // Component JSX
  return (
    <form onSubmit={handleSubmit} className="relative min-h-screen space-y-7 p-4 text-right text-gray-900">
      {/* Subject dropdown */}
      <div className="flex flex-col space-y-2">
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="rounded-2xl bg-white py-3 px-5 text-gray-900 rtl"
          dir="rtl"
        >
          <option value="" disabled>موضوع</option>
          <option value="academic">دانشگاهی</option>
          <option value="research">پژوهشی</option>
          <option value="administrative">اداری</option>
        </select>
      </div>
        

      {/* Send method and date container */}
      <div className="flex justify-between gap-4">
        {/* Send method dropdown */}
        <div className="flex-1">
          <select 
            name="sendMethod"
            value={formData.sendMethod}
            onChange={handleChange}
            className="w-full rounded-2xl bg-white py-3 px-5 text-gray-900"
          >
            <option value="" disabled>نحوه ارسال</option>
            <option value="email">ایمیل</option>
            <option value="sms">پیامک</option>
            <option value="both">هر دو</option>
          </select>
        </div>

        {/* Send date dropdown */}
        <div className="flex-1">
          <select 
            name="sendDate"
            value={formData.sendDate}
            onChange={handleChange}
            className="w-full rounded-2xl bg-white py-3 px-5 text-gray-900"
          >
            <option value="" disabled>موعد ارسال</option>
            <option value="immediate">آنی</option>
            <option value="scheduled">زمانبندی شده</option>
          </select>
        </div>
      </div>

      {/* Description textarea */}
      <div >
        <textarea
          name="description"
          placeholder="شرح اعلان"
          value={formData.description}
          onChange={handleChange}
          rows={12}
          dir="rtl"
          className="w-full h-full resize-none rounded-2xl bg-white p-4 text-gray-900"
        />
      </div>

      {/* Submit button */}
      <div className="absolute bottom-30 left-0 right-0 flex justify-center">
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
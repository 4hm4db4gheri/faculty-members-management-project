// Import useState hook from React
import { useState } from "react";
import MyDropdown from "../Elements/MyDropdown";
import { toast } from "react-toastify"; // Import toast

// Define TypeScript interface for form data structure
interface NotificationForm {
  subject: string; // موضوع
  sendMethod: string; // نحوه ارسال
  sendDate: string; // موعد ارسال
  description: string; // شرح اعلان
}

// Define main component
export default function NotificationPanel() {
  // Renamed to NotificationDetail for consistency
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Form submitted:", formData); // Log form data
    // You would typically send this data to your API here
    toast.success("اعلان با موفقیت ارسال شد!"); // Success toast
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

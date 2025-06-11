import { useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import MyInput from "./MyInput";
import { ApiService } from "../Services/ApiService";

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ApiResponse {
  error: boolean;
  message: string[];
  data: any;
}

export default function CreateUserForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    hasFullAccess: false,
  });

  // Create wrapper functions to handle password and phone number inputs
  const handlePasswordInput = (
    value: string,
    field: "password" | "confirmPassword",
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhoneInput = (value: string) => {
    // Only allow numbers and limit to 11 digits
    const phoneNumber = value.replace(/\D/g, "").slice(0, 11);
    setFormData({ ...formData, phoneNumber });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند", {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          direction: "rtl",
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.post<ApiResponse>(
        "/panel/v1/user/create",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          hasFullAccess: formData.hasFullAccess,
        }
      );

      if (!response.error) {
        toast.success("کاربر با موفقیت ایجاد شد", {
          duration: 4000,
          position: "bottom-center",
          style: {
            background: "#F0FDF4",
            color: "#166534",
            direction: "rtl",
          },
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(response.message.join(", "));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "خطا در ایجاد کاربر",
        {
          duration: 4000,
          position: "bottom-center",
          style: {
            background: "#FEF2F2",
            color: "#991B1B",
            direction: "rtl",
          },
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#282828] opacity-50"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 top-1/2 z-50 mx-auto w-full max-w-md -translate-y-1/2 transform rounded-[25px] bg-[#EBF2FA] p-6 shadow-xl">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
          افزودن کاربر جدید
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MyInput
            placeholder="نام"
            value={formData.firstName}
            onChange={(value) => setFormData({ ...formData, firstName: value })}
          />
          <MyInput
            placeholder="نام خانوادگی"
            value={formData.lastName}
            onChange={(value) => setFormData({ ...formData, lastName: value })}
          />
          <MyInput
            placeholder="نام کاربری"
            value={formData.username}
            onChange={(value) => setFormData({ ...formData, username: value })}
          />
          <MyInput
            placeholder="رمز عبور"
            value={formData.password}
            onChange={(value) => handlePasswordInput(value, "password")}
            className="[-webkit-text-security:disc] [text-security:disc]"
          />
          <MyInput
            placeholder="تکرار رمز عبور"
            value={formData.confirmPassword}
            onChange={(value) => handlePasswordInput(value, "confirmPassword")}
            className="[-webkit-text-security:disc] [text-security:disc]"
          />
          <MyInput
            placeholder="شماره تلفن (مثال: 09123456789)"
            value={formData.phoneNumber}
            onChange={handlePhoneInput}
          />
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
            <input
              type="checkbox"
              checked={formData.hasFullAccess}
              onChange={(e) =>
                setFormData({ ...formData, hasFullAccess: e.target.checked })
              }
              className="h-6 w-6 rounded-md border-2 border-blue-500 bg-white checked:bg-blue-500 hover:border-blue-600"
              id="fullAccess"
            />
            <label
              htmlFor="fullAccess"
              className="text-lg font-medium text-gray-700 select-none hover:text-gray-900"
            >
              دسترسی کامل (ادمین کل)
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[25px] bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center rounded-[25px] bg-[#3388BC] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2D769F] disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" showText={false} />
              ) : (
                "ایجاد کاربر"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

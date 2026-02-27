import { useState } from "react";
import MyDropdown from "./MyDropdown";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

interface MyRoleManagerContainerProps {
  fullName: string;
  role: string;
  userId: string;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
}

export default function MyRoleManagerContainer({
  fullName,
  role,
  userId,
  onRoleChange,
}: MyRoleManagerContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const roleOptions = ["ادمین کل", "ادمین"];

  const handleRoleChange = async (selected: string | string[]) => {
    // Only proceed if we received a string
    if (typeof selected !== "string") return;

    setIsLoading(true);
    try {
      await onRoleChange(userId, selected);
      toast.success(`نقش ${fullName} با موفقیت به ${selected} تغییر کرد`, {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#F0FDF4",
          color: "#166534",
          direction: "rtl",
        },
      });
    } catch {
      toast.error(`خطا در تغییر نقش ${fullName}`, {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          direction: "rtl",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-[50px] grid-cols-4 items-center gap-2 rounded-[15px] bg-white px-3 py-2 sm:min-h-[60px] sm:gap-3 sm:rounded-[20px] sm:px-4 sm:py-2.5 lg:h-14 lg:grid-cols-4 lg:gap-0 lg:rounded-[25px] lg:px-0 lg:py-2">
      <div className="col-span-2 content-center text-right text-xs text-black sm:text-sm md:text-base lg:pr-20 lg:text-base">
        {fullName}
      </div>
      <div className="col-span-1 content-center">
        <MyDropdown
          options={roleOptions}
          defaultOption={role}
          value={role}
          onSelect={handleRoleChange}
          className="text-xs sm:text-sm lg:text-base"
        />
      </div>
      <div className="col-span-1 flex items-center justify-center">
        {isLoading && <LoadingSpinner size="sm" showText={false} />}
      </div>
    </div>
  );
}

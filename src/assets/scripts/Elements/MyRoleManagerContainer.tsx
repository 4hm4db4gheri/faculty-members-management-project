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
    <div className="grid h-14 grid-cols-4 rounded-[25px] bg-white">
      <div className="col-span-2 content-center rounded-[25px] pr-20 text-right text-black">
        {fullName}
      </div>
      <div className="col-span-1 content-center rounded-[25px]">
        <MyDropdown
          options={roleOptions}
          defaultOption={role}
          onSelect={handleRoleChange}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded-[25px]">
        {isLoading && <LoadingSpinner size="sm" showText={false} />}
      </div>
    </div>
  );
}

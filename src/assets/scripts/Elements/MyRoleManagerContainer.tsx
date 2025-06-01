import { useState } from "react";
import MyDropdown from "./MyDropdown";
import LoadingSpinner from "./LoadingSpinner";

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

  const handleRoleChange = async (newRole: string) => {
    setIsLoading(true);
    try {
      await onRoleChange(userId, newRole);
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
          showAllOption={false}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded-[25px]">
        {isLoading && <LoadingSpinner size="sm" showText={false} />}
      </div>
    </div>
  );
}

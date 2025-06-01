import MyDropdown from "./MyDropdown";

interface MyRoleManagerContainerProps {
  fullName: string;
  role: string;
  userId: string;
  onRoleChange: (userId: string, newRole: string) => void;
}

export default function MyRoleManagerContainer({
  fullName,
  role,
  userId,
  onRoleChange,
}: MyRoleManagerContainerProps) {
  
  const roleOptions = ["ادمین کل", "ادمین", "هیچکدام"];

  return (
    <div className="grid h-14 grid-cols-4 rounded-[25px] bg-white">
      <div className="col-span-2 content-center rounded-[25px] pr-20 text-right text-black">
        {fullName}
      </div>
      <div className="col-span-1 content-center rounded-[25px]">
        <MyDropdown
          options={roleOptions}
          defaultOption={role}
          onSelect={(newRole) => onRoleChange(userId, newRole)}
        />
      </div>
      <div className="col-span-1 rounded-[25px]"></div>
    </div>
  );
}

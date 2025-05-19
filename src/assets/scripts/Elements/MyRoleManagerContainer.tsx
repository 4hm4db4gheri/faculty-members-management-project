interface MyRoleManagerContainerProps {
  fullName: string;
  role: string;
  userId: number;
  onRoleChange: (userId: number, newRole: string) => void;
}

export default function MyRoleManagerContainer({
  fullName,
  role,
  userId,
  onRoleChange,
}: MyRoleManagerContainerProps) {
  const roleOptions = ["ادمین", "کاربر", "مدیر", "هیچکدام"];

  return (
    <div className="grid h-18 grid-cols-4 rounded-[25px] bg-white">
      <div className="col-span-2 content-center rounded-[25px] pr-20 text-right text-xl text-black">
        {fullName}
      </div>
      <div className="col-span-1 content-center rounded-[25px] text-center">
        <div className="relative rounded-[25px]">
          <select
            value={role}
            onChange={(e) => onRoleChange(userId, e.target.value)}
            className="w-2/3 appearance-none rounded-[25px] border-none bg-transparent pr-[25px] text-xl text-black transition-all outline-none hover:border-gray-300 focus:border-blue-500"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left 8px center",
              backgroundSize: "16px",
              paddingLeft: "32px",
            }}
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-span-1 rounded-[25px]"></div>
    </div>
  );
}

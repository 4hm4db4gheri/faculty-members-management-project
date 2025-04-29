import { useState, useMemo, useEffect } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyInput from "./../Elements/MyInput";
import MyPagination from "../Elements/MyPagination";
import MyRoleManagerContainer from "../Elements/MyRoleManagerContainer";

// Add interface for User type
interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

// Initial mock data with proper typing
const initialMockUsers: User[] = [
  { id: 1, firstName: "احمد", lastName: "باقری", role: "ادمین" },
  { id: 2, firstName: "محمد", lastName: "محمدی", role: "کاربر" },
  { id: 3, firstName: "علی", lastName: "علوی", role: "مدیر" },
  { id: 4, firstName: "رضا", lastName: "رضایی", role: "کاربر" },
  { id: 5, firstName: "حسین", lastName: "حسینی", role: "مدیر" },
  { id: 6, firstName: "مریم", lastName: "مرادی", role: "ادمین" },
  { id: 7, firstName: "زهرا", lastName: "زارعی", role: "کاربر" },
  { id: 8, firstName: "فاطمه", lastName: "فتحی", role: "مدیر" },
  { id: 9, firstName: "سارا", lastName: "سعیدی", role: "کاربر" },
  { id: 10, firstName: "نیما", lastName: "نادری", role: "ادمین" },
];

const ITEMS_PER_PAGE = 6;

export default function RoleManagementPanel() {
  const roleOptions = ["ادمین", "کاربر", "مدیر", "هیچکدام"] as const;
  const [searchText, setSearchText] = useState<string>("");
  const [lastnameSearchText, setLastnameSearchText] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("هیچکدام");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Initialize users from localStorage or use initial data
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("mockUsers");
    return savedUsers ? JSON.parse(savedUsers) : initialMockUsers;
  });

  // Save to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem("mockUsers", JSON.stringify(users));
  }, [users]);

  // Filter users based on search criteria
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchFirstName = user.firstName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchLastName = user.lastName
        .toLowerCase()
        .includes(lastnameSearchText.toLowerCase());
      const matchRole =
        selectedRole === "هیچکدام" || user.role === selectedRole;

      return matchFirstName && matchLastName && matchRole;
    });
  }, [searchText, lastnameSearchText, selectedRole, users]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRoleSelect = (selected: string) => {
    setSelectedRole(selected);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      return updatedUsers;
    });
  };

  return (
    <>
      <div className="grid h-2/15 grid-cols-3">
        <div className="content-center px-20 text-center">
          <MyInput
            placeholder="نام"
            value={searchText}
            onChange={(value) => {
              setSearchText(value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="content-center px-20 text-center">
          <MyInput
            placeholder="نام خانوادگی"
            value={lastnameSearchText}
            onChange={(value) => {
              setLastnameSearchText(value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="content-center px-20 text-center">
          <MyDropdown
            options={roleOptions}
            defaultOption="هیچکدام"
            onSelect={handleRoleSelect}
          />
        </div>
      </div>
      <div className="mb-2 grid h-1/15 grid-cols-4">
        <div className="col-span-2 content-center pr-30 text-right text-xl text-black">
          نام
        </div>
        <div className="textsize col-span-1 content-center text-center text-xl text-black">
          نقش
        </div>
      </div>
      <div className="grid gap-5">
        {currentUsers.map((user) => (
          <MyRoleManagerContainer
            key={user.id}
            userId={user.id}
            fullName={`${user.firstName} ${user.lastName}`}
            role={user.role}
            onRoleChange={handleRoleChange}
          />
        ))}
        {currentUsers.length === 0 && (
          <div className="text-center text-gray-500">هیچ نتیجه‌ای یافت نشد</div>
        )}
        {totalPages > 1 && (
          <MyPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </>
  );
}

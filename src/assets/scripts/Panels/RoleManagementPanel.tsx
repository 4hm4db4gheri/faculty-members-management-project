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

// Initial mock data (static reference)
const initialMockUsers: User[] = [
  { id: 1, firstName: "احمد", lastName: "باقری", role: "ادمین" },
  { id: 2, firstName: "محمد", lastName: "محمدی", role: "کاربر" },
  { id: 3, firstName: "علی", lastName: "علوی", role: "مدیر" },
  { id: 4, firstName: "رضا", lastName: "رضایی", role: "کاربر" },
  { id: 5, firstName: "حسین", lastName: "حسینی", role: "مدیر" },
  { id: 6, firstName: "مریم", lastName: "مرادی", role: "ادمین" },
  { id: 7, firstName: "زهرا", lastName: "زارعی", role: "کاربر" },
  { id: 8, firstName: "فاطمه", lastName: "فتحی", role: "مدیر" },
  { id: 9, firstName: "سعید", lastName: "سعیدی", role: "ادمین" },
  { id: 10, firstName: "نرگس", lastName: "نادری", role: "کاربر" },
  { id: 11, firstName: "کاظم", lastName: "کاظمی", role: "مدیر" },
  { id: 12, firstName: "لیلا", lastName: "لطفی", role: "کاربر" },
  { id: 13, firstName: "حمید", lastName: "حمیدی", role: "ادمین" },
  { id: 14, firstName: "بهاره", lastName: "بهرامی", role: "مدیر" },
  { id: 15, firstName: "مجید", lastName: "مجیدی", role: "کاربر" },
  { id: 16, firstName: "سارا", lastName: "سلیمی", role: "ادمین" },
  { id: 17, firstName: "جواد", lastName: "جوادی", role: "مدیر" },
  { id: 18, firstName: "نیما", lastName: "نیکخواه", role: "کاربر" },
  { id: 19, firstName: "الهه", lastName: "الهی", role: "ادمین" },
  { id: 20, firstName: "رامین", lastName: "رحمانی", role: "مدیر" },
  { id: 21, firstName: "امین", lastName: "امینی", role: "کاربر" },
  { id: 22, firstName: "پریسا", lastName: "پارسا", role: "ادمین" },
  { id: 23, firstName: "حسن", lastName: "حسنی", role: "مدیر" },
  { id: 24, firstName: "یاسمن", lastName: "یاسینی", role: "کاربر" },
  { id: 25, firstName: "کامران", lastName: "کریمی", role: "ادمین" },
  { id: 26, firstName: "نازنین", lastName: "نجفی", role: "مدیر" },
  { id: 27, firstName: "بابک", lastName: "بهرامی", role: "کاربر" },
  { id: 28, firstName: "شیما", lastName: "شریفی", role: "ادمین" },
  { id: 29, firstName: "مهدی", lastName: "مهدوی", role: "مدیر" },
  { id: 30, firstName: "ندا", lastName: "نوری", role: "کاربر" },
  { id: 31, firstName: "پوریا", lastName: "پناهی", role: "ادمین" },
  { id: 32, firstName: "سمیرا", lastName: "سعادتی", role: "مدیر" },
  { id: 33, firstName: "رضا", lastName: "رستمی", role: "کاربر" },
  { id: 34, firstName: "مینا", lastName: "محمودی", role: "ادمین" },
  { id: 35, firstName: "فرهاد", lastName: "فرجی", role: "مدیر" },
  { id: 36, firstName: "آرزو", lastName: "اکبری", role: "کاربر" },
  { id: 37, firstName: "داود", lastName: "دهقانی", role: "ادمین" },
  { id: 38, firstName: "طاهره", lastName: "طاهری", role: "مدیر" },
  { id: 39, firstName: "عرفان", lastName: "عزیزی", role: "کاربر" },
  { id: 40, firstName: "غزل", lastName: "غفاری", role: "ادمین" },
];

export default function RoleManagementPanel() {
  const roleOptions = ["ادمین", "کاربر", "مدیر", "هیچکدام"] as const;
  const [searchText, setSearchText] = useState<string>("");
  const [lastnameSearchText, setLastnameSearchText] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("هیچکدام");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Initialize users from localStorage or use initial data
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("mockUsers");
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : null;

    // If saved users exist but don't match the current mock data, reset to initialMockUsers
    if (!parsedUsers || parsedUsers.length !== initialMockUsers.length) {
      localStorage.setItem("mockUsers", JSON.stringify(initialMockUsers));
      return initialMockUsers;
    }

    return parsedUsers;
  });

  // Save to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem("mockUsers", JSON.stringify(users));
  }, [users]);

  // Simulate a database update (or API call in the future)
  const updateUserRole = (userId: number, newRole: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
    );
  };

  // Filter users based on search criteria with priority
  const filteredUsers = useMemo(() => {
    const results = new Set(); // Track unique records
    const priorityResults: User[] = [];

    if (!searchText && !lastnameSearchText && selectedRole === "هیچکدام") {
      return users;
    }

    // First priority: First name matches
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      users.forEach((user) => {
        if (
          user.firstName.toLowerCase().startsWith(searchLower) &&
          !results.has(user.id)
        ) {
          if (selectedRole === "هیچکدام" || user.role === selectedRole) {
            priorityResults.push(user);
            results.add(user.id);
          }
        }
      });
    }

    // Second priority: Last name matches
    if (lastnameSearchText) {
      const searchLower = lastnameSearchText.toLowerCase();
      users.forEach((user) => {
        if (
          user.lastName.toLowerCase().startsWith(searchLower) &&
          !results.has(user.id)
        ) {
          if (selectedRole === "هیچکدام" || user.role === selectedRole) {
            priorityResults.push(user);
            results.add(user.id);
          }
        }
      });
    }

    // If no exact matches found, try partial matches
    if (priorityResults.length === 0) {
      users.forEach((user) => {
        const matchesFirstName = searchText
          ? user.firstName.toLowerCase().includes(searchText.toLowerCase())
          : true;
        const matchesLastName = lastnameSearchText
          ? user.lastName
              .toLowerCase()
              .includes(lastnameSearchText.toLowerCase())
          : true;
        const matchesRole =
          selectedRole === "هیچکدام" || user.role === selectedRole;

        if (
          matchesFirstName &&
          matchesLastName &&
          matchesRole &&
          !results.has(user.id)
        ) {
          priorityResults.push(user);
          results.add(user.id);
        }
      });
    }

    return priorityResults;
  }, [searchText, lastnameSearchText, selectedRole, users]);

  // Update items per page to 5
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] gap-4 font-sans">
      {/* Search Section */}
      <div className="grid h-2/15 grid-cols-3 rounded-[25px] bg-transparent px-2 py-5">
        <div className="content-center px-20 text-center">
          <MyInput
            placeholder="نام"
            value={searchText}
            onChange={(value) => setSearchText(value)}
          />
        </div>
        <div className="content-center px-20 text-center">
          <MyInput
            placeholder="نام خانوادگی"
            value={lastnameSearchText}
            onChange={(value) => setLastnameSearchText(value)}
          />
        </div>
        <div className="content-center px-20 text-center">
          <MyDropdown
            options={roleOptions}
            defaultOption="هیچکدام"
            onSelect={setSelectedRole}
          />
        </div>
      </div>

      {/* Headers */}
      <div className="mb-2 grid grid-cols-4">
        <div className="col-span-2 content-center pr-18 text-start text-xl text-gray-600">
          نام و نام خانوادگی
        </div>
        <div className="textsize col-span-1 content-center text-center text-xl text-gray-600">
          نقش
        </div>
      </div>

      {/* Content Area with Fixed Height */}
      <div className="flex flex-col gap-5 overflow-hidden">
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-5 pb-4">
            {currentUsers.map((user) => (
              <MyRoleManagerContainer
                key={user.id}
                userId={user.id}
                fullName={`${user.firstName} ${user.lastName}`}
                role={user.role}
                onRoleChange={updateUserRole}
              />
            ))}
            {currentUsers.length === 0 && (
              <div className="text-center text-gray-500">
                هیچ نتیجه‌ای یافت نشد
              </div>
            )}
          </div>
        </div>

        {/* Fixed Pagination */}
        {totalPages > 1 && (
          <div className="mt-auto flex-shrink-0 py-4">
            <MyPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

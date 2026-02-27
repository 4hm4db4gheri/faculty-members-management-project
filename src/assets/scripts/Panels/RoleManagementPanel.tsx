import { useState, useMemo, useEffect } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyInput from "./../Elements/MyInput";
import MyPagination from "../Elements/MyPagination";
import MyRoleManagerContainer from "../Elements/MyRoleManagerContainer";
import LoadingSpinner from "../Elements/LoadingSpinner";
import CreateUserForm from "../Elements/CreateUserForm";
import { toast } from "react-toastify";
import {
  getUsers,
  updateUserRole as apiUpdateUserRole,
} from "../Services/apiEndpoints";

// Update interface to match API response
interface User {
  id: string;
  firstName: string;
  lastName: string;
  roles: string;
}

interface ApiResponse {
  data: User[];
  error: boolean;
  message: string[];
}

const mapRoleToDisplay = (role: string): string => {
  switch (role) {
    case "FullAccess":
      return "ادمین کل";
    case "Admin":
      return "ادمین";
    default:
      return role;
  }
};

const mapDisplayToRole = (displayRole: string): string => {
  switch (displayRole) {
    case "ادمین کل":
      return "FullAccess";
    case "ادمین":
      return "Admin";
    default:
      return displayRole;
  }
};

export default function RoleManagementPanel() {
  // Define role options without همه
  const roleOptions = ["همه", "ادمین کل", "ادمین"] as const;
  const [searchText, setSearchText] = useState<string>("");
  const [lastnameSearchText, setLastnameSearchText] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("همه");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = (await getUsers()) as ApiResponse;

      if (!response.error) {
        setUsers(response.data);
      } else {
        throw new Error(response.message.join(", "));
      }
    } catch {
      setError("خطا در دریافت اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  // Move fetchUsers call to useEffect
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const apiRole = mapDisplayToRole(newRole); // Convert display role to API role
      const response = (await apiUpdateUserRole(userId, apiRole)) as {
        error: boolean;
        message?: string[];
      };

      if (response.error) {
        throw new Error(
          response.message?.join(", ") || "Failed to update role",
        );
      }

      // Update local state only after successful API call
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, roles: apiRole } : user,
        ),
      );

      toast.success("نقش کاربر با موفقیت تغییر کرد", {
        position: "bottom-left",
        style: {
          background: "#F0FDF4",
          color: "#166534",
          direction: "rtl",
        },
      });
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("خطا در بروزرسانی نقش کاربر", {
        position: "bottom-left",
        style: {
          background: "#FEF2F2",
          color: "#991B1B",
          direction: "rtl",
        },
      });
    }
  };

  // Filter users based on search criteria
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesFirstName = searchText
        ? user.firstName.toLowerCase().includes(searchText.toLowerCase())
        : true;
      const matchesLastName = lastnameSearchText
        ? user.lastName.toLowerCase().includes(lastnameSearchText.toLowerCase())
        : true;
      const matchesRole =
        selectedRole === "همه" || mapRoleToDisplay(user.roles) === selectedRole;

      return matchesFirstName && matchesLastName && matchesRole;
    });
  }, [searchText, lastnameSearchText, selectedRole, users]);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center">
        <p className="text-lg font-semibold text-red-500">خطا: {error}</p>
      </div>
    );
  }

  // Add this function to refresh users after creating a new one
  const handleUserCreated = () => {
    // Refetch users
    fetchUsers();
  };

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] gap-2 p-2 sm:gap-3 md:gap-4 md:p-0 lg:gap-4 lg:p-0">
      {/* Search Section */}
      <div className="grid h-auto grid-cols-1 gap-2 rounded-[15px] bg-transparent px-1 py-2 sm:grid-cols-2 sm:gap-3 sm:rounded-[20px] sm:px-2 sm:py-3 md:grid-cols-3 md:gap-4 md:rounded-[25px] lg:grid-cols-3 lg:gap-4 lg:rounded-[25px] lg:px-2 lg:py-3">
        <div className="content-center text-center sm:px-4 lg:px-10 xl:px-20">
          <MyInput
            placeholder="نام"
            value={searchText}
            onChange={(value) => setSearchText(value)}
            className="text-sm sm:text-base"
          />
        </div>
        <div className="content-center text-center sm:px-4 lg:px-10 xl:px-20">
          <MyInput
            placeholder="نام خانوادگی"
            value={lastnameSearchText}
            onChange={(value) => setLastnameSearchText(value)}
            className="text-sm sm:text-base"
          />
        </div>
        <div className="group relative sm:px-4 lg:px-10 xl:px-20">
          <MyDropdown
            options={roleOptions}
            defaultOption="همه"
            value={selectedRole}
            onSelect={(selected) => {
              if (typeof selected === "string") setSelectedRole(selected);
            }}
            className="text-sm sm:text-base"
          />
          <span className="absolute -top-2.5 right-3 px-1 text-xs text-gray-500 sm:-top-3.5 sm:right-4 sm:text-sm">نقش</span>
        </div>
      </div>

      {/* Headers */}
      <div className="mb-2 grid h-auto grid-cols-3 gap-2 sm:grid-cols-4">
        <div className="col-span-1 content-center px-2 text-start text-xs text-black sm:col-span-2 sm:px-4 sm:text-sm md:text-base lg:pr-20 lg:text-xl">
          نام
        </div>
        <div className="col-span-1 content-center text-center text-xs text-black sm:text-sm md:text-base lg:text-xl">
          نقش
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <button
            onClick={() => setIsCreateUserOpen(true)}
            className="rounded-lg bg-blue-500 px-2 py-1.5 text-[10px] text-white hover:bg-blue-600 sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm lg:px-4 lg:py-2 lg:text-base"
          >
            افزودن کاربر
          </button>
        </div>
      </div>

      {/* Add the CreateUserForm component */}
      <CreateUserForm
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onSuccess={handleUserCreated}
      />

      {/* Content Area */}
      <div className="flex flex-col gap-2 overflow-hidden sm:gap-3 md:gap-4 lg:gap-5">
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-2 pb-4 sm:gap-3 md:gap-4 lg:gap-5 lg:pb-4">
            {currentUsers.map((user) => (
              <MyRoleManagerContainer
                key={user.id}
                userId={user.id}
                fullName={`${user.firstName} ${user.lastName}`}
                role={mapRoleToDisplay(user.roles)}
                onRoleChange={updateUserRole} // updateUserRole already returns a Promise
              />
            ))}
            {currentUsers.length === 0 && (
              <div className="text-center text-gray-500">
                هیچ نتیجه‌ای یافت نشد
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
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

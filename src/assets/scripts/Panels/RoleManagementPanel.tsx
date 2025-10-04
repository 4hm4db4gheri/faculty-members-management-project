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

  const labelClasses = `
    absolute
    -top-5
    right-4
    px-21
    text-sm
    text-gray-500
    transition-colors
    group-hover:text-gray-700
  `
    .trim()
    .replace(/\s+/g, " ");

  // Add this function to refresh users after creating a new one
  const handleUserCreated = () => {
    // Refetch users
    fetchUsers();
  };

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] gap-3 p-2 sm:gap-4 md:p-0">
      {/* Search Section */}
      <div className="grid h-auto grid-cols-1 gap-3 rounded-[25px] bg-transparent px-2 py-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <div className="content-center text-center sm:px-4 lg:px-10 xl:px-20">
          <MyInput
            placeholder="نام"
            value={searchText}
            onChange={(value) => setSearchText(value)}
          />
        </div>
        <div className="content-center text-center sm:px-4 lg:px-10 xl:px-20">
          <MyInput
            placeholder="نام خانوادگی"
            value={lastnameSearchText}
            onChange={(value) => setLastnameSearchText(value)}
          />
        </div>
        <div className="group relative sm:px-4 lg:px-10 xl:px-20">
          <MyDropdown
            options={roleOptions}
            defaultOption="همه"
            onSelect={(selected) => {
              if (typeof selected === "string") setSelectedRole(selected);
            }}
            className=""
          />
          <span className={labelClasses}>نقش</span>
        </div>
      </div>

      {/* Headers */}
      <div className="mb-2 grid h-auto grid-cols-3 gap-2 sm:grid-cols-4">
        <div className="col-span-1 content-center px-2 text-start text-sm text-black sm:col-span-2 sm:px-4 sm:text-base lg:pr-20 lg:text-xl">
          نام
        </div>
        <div className="textsize col-span-1 content-center text-center text-sm text-black sm:text-base lg:text-xl">
          نقش
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <button
            onClick={() => setIsCreateUserOpen(true)}
            className="rounded-lg bg-blue-500 px-2 py-1.5 text-xs text-white hover:bg-blue-600 sm:px-3 sm:py-2 sm:text-sm md:px-4 md:text-base"
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
      <div className="flex flex-col gap-5 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-5 pb-4">
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

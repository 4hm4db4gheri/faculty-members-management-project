import { useState, useMemo, useEffect } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyInput from "./../Elements/MyInput";
import MyPagination from "../Elements/MyPagination";
import MyRoleManagerContainer from "../Elements/MyRoleManagerContainer";

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
  const roleOptions = ["ادمین کل", "ادمین", "هیچکدام"] as const;
  const [searchText, setSearchText] = useState<string>("");
  const [lastnameSearchText, setLastnameSearchText] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("هیچکدام");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://faculty.liara.run/api/panel/v1/user/GetList', {
          headers: {
            'accept': 'text/plain'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: ApiResponse = await response.json();
        
        if (!data.error) {
          setUsers(data.data);
        } else {
          throw new Error(data.message.join(', '));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Update user role (you'll need to implement the API call for this)
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // TODO: Implement API call to update user role
      console.log(`Updating user ${userId} to role ${newRole}`);
      
      // Optimistically update the UI
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, roles: newRole } : user
        )
      );
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  // Filter users based on search criteria
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesFirstName = searchText ? 
        user.firstName.toLowerCase().includes(searchText.toLowerCase()) : true;
      const matchesLastName = lastnameSearchText ? 
        user.lastName.toLowerCase().includes(lastnameSearchText.toLowerCase()) : true;
      const matchesRole = selectedRole === "هیچکدام" || mapRoleToDisplay(user.roles) === selectedRole;

      return matchesFirstName && matchesLastName && matchesRole;
    });
  }, [searchText, lastnameSearchText, selectedRole, users]);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return <div className="text-center">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">خطا: {error}</div>;
  }

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] gap-4">
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
      <div className="mb-2 grid h-1/15 grid-cols-4">
        <div className="col-span-2 content-center pr-20 text-start text-xl text-black">
          نام
        </div>
        <div className="textsize col-span-1 content-center text-center text-xl text-black">
          نقش
        </div>
      </div>

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
                onRoleChange={(userId, newRole) => updateUserRole(userId, mapDisplayToRole(newRole))}
              />
            ))}
            {currentUsers.length === 0 && (
              <div className="text-center text-gray-500">هیچ نتیجه‌ای یافت نشد</div>
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

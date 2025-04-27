import { useState } from "react";
import Dropdown from "./../Elements/Dropdown";
import MyInput from "./../Elements/MyInput";
import MyPagination from "./../Elements/Pagination";

export default function RoleManagementPanel() {
  const roleOptions = ["ادمین", "کاربر", "مدیر", "هیچکدام"];
  const [searchText, setSearchText] = useState("");
  const [lastnameSearchText, setLastnameSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleRoleSelect = (selected: string) => {
    // Handle role selection
    console.log("Selected role:", selected);
  };

  return (
    <>
      <div className="grid h-2/15 grid-cols-3">
        <div className="content-center px-20 text-center">
          <MyInput
            placeholder="نام"
            value={searchText}
            onChange={setSearchText}
          />
        </div>
        <div className="content-center px-20 text-center">
          <MyInput
            placeholder="نام خانوادگی"
            value={lastnameSearchText}
            onChange={setLastnameSearchText}
          />
        </div>
        <div className="content-center px-20 text-center">
          <Dropdown
            options={roleOptions}
            defaultOption="هیچکدام"
            onSelect={handleRoleSelect}
          />
        </div>
      </div>
      <div className="mb-2 grid h-1/15 grid-cols-2">
        <div className="content-center pr-30 text-right text-xl text-black">
          نام
        </div>
        <div className="textsize content-center pr-40 text-right text-xl text-black">
          نقش
        </div>
      </div>
      <div className="grid gap-5">
        <div className="grid h-18 grid-cols-2 rounded-[25px] bg-white">
          <div className="content-center rounded-[25px] pr-20 text-right text-2xl text-black">
            احمد باقری
          </div>
          <div className="grid grid-cols-2 rounded-[25px]">
            <div className="relative content-center rounded-[25px] pr-25 text-right">
              <select
                className="w-2/3 appearance-none rounded-[25px] border-none bg-transparent pr-[25px] text-right text-xl text-black transition-all outline-none hover:border-gray-300 focus:border-blue-500"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left 8px center",
                  backgroundSize: "16px",
                  paddingLeft: "32px",
                }}
              >
                <option value="role1">ادمین</option>
                <option value="role2">کاربر</option>
                <option value="role3">مدیر</option>
              </select>
            </div>
            <div className="rounded-[25px] bg-emerald-300"></div>
          </div>
        </div>
        <div className="h-18 rounded-[25px] bg-white"></div>
        <div className="h-18 rounded-[25px] bg-white">asdfasdf</div>
        <div className="h-18 rounded-[25px] bg-white">asdfasdf</div>
        <div className="h-18 rounded-[25px] bg-white">asdfasdf</div>
        <div className="h-18 rounded-[25px] bg-white">asdfasdf</div>
        <MyPagination
          totalPages={5}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}

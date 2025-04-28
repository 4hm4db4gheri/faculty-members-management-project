import { useState } from "react";
import MyDropdown from "../Elements/MyDropdown";
import MyInput from "./../Elements/MyInput";
import MyPagination from "../Elements/MyPagination";
import MyRoleManagerContainer from "../Elements/MyRoleManagerContainer";

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
        <MyRoleManagerContainer fullName="احمد باقری" />
        <MyRoleManagerContainer fullName="هوراا" />
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

import React, { useState } from "react";
import MyInput from "./MyInput";
import MyDropdown from "./MyDropdown";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isOpen, onClose }) => {
  // Define dropdown options
  const facultyOptions = ["کامپیوتر", "برق", "مکانیک", "عمران"] as const;
  const groupOptions = ["گروه ۱", "گروه ۲", "گروه ۳"] as const;
  const statusOptions = ["هیئت علمی", "استاد مدعو", "بازنشسته"] as const;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#282828] opacity-50"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 top-1/2 z-50 mx-auto grid w-full max-w-4xl -translate-y-1/2 transform grid-rows-6 rounded-[25px] bg-white p-6 shadow-xl">
        <div className="row-span-1 content-center py-4 text-center text-black text-xl font-bold">
          جست و جو پیشرفته
        </div>
        <div className="row-span-4 content-center text-center px-4">
          <div className="grid h-full grid-cols-2 gap-12">
            <div className="col-span-1">
              <div className="grid h-full grid-rows-3">
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 gap-2 items-center">
                    <div className="col-span-1 content-center text-right text-black">نام</div>
                    <div className="col-span-2 content-center w-full">
                      <MyInput placeholder="نام" className="text-black w-full" />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 gap-2 items-center">
                    <div className="col-span-1 content-center text-right text-black">امتیازات</div>
                    <div className="col-span-2 content-center w-full">
                      <MyInput placeholder="امتیازات" className="text-black w-full" />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 gap-2 items-center">
                    <div className="col-span-1 content-center text-right text-black">گروه</div>
                    <div className="col-span-2 content-center w-full">
                      <MyDropdown options={groupOptions} defaultOption={groupOptions[0]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="grid h-full grid-rows-3">
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 gap-2 items-center">
                    <div className="col-span-1 content-center text-right text-black">کد ملی</div>
                    <div className="col-span-2 content-center w-full">
                      <MyInput placeholder="کد ملی" className="text-black w-full" />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 gap-2 items-center">
                    <div className="col-span-1 content-center text-right text-black">دانشکده</div>
                    <div className="col-span-2 content-center w-full">
                      <MyDropdown options={facultyOptions} defaultOption={facultyOptions[0]} />
                    </div>
                  </div>
                </div>
                <div className="row-span-1 content-center">
                  <div className="grid h-full grid-cols-3 gap-2 items-center">
                    <div className="col-span-1 content-center text-right text-black">وضعیت شغلی</div>
                    <div className="col-span-2 content-center w-full">
                      <MyDropdown options={statusOptions} defaultOption={statusOptions[0]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-1 flex items-center justify-center py-4">
          <button 
            className="rounded-[25px] bg-[#3388BC] px-12 py-3 text-white hover:bg-[#2D769F] transition-colors"
          >
            جست و جو
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedSearch;

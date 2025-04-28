import { useState } from "react";
import MyPagination from "../Elements/MyPagination";

export default function HistoryPanel() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="grid h-full grid-rows-8">
      <div className="row-span-1 bg-yellow-400">
        <div className="grid grid-cols-10 rounded-[25px]">
          <div className="col-span-9 ml-4 grid grid-cols-10 items-center rounded-[25px] bg-white pr-[10px]">
            <input
              type="text"
              className="col-span-9 box-border h-full w-full rounded-[25px] border-none bg-transparent pr-5 text-xl text-black outline-none placeholder:pr-5 placeholder:text-xl placeholder:text-[#aaa]"
              placeholder="جستجو"
            />
            <button className="col-span-1 flex h-full w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-transparent transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
              <img src="./src/assets/images/icons8-search.svg" alt="" />
            </button>
          </div>
          <button className="col-span-1 flex cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
            جستجو پ
          </button>
        </div>
      </div>
      <div className="row-span-1 mb-2 grid h-1/15 grid-cols-2"></div>
      <div className="row-span-6 grid gap-5 bg-red-500">
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
        <div className="h-18 rounded-[25px] bg-white">asdfasdf</div>
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
    </div>
  );
}

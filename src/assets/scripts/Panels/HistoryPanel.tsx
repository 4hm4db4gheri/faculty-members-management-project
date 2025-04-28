import { useState } from "react";
import MyPagination from "../Elements/MyPagination";

export default function HistoryPanel() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="grid h-full grid-rows-8">
      <div className="row-span-1">
        <div className="grid h-full grid-cols-10 gap-6 rounded-[25px] px-2 py-5">
          <div className="col-span-6 ml-4 grid grid-cols-10 items-center rounded-[25px] bg-white pr-[10px]">
            <input
              type="text"
              className="col-span-9 box-border h-full w-full border-none bg-transparent pr-5 text-xl text-black outline-none placeholder:pr-5 placeholder:text-xl placeholder:text-[#aaa]"
              placeholder="جستجو"
            />
            <button className="col-span-1 flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-transparent transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
              <img src="./src/assets/images/icons8-search.svg" alt="" />
            </button>
          </div>
          <button className="col-span-1 flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
            جستجو پ
          </button>
          <button className="col-span-1 my-2 mr-20 flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
            PDF
          </button>
          <button className="col-span-1 my-2 mr-20 flex w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
            Excel
          </button>
        </div>
      </div>
      <div className="row-span-1 mb-2 grid grid-cols-4">
        <div className="col-span-2 content-end pr-20 pb-4 text-start text-black">
          نام استاد
        </div>
        <div className="col-span-1 content-end pb-4 text-center text-black">
          دانشکده
        </div>
        <div className="col-span-1 content-end pb-4 text-center text-black">
          رتبه علمی
        </div>
      </div>
      <div className="row-span-6 grid gap-5">
        <div className="grid h-18 grid-cols-4 rounded-[25px] bg-white">
          <div className="col-span-2 content-center pr-20 text-start text-black">
            sadf
          </div>
          <div className="col-span-1 content-center text-center text-black">
            asdf
          </div>
          <div className="col-span-1 content-center text-center text-black">
            fad
          </div>
        </div>
        <div className="grid h-18 grid-cols-4 rounded-[25px] bg-white">
          <div className="col-span-2 content-center pr-20 text-start text-black">
            sadf
          </div>
          <div className="col-span-1 content-center text-center text-black">
            asdf
          </div>
          <div className="col-span-1 content-center text-center text-black">
            fad
          </div>
        </div>
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

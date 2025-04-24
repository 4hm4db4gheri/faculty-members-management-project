import "../../styles/Panels/MainDashboardPanel.scss";

export default function MainDashboardPanel() {
  return (
    <div className="box-border grid h-full grid-cols-3 gap-[30px] rounded-[25px]">
      <div className="col-span-1 flex h-full flex-col items-center justify-center rounded-[25px] bg-white pt-[10px]">
        <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-[#8D8D8D]">
          Pic
        </div>
        <div className="flex content-center items-center justify-center pt-[30px] text-5xl text-black">
          اسم کاربر
        </div>
        <div className="grid h-[23%] grid-cols-4 gap-[10px] p-5 pt-[125px]">
          <div className="col-span-1 flex h-full items-center justify-center rounded-[25px] bg-red-500">
            نقش
          </div>
          <button className="col-span-3 flex h-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-[#D9D9D9] p-[10px_20px] text-center text-3xl font-bold text-black transition-colors duration-300 hover:bg-[#A6A6A6]">
            مدت زمان
          </button>
        </div>
      </div>

      <div className="col-span-2 grid h-full grid-rows-[0.4fr_2fr_2fr] gap-[40px]">
        <div className="grid grid-cols-10 gap-[30px] rounded-[25px]">
          <button className="col-span-1 flex h-[70px] w-[68px] cursor-pointer items-center justify-center rounded-[25px] border-none bg-white text-xl text-black transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
            جستجو پ
          </button>
          <div className="rtl col-span-9 grid grid-cols-10 items-center rounded-[25px] bg-white pr-[10px]">
            <input
              type="text"
              className="col-span-9 box-border h-full w-full rounded-[25px] border-none bg-transparent pr-5 text-xl text-black outline-none placeholder:pr-5 placeholder:text-xl placeholder:text-[#aaa]"
              placeholder="جستجو"
            />
            <button className="col-span-1 flex h-full w-full cursor-pointer items-center justify-center rounded-[25px] border-none bg-transparent p-[5px] transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
              <i className="bi bi-search text-xl text-black"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1 flex items-center justify-center rounded-[25px] bg-white text-5xl text-black">
            نمودار
          </div>
          <div className="col-span-2 flex items-center justify-center rounded-[25px] bg-white text-5xl text-black">
            نمودار
          </div>
        </div>

        <div className="rounded-[25px] bg-white"></div>
      </div>
    </div>
  );
}

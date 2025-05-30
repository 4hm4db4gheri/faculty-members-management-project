import ChartComponent1 from "../../components/ChartComponent1";
import ChartComponent2 from "../../components/ChartComponent2";

export default function MainDashboardPanel() {
  return (
    <div className="box-border grid h-full grid-cols-3 gap-[30px] rounded-[25px]">
      <div className="col-span-2 grid h-full grid-rows-[0.4fr_2fr_2fr] gap-[30px]">
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

        <div className="rounded-[25px] bg-white shadow">
          <h2 className="text-center text-2xl font-bold">مرتبۀ علمی</h2>
          <div className="h-fit">
            <ChartComponent1 />
          </div>
        </div>

        <div className="rounded-[25px] bg-white shadow">
          <h2 className="text-center text-2xl font-bold">
            آمار تفکیکی اعضای هیئت علمی
          </h2>
          <div className="h-fit">
            <ChartComponent2 />
          </div>
        </div>
      </div>
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
    </div>
  );
}

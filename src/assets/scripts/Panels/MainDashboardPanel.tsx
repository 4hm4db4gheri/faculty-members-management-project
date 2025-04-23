import '../../styles/Panels/MainDashboardPanel.scss';

export default function MainDashboardPanel() {
    return (
        <div className="grid grid-cols-3 gap-[30px] rounded-[25px] h-full box-border">
            <div className="col-span-1 bg-white pt-[10px] flex flex-col justify-center items-center rounded-[25px] h-full">
                <div className="w-[150px] h-[150px] bg-[#8D8D8D] rounded-full flex justify-center items-center">
                    Pic
                </div>
                <div className="text-black justify-center items-center content-center pt-[30px] text-5xl flex">
                    اسم کاربر
                </div>
                <div className="p-5 pt-[125px] h-[23%] grid grid-cols-4 gap-[10px]">
                    <div className="col-span-1 bg-red-500 rounded-[25px] h-full flex justify-center items-center">
                        نقش
                    </div>
                    <button className="col-span-3 bg-[#D9D9D9] border-none rounded-[25px] text-black text-3xl font-bold p-[10px_20px] cursor-pointer text-center h-full flex justify-center items-center transition-colors duration-300 hover:bg-[#A6A6A6]">
                        مدت زمان
                    </button>
                </div>
            </div>

            <div className="col-span-2 h-full grid grid-rows-[0.4fr_2fr_2fr] gap-[40px]">
                <div className="grid grid-cols-10 gap-[30px] rounded-[25px]">
                    <button className="col-span-1 w-[68px] h-[70px] bg-white border-none rounded-[25px] flex justify-center items-center text-black text-xl cursor-pointer transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
                        جستجو پ
                    </button>
                    <div className="col-span-9 grid grid-cols-10 items-center bg-white rounded-[25px] pr-[10px] rtl">
                        <input
                            type="text"
                            className="col-span-9 h-full w-full bg-transparent border-none rounded-[25px] pr-5 text-xl text-black outline-none box-border placeholder:text-[#aaa] placeholder:text-xl placeholder:pr-5"
                            placeholder="جستجو"
                        />
                        <button className="col-span-1 w-full h-full bg-transparent border-none cursor-pointer p-[5px] rounded-[25px] flex items-center justify-center transition-colors duration-300 hover:bg-[#f0f0f0] active:bg-[#dcdcdc]">
                            <i className="bi bi-search text-xl text-black"></i>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                    <div className="col-span-1 bg-white rounded-[25px] flex justify-center items-center text-black text-5xl">
                        نمودار
                    </div>
                    <div className="col-span-2 bg-white rounded-[25px] flex justify-center items-center text-black text-5xl">
                        نمودار
                    </div>
                </div>

                <div className="bg-white rounded-[25px]"></div>
            </div>
        </div>
    );
}
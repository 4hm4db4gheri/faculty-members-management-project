import { useState } from 'react';
import MainDashboardPanel from './Panels/MainDashboardPanel';
import HistoryPanel from './Panels/HistoryPanel';
import RoleManagementPanel from './Panels/RoleManagementPanel';
import NotificationsPanel from './Panels/NotificationsPanel';
import ImprovementChartPanel from './Panels/ImprovementChartPanel';

export default function DashboardComponent() {
    const [selectedItem, setSelectedItem] = useState<string>('dashboard'); // Default to the first item

    const handleSelect = (item: string) => {
        setSelectedItem(item);
    };

    const renderPanel = () => {
        switch (selectedItem) {
            case 'dashboard':
                return <MainDashboardPanel />;
            case 'records':
                return <HistoryPanel />;
            case 'progress':
                return <ImprovementChartPanel />;
            case 'roles':
                return <RoleManagementPanel />;
            case 'notifications':
                return <NotificationsPanel />;
            default:
                return <MainDashboardPanel />; // Default to MainDashboard
        }
    };

    return (
        <div className="h-screen w-screen flex flex-row-reverse bg-[#1B4965] text-white m-0 justify-end items-center fixed top-0 right-0">
            <div className="pt-[2vh] px-[0.5vw] flex flex-col justify-start items-stretch w-[24vw] h-screen overflow-auto text-2xl">
                <div className="w-[150px] h-[150px] bg-[#8D8D8D] rounded-full flex justify-center items-center text-white text-lg font-bold m-5 mx-auto">
                    Pic
                </div>
                <div className="flex items-center justify-center text-5xl">اسم سامانه</div>
                <div className="w-[calc(100%-40px)] h-[2px] bg-[#8D8D8D] my-5 mx-auto rounded"></div>
                
                {/* Navigation Buttons */}
                <button
                    className={`m-[5px] rounded-[25px] inline-flex justify-center items-center h-[90px] text-4xl text-center cursor-pointer border-none text-white outline-none transition-colors duration-300 ease-in-out
                    ${selectedItem === 'dashboard' ? 'bg-[#3388BC]' : 'hover:bg-[#3388BC33] bg-transparent'}`}
                    onClick={() => handleSelect('dashboard')}
                >
                    داشبورد
                </button>
                <button
                    className={`m-[5px] rounded-[25px] inline-flex justify-center items-center h-[90px] text-4xl text-center cursor-pointer border-none text-white outline-none transition-colors duration-300 ease-in-out
                    ${selectedItem === 'records' ? 'bg-[#3388BC]' : 'hover:bg-[#3388BC33] bg-transparent'}`}
                    onClick={() => handleSelect('records')}
                >
                    سوابق
                </button>
                <button
                    className={`m-[5px] rounded-[25px] inline-flex justify-center items-center h-[90px] text-4xl text-center cursor-pointer border-none text-white outline-none transition-colors duration-300 ease-in-out
                    ${selectedItem === 'progress' ? 'bg-[#3388BC]' : 'hover:bg-[#3388BC33] bg-transparent'}`}
                    onClick={() => handleSelect('progress')}
                >
                    نمودار پیشرفت
                </button>
                <button
                    className={`m-[5px] rounded-[25px] inline-flex justify-center items-center h-[90px] text-4xl text-center cursor-pointer border-none text-white outline-none transition-colors duration-300 ease-in-out
                    ${selectedItem === 'roles' ? 'bg-[#3388BC]' : 'hover:bg-[#3388BC33] bg-transparent'}`}
                    onClick={() => handleSelect('roles')}
                >
                    مدیریت نقش ها
                </button>
                <button
                    className={`m-[5px] rounded-[25px] inline-flex justify-center items-center h-[90px] text-4xl text-center cursor-pointer border-none text-white outline-none transition-colors duration-300 ease-in-out
                    ${selectedItem === 'notifications' ? 'bg-[#3388BC]' : 'hover:bg-[#3388BC33] bg-transparent'}`}
                    onClick={() => handleSelect('notifications')}
                >
                    اعلان ها
                </button>
            </div>
            <div className="text-base bg-[#EBF2FA] w-[calc(100%-40px)] h-[calc(100%-40px)] m-5 mr-0 p-5 rounded-[25px] shadow-lg flex flex-col">
                {renderPanel()}
            </div>
        </div>
    );
}
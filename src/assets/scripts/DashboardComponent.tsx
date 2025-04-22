import { useState } from 'react';
import MainDashboardPanel from './Panels/MainDashboardPanel';
import HistoryPanel from './Panels/HistoryPanel';
import RoleManagementPanel from './Panels/RoleManagementPanel';
import NotificationsPanel from './Panels/NotificationsPanel';
import ImprovementChartPanel from './Panels/ImprovementChartPanel';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        <div className="vh-100 vw-100 d-flex flex-row-reverse bg-background position-fixed top-0 end-0">
            {/* Sidebar */}
            <div className="d-flex flex-column p-3 bg-background" style={{ width: '24vw' }}>
                <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center mx-auto mb-3" 
                     style={{ width: '150px', height: '150px' }}>
                    Pic
                </div>
                <h2 className="text-center text-white mb-4">اسم سامانه</h2>
                <hr className="text-white" />
                
                {/* Navigation Buttons */}
                <button
                    className={`custom-button mb-3 py-4 fs-5 ${selectedItem === 'dashboard' ? 'selected' : ''}`}
                    onClick={() => handleSelect('dashboard')}
                >
                    داشبورد
                </button>
                <button
                    className={`custom-button mb-3 py-4 fs-5 ${selectedItem === 'records' ? 'selected' : ''}`}
                    onClick={() => handleSelect('records')}
                >
                    سوابق
                </button>
                <button
                    className={`custom-button mb-3 py-4 fs-5 ${selectedItem === 'progress' ? 'selected' : ''}`}
                    onClick={() => handleSelect('progress')}
                >
                    نمودار پیشرفت
                </button>
                <button
                    className={`custom-button mb-3 py-4 fs-5 ${selectedItem === 'roles' ? 'selected' : ''}`}
                    onClick={() => handleSelect('roles')}
                >
                    مدیریت نقش ها
                </button>
                <button
                    className={`custom-button mb-3 py-4 fs-5 ${selectedItem === 'notifications' ? 'selected' : ''}`}
                    onClick={() => handleSelect('notifications')}
                >
                    اعلان ها
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 bg-mainscreen m-3 rounded-4 p-4">
                {renderPanel()}
            </div>
        </div>
    );
}
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
        <div className="background">
            <div className="dashboard-bar">
                <div className="circle">Pic</div> {/* Circle placeholder */}
                <div className="system-name">اسم سامانه</div>
                <div className="line"></div> {/* Line separator */}
                <button
                    className={`dashboard-bar-item ${selectedItem === 'dashboard' ? 'selected' : ''}`}
                    onClick={() => handleSelect('dashboard')}
                >
                    داشبورد
                </button>
                <button
                    className={`dashboard-bar-item ${selectedItem === 'records' ? 'selected' : ''}`}
                    onClick={() => handleSelect('records')}
                >
                    سوابق
                </button>
                <button
                    className={`dashboard-bar-item ${selectedItem === 'progress' ? 'selected' : ''}`}
                    onClick={() => handleSelect('progress')}
                >
                    نمودار پیشرفت
                </button>
                <button
                    className={`dashboard-bar-item ${selectedItem === 'roles' ? 'selected' : ''}`}
                    onClick={() => handleSelect('roles')}
                >
                    مدیریت نقش ها
                </button>
                <button
                    className={`dashboard-bar-item ${selectedItem === 'notifications' ? 'selected' : ''}`}
                    onClick={() => handleSelect('notifications')}
                >
                    اعلان ها
                </button>
            </div>
            <div className="mainScreen">
                {renderPanel()} {/* Render the selected panel */}
            </div>
        </div>
    );
}
import { useState } from 'react';

export default function BackGround() {
    const [selectedItem, setSelectedItem] = useState<string>('dashboard'); // Default to the first item

    const handleSelect = (item: string) => {
        setSelectedItem(item);
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
                <div className='main-contents'>
                    <div className='profile'>
                        <div className="circle">Pic</div>
                        <div className='user-name'>اسم کاربر</div>
                        <div className='row3'>
                            <div className="col1">نقش</div>
                            <button className="col2">مدت زمان</button> {/* Changed to a button */}
                        </div>
                        <div className='row4'></div>
                    </div>
                    <div className='information'>
                        <div className="search">
                            <button className="advanced-search">جستجو پ</button> {/* Advanced search as a button */}
                            <div className="normal-search">
                                <input
                                    type="text"
                                    placeholder="جستجو"
                                />
                                <button className="search-button">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="charts">
                            <div className='chart-1'>نمودار</div>
                            <div className='chart-2'>نمودار</div>
                        </div>
                        <div className="timeline"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
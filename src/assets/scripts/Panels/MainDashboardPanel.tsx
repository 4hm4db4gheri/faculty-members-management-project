import '../../styles/Panels/MainDashboardPanel.scss';

export default function MainDashboardPanel() {

    return (
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
    );
}
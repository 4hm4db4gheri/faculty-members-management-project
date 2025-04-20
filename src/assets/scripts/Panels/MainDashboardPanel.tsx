export default function MainDashboardPanel() {

    return (
        <div className='dashboard'>
            <div className='a'>
                <div className="circle">Pic</div>
                <div className='row2'>اسم کاربر</div>
                <div className='row3'>
                    <div className="col1">نقش</div>
                    <button className="col2">مدت زمان</button> {/* Changed to a button */}
                </div>
                <div className='row4'></div>
            </div>
            <div className='b'>
                <div className="row1">
                    <div className='col1'>جستجو پ</div>
                    <div className='col2'>جستجو</div>
                </div>
                <div className="row2">
                    <div className='col1'>نمودار</div>
                    <div className='col2'>نمودار</div>
                </div>
                <div className="row3"></div>
            </div>
        </div>
    );
}
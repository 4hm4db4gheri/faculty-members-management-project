import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function MainDashboardPanel() {
    return (
        <div className="container-fluid h-100">
            <div className="row h-100 g-4">
                {/* Profile Section */}
                <div className="col-4">
                    <div className="bg-white h-100 rounded-4 p-4 d-flex flex-column align-items-center">
                        <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center" 
                             style={{ width: '150px', height: '150px' }}>
                            Pic
                        </div>
                        <h2 className="text-dark mt-4 mb-5">اسم کاربر</h2>
                        <div className="row w-100 mt-auto mb-4">
                            <div className="col-3">
                                <div className="bg-danger text-white rounded-4 p-3 d-flex justify-content-center align-items-center">
                                    نقش
                                </div>
                            </div>
                            <div className="col-9">
                                <button className="btn btn-secondary w-100 rounded-4 p-3">
                                    مدت زمان
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Section */}
                <div className="col-8">
                    <div className="d-flex flex-column h-100 gap-4">
                        {/* Search Bar */}
                        <div className="bg-white rounded-4 p-3">
                            <div className="row g-3 align-items-center">
                                <div className="col-2">
                                    <button className="btn btn-light w-100 rounded-4">
                                        جستجو پ
                                    </button>
                                </div>
                                <div className="col-10">
                                    <div className="input-group">
                                        <input type="text" 
                                               className="form-control border-0" 
                                               placeholder="جستجو" />
                                        <button className="btn btn-light">
                                            <i className="bi bi-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="row g-4">
                            <div className="col-6">
                                <div className="bg-white rounded-4 p-4 d-flex justify-content-center align-items-center">
                                    نمودار
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="bg-white rounded-4 p-4 d-flex justify-content-center align-items-center">
                                    نمودار
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-4 flex-grow-1">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
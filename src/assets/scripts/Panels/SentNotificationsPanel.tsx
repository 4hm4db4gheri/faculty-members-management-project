import { useState } from "react";
import MyPagination from "../Elements/MyPagination";
import LoadingSpinner from "../Elements/LoadingSpinner";

interface SentNotification {
  id: number;
  title: string;
  date: string;
  recipientCount: number;
  subject: "مقاله" | "قرارداد";
  importance: "فوری" | "عادی";
}

export default function SentNotificationsPanel() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with API call later
  const mockNotifications: SentNotification[] = [
    {
      id: 1,
      title: "یادآوری مهلت ارسال مقاله",
      date: "۱۴۰۴/۰۳/۱۲",
      recipientCount: 15,
      subject: "مقاله",
      importance: "فوری"
    },
    {
      id: 2,
      title: "تمدید قرارداد پژوهشی",
      date: "۱۴۰۴/۰۳/۱۰",
      recipientCount: 8,
      subject: "قرارداد",
      importance: "عادی"
    },
    {
      id: 3,
      title: "درخواست اصلاح مقاله",
      date: "۱۴۰۴/۰۳/۰۸",
      recipientCount: 5,
      subject: "مقاله",
      importance: "فوری"
    },
    {
      id: 4,
      title: "اطلاعیه جلسه بررسی مقالات",
      date: "۱۴۰۴/۰۳/۰۵",
      recipientCount: 20,
      subject: "مقاله",
      importance: "عادی"
    },
    {
      id: 5,
      title: "تمدید مهلت تحویل قرارداد",
      date: "۱۴۰۴/۰۳/۰۲",
      recipientCount: 12,
      subject: "قرارداد",
      importance: "فوری"
    }
  ];

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(mockNotifications.length / ITEMS_PER_PAGE);
  const currentNotifications = mockNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <h2 className="text-2xl font-bold text-gray-800">اعلان‌های ارسال شده</h2>
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4">
          {currentNotifications.map((notification) => (
            <div
              key={notification.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 rounded-[15px] bg-white p-4 shadow"
            >
              <div className="text-right">
                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
              </div>
              <div className="text-center text-gray-600">
                {notification.date}
              </div>
              <div className="text-center">
                <span className={`rounded-full px-3 py-1 text-sm ${
                  notification.importance === "فوری" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {notification.importance}
                </span>
              </div>
              <div className="text-center text-gray-600">
                {notification.recipientCount} دریافت‌کننده
              </div>
            </div>
          ))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mt-auto">
          <MyPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

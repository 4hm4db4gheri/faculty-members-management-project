import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

const allEvents = [
  {
    title: "پیشنهاد دانشیاری",
    type: "پیشنهاد دانشیاری",
    priority: 10,
    date: new Date("2025-10-10"),
  },
  {
    title: "تمدید درخواست رسمی آزمایشی",
    type: "تمدید درخواست رسمی آزمایشی",
    priority: 6,
    date: new Date("2025-08-01"),
  },
  {
    title: "اخطار برای عدم اقدام به رسمی آزمایشی",
    type: "اخطار برای عدم اقدام به رسمی آزمایشی",
    priority: 8,
    date: new Date("2025-06-01"),
  },
  {
    title: "امکان درخواست رسمی قطعی",
    type: "امکان درخواست رسمی قطعی",
    priority: 7,
    date: new Date("2025-09-01"),
  },
  {
    title: "پایان مهلت درخواست رسمی آزمایشی",
    type: "پایان مهلت درخواست رسمی آزمایشی",
    priority: 9,
    date: new Date("2025-07-01"),
  },
  {
    title: "یادآوری رسمی قطعی",
    type: "یادآوری رسمی قطعی",
    priority: 5,
    date: new Date("2025-12-01"),
  },
  {
    title: "پیشنهاد استادی",
    type: "پیشنهاد استادی",
    priority: 3,
    date: new Date("2026-01-01"),
  },
];

const eventTypes = [
  "تمدید قرارداد پیمانی",
  "امکان درخواست رسمی آزمایشی",
  "اخطار برای عدم اقدام به رسمی آزمایشی",
  "تمدید درخواست رسمی آزمایشی",
  "پایان مهلت درخواست رسمی آزمایشی",
  "امکان درخواست رسمی قطعی",
  "یادآوری رسمی قطعی",
  "پایان مهلت درخواست رسمی قطعی",
  "پیشنهاد دانشیاری",
  "پیشنهاد استادی",
];

const typeColors: { [key: string]: string } = {
  "تمدید قرارداد پیمانی": "bg-blue-600",
  "امکان درخواست رسمی آزمایشی": "bg-green-600",
  "اخطار برای عدم اقدام به رسمی آزمایشی": "bg-red-600",
  "تمدید درخواست رسمی آزمایشی": "bg-yellow-500",
  "پایان مهلت درخواست رسمی آزمایشی": "bg-purple-600",
  "امکان درخواست رسمی قطعی": "bg-pink-600",
  "یادآوری رسمی قطعی": "bg-orange-500",
  "پایان مهلت درخواست رسمی قطعی": "bg-indigo-600",
  "پیشنهاد دانشیاری": "bg-emerald-600",
  "پیشنهاد استادی": "bg-cyan-600",
};

const rangeOptions = [
  { label: "۳ ماه", value: 3 },
  { label: "۶ ماه", value: 6 },
  { label: "۱ سال", value: 12 },
  { label: "۲ سال", value: 24 },
  { label: "۳ سال", value: 36 },
  { label: "۵ سال", value: 60 },
];

const TimelineComponent: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState(6);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const future = new Date();
    future.setMonth(now.getMonth() + selectedRange);

    return allEvents
      .filter(
        (e) =>
          e.date >= now &&
          e.date <= future &&
          (selectedTypes.length === 0 || selectedTypes.includes(e.type)),
      )
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }, [selectedRange, selectedTypes]);

  return (
    <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-6">
      <h2 className="mt-6 mb-8 text-center text-3xl font-bold text-gray-800">
        تایم‌لاین رویدادها
      </h2>

      {/* فیلتر بازه زمانی */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {rangeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedRange(opt.value)}
            className={`rounded-full border px-3 py-1 text-sm font-medium ${
              selectedRange === opt.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* فیلتر نوع رویداد */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() =>
              setSelectedTypes((prev) =>
                prev.includes(type)
                  ? prev.filter((t) => t !== type)
                  : [...prev, type],
              )
            }
            className={`rounded-full border px-3 py-1 text-xs ${
              selectedTypes.includes(type)
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* تایم‌لاین افقی */}
      <div className="overflow-x-auto">
        <div className="mt-16 flex min-w-full gap-8 px-4 pb-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex min-w-[200px] flex-shrink-0 flex-col items-center"
            >
              <div
                className={`h-14 w-14 rounded-full ${typeColors[event.type] || "bg-gray-600"} mb-2 flex items-center justify-center font-bold text-white shadow-lg`}
              >
                {event.priority}
              </div>
              <div className="text-center text-gray-800">
                <h4 className="text-sm font-semibold">{event.title}</h4>
                <p className="mt-1 text-xs text-gray-500">
                  {event.date.toLocaleDateString("fa-IR")}
                </p>
              </div>
            </motion.div>
          ))}
          {filteredEvents.length === 0 && (
            <p className="w-full text-center text-gray-400">
              رویدادی برای نمایش وجود ندارد.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineComponent;

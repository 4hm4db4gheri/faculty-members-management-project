import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  getTeacherTimeline,
  type TimelineEventItem,
} from "../scripts/Services/apiEndpoints";
import { jalaliToGregorian } from "../scripts/utils/dateUtils";

const EVENTS_PER_ROW = 5;

type EventStatus = "past" | "current" | "future";

function parseJalaliEventDate(isoStr: string): Date {
  try {
    const datePart = (isoStr ?? "").split("T")[0];
    if (!datePart) return new Date(NaN);
    const jalaliStr = datePart.replace(/-/g, "/");
    return jalaliToGregorian(jalaliStr);
  } catch {
    return new Date(NaN);
  }
}

function getEventStatus(
  eventDate: Date,
  isFirstFutureEvent: boolean,
): EventStatus {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (eventDate < startOfToday) return "past";
  if (isFirstFutureEvent) return "current";
  return "future";
}

function getStatusColor(status: EventStatus): string {
  switch (status) {
    case "past":
      return "bg-green-600";
    case "current":
      return "bg-yellow-500";
    case "future":
      return "bg-gray-400";
  }
}

interface TimelineComponentProps {
  teacherId: string | number;
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ teacherId }) => {
  const [events, setEvents] = useState<TimelineEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTeacherTimeline(String(teacherId));
        if (!response.error && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setError(response.message?.[0] || "خطا در دریافت تایم‌لاین");
        }
      } catch {
        setError("خطا در ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, [teacherId]);

  const sortedEvents = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const mapped = [...events]
      .filter((e) => e && typeof e.eventDate === "string")
      .map((e) => ({
        ...e,
        date: parseJalaliEventDate(e.eventDate),
      }))
      .filter((e) => !isNaN(e.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const firstFutureIndex = mapped.findIndex((e) => e.date >= startOfToday);

    return mapped.map((e, i) => ({
      ...e,
      status: getEventStatus(
        e.date,
        i === firstFutureIndex && firstFutureIndex >= 0,
      ),
    }));
  }, [events]);

  const rows = useMemo(() => {
    const result: Array<{ events: typeof sortedEvents; rowIndex: number }> = [];
    for (let i = 0; i < sortedEvents.length; i += EVENTS_PER_ROW) {
      const rowEvents = sortedEvents.slice(i, i + EVENTS_PER_ROW);
      result.push({ events: rowEvents, rowIndex: result.length });
    }
    return result;
  }, [sortedEvents]);

  const formatDisplayDate = (isoStr: string): string => {
    const datePart = (isoStr ?? "").split("T")[0];
    if (!datePart) return "";
    const [y, m, d] = datePart.split("-");
    return `${y ?? ""}/${m ?? ""}/${d ?? ""}`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-gray-500">در حال بارگذاری تایم‌لاین...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const renderEventNode = (
    event: (typeof sortedEvents)[0],
    globalIndex: number,
  ) => {
    const isCurrent = event.status === "current";
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(globalIndex * 0.05, 0.5) }}
        whileHover={{ scale: 1.12, zIndex: 10 }}
        className="flex max-w-[180px] min-w-[160px] flex-shrink-0 cursor-default flex-col items-center transition-shadow duration-200 hover:drop-shadow-lg"
        key={`${event.title}-${event.eventDate}-${globalIndex}`}
      >
        <motion.div
          className={`relative h-11 w-11 rounded-full ${getStatusColor(event.status)} flex flex-shrink-0 items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white`}
          animate={
            isCurrent
              ? {
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    "0 0 0 6px rgba(234, 179, 8, 0.35)",
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  ],
                }
              : undefined
          }
          transition={
            isCurrent
              ? { duration: 0.9, repeat: Infinity, repeatType: "reverse" }
              : undefined
          }
        >
          {globalIndex + 1}
        </motion.div>
        <div className="mt-2 w-full text-center text-gray-800">
          <h4 className="text-xs leading-tight font-semibold">{event.title}</h4>
          <p className="mt-0.5 text-[10px] text-gray-500">
            {formatDisplayDate(event.eventDate)}
          </p>
        </div>
      </motion.div>
    );
  };

  const renderConnector = () => (
    <div
      className="flex min-w-[40px] flex-shrink-0 items-center pt-5"
      aria-hidden
    >
      <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-300 to-gray-400" />
      <svg
        className="h-5 w-5 flex-shrink-0 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-6">
      <h2 className="mt-6 mb-6 text-center text-3xl font-bold text-gray-800">
        تایم‌لاین رویدادها
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-2 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-green-600" />
          گذشته
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          پیش رو
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-gray-400" />
          آینده
        </span>
      </div>

      <div
        className="max-h-[70vh] overflow-x-auto overflow-y-auto overscroll-contain"
        dir="ltr"
      >
        <div className="flex min-h-[200px] flex-col gap-0 px-4 pt-6 pb-6">
          {sortedEvents.length === 0 ? (
            <p className="w-full py-12 text-center text-gray-400">
              رویدادی برای نمایش وجود ندارد.
            </p>
          ) : (
            rows.map(({ events: rowEvents, rowIndex }, ri) => {
              const isRtl = rowIndex % 2 === 1;
              const globalStartIndex = rowIndex * EVENTS_PER_ROW;
              // RTL: با flex-row-reverse اولین المان (رویداد اول ردیف) سمت راست قرار می‌گیرد؛ ترتیب را برعکس نکن
              const orderedEvents = rowEvents;

              const alignRow = isRtl ? "items-end" : "items-start";
              const selfAlign = isRtl ? "self-end" : "self-start";
              return (
                <div
                  key={rowIndex}
                  className={`x-full inline-flex flex-col ${alignRow} ${selfAlign}`}
                >
                  <div
                    className={`flex flex-nowrap items-start gap-0 ${isRtl ? "flex-row-reverse justify-end" : "justify-start"}`}
                  >
                    {orderedEvents.map((event, localIdx) => {
                      const globalIdx = globalStartIndex + localIdx;
                      return (
                        <React.Fragment key={globalIdx}>
                          {renderEventNode(event, globalIdx)}
                          {localIdx < orderedEvents.length - 1 &&
                            renderConnector()}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {ri < rows.length - 1 && (
                    <div
                      className={`flex w-full py-1 ${isRtl ? "justify-start pl-[65px]" : "justify-end pr-[65px]"}`}
                      aria-hidden
                    >
                      <svg
                        className="h-12 w-10 shrink-0 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 40 56"
                      >
                        <line
                          x1="20"
                          y1="0"
                          x2="20"
                          y2="38"
                          strokeOpacity="0.8"
                        />
                        <path
                          d="M14 32L20 48L26 32"
                          strokeOpacity="1"
                          fill="none"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineComponent;

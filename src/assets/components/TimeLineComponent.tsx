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
        whileHover={{ scale: 1.08, zIndex: 10 }}
        className="flex max-w-[120px] min-w-[100px] flex-shrink-0 cursor-default flex-col items-center transition-shadow duration-200 hover:drop-shadow-lg sm:max-w-[150px] sm:min-w-[130px] md:max-w-[180px] md:min-w-[160px]"
        key={`${event.title}-${event.eventDate}-${globalIndex}`}
      >
        <motion.div
          className={`relative h-8 w-8 rounded-full ${getStatusColor(event.status)} flex flex-shrink-0 items-center justify-center text-xs font-bold text-white shadow-md ring-1 ring-white sm:h-10 sm:w-10 sm:text-sm sm:ring-2 md:h-11 md:w-11`}
          animate={
            isCurrent
              ? {
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    "0 0 0 4px rgba(234, 179, 8, 0.35)",
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
        <div className="mt-1 w-full text-center text-gray-800 sm:mt-2">
          <h4 className="text-[10px] leading-tight font-semibold sm:text-xs md:text-xs">{event.title}</h4>
          <p className="mt-0.5 text-[9px] text-gray-500 sm:text-[10px]">
            {formatDisplayDate(event.eventDate)}
          </p>
        </div>
      </motion.div>
    );
  };

  const renderConnector = (isRtl: boolean) => (
    <div
      className={`flex min-w-[20px] flex-shrink-0 items-center pt-4 sm:min-w-[30px] sm:pt-4 md:min-w-[40px] md:pt-5 ${
        isRtl ? "flex-row-reverse" : ""
      }`}
      aria-hidden
    >
      <div
        className={`h-0.5 flex-1 ${
          isRtl
            ? "bg-gradient-to-l from-gray-300 to-gray-400"
            : "bg-gradient-to-r from-gray-300 to-gray-400"
        }`}
      />
      <svg
        className={`h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
          isRtl ? "rotate-180" : ""
        }`}
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
    <div className="mx-auto w-full max-w-6xl rounded-lg bg-white p-3 sm:rounded-xl sm:p-4 md:p-6">
      <h2 className="mt-3 mb-3 text-center text-lg font-bold text-gray-800 sm:mt-4 sm:mb-4 sm:text-xl md:mt-6 md:mb-6 md:text-2xl lg:text-3xl">
        تایم‌لاین رویدادها
      </h2>

      <div className="mb-3 flex flex-wrap justify-center gap-1.5 text-[10px] text-gray-600 sm:mb-4 sm:gap-2 sm:text-xs">
        <span className="flex items-center gap-0.5 sm:gap-1">
          <span className="h-2 w-2 rounded-full bg-green-600 sm:h-3 sm:w-3" />
          گذشته
        </span>
        <span className="flex items-center gap-0.5 sm:gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
          پیش رو
        </span>
        <span className="flex items-center gap-0.5 sm:gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400 sm:h-3 sm:w-3" />
          آینده
        </span>
      </div>

      <div
        className="max-h-[60vh] overflow-x-auto overflow-y-auto overscroll-contain sm:max-h-[65vh] md:max-h-[70vh]"
        dir="ltr"
      >
        <div className="flex min-h-[150px] flex-col gap-0 px-2 pt-4 pb-4 sm:min-h-[180px] sm:px-3 sm:pt-5 sm:pb-5 md:min-h-[200px] md:px-4 md:pt-6 md:pb-6">
          {sortedEvents.length === 0 ? (
            <p className="w-full py-12 text-center text-gray-400">
              رویدادی برای نمایش وجود ندارد.
            </p>
          ) : (
            rows.map(({ events: rowEvents, rowIndex }, ri) => {
              const isRtl = rowIndex % 2 === 1;
              const globalStartIndex = rowIndex * EVENTS_PER_ROW;
              const orderedEvents = rowEvents;

              const alignRow = isRtl ? "items-end" : "items-start";
              const selfAlign = isRtl ? "self-end" : "self-start";
              return (
                <div
                  key={rowIndex}
                  className={`w-full inline-flex flex-col ${alignRow} ${selfAlign}`}
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
                            renderConnector(isRtl)}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {ri < rows.length - 1 && (
                    <div
                      className={`flex w-full justify-center py-0.5 sm:py-1`}
                      aria-hidden
                    >
                      <svg
                        className="h-8 w-6 shrink-0 text-gray-400 sm:h-10 sm:w-8 md:h-12 md:w-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 40 56"
                      >
                        <line
                          x1="20"
                          y1="5"
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

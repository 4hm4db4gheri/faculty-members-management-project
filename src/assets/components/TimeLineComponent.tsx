import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  getTeacherTimeline,
  type TimelineEventItem,
} from "../scripts/Services/apiEndpoints";

const EVENTS_PER_ROW = 5;

// Where the API data is split into two separate timelines.
// First 4 items = employment-status timeline, the rest = academic-rank timeline.
const TIMELINE_SPLIT_INDEX = 4;

function getStatusColor(status: TimelineEventItem["status"]): string {
  switch (status) {
    case "Done":
      return "bg-green-600";
    case "Failed":
      return "bg-red-500";
    case "Pending":
      return "bg-yellow-500";
    case "Future":
      return "bg-gray-400";
    default:
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

  // Split the flat API list into two independent timelines.
  const { firstTimeline, secondTimeline } = useMemo(() => {
    const safeEvents = events.filter((e) => e && typeof e.title === "string");
    return {
      firstTimeline: safeEvents.slice(0, TIMELINE_SPLIT_INDEX),
      secondTimeline: safeEvents.slice(TIMELINE_SPLIT_INDEX),
    };
  }, [events]);

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

  const renderEventNode = (event: TimelineEventItem, globalIndex: number) => {
    const isCurrent = event.status === "Pending";
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(globalIndex * 0.05, 0.5) }}
        whileHover={{ scale: 1.08, zIndex: 10 }}
        // عرض ثابت برای هم‌ترازی دقیق ستون‌ها
        className="flex w-[120px] flex-shrink-0 cursor-default flex-col items-center transition-shadow duration-200 hover:drop-shadow-lg sm:w-[150px] md:w-[180px]"
        key={`${event.title}-${globalIndex}`}
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
        </div>
      </motion.div>
    );
  };

  const renderConnector = (isRtl: boolean) => (
    // یک SVG واحد (خط + سرپیکان) تا در هیچ سطح زومی از هم جدا نشود
    <div
      className="flex w-[20px] h-8 sm:w-[30px] sm:h-10 md:w-[40px] md:h-11 flex-shrink-0 items-center justify-center"
      aria-hidden
    >
      <svg
        className={`w-full text-gray-400 ${isRtl ? "rotate-180" : ""}`}
        viewBox="0 0 24 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        preserveAspectRatio="xMidYMid meet"
      >
        <path d="M1 6h16M13 2l4 4-4 4" />
      </svg>
    </div>
  );

  // یک تایم‌لاین مستقل را با چیدمان مارپیچ (snake) رندر می‌کند
  const renderTimeline = (title: string, timelineEvents: TimelineEventItem[]) => {
    const rows: TimelineEventItem[][] = [];
    for (let i = 0; i < timelineEvents.length; i += EVENTS_PER_ROW) {
      rows.push(timelineEvents.slice(i, i + EVENTS_PER_ROW));
    }

    // Placeholder padding keeps columns aligned across a multi-row snake layout.
    // For a single-row timeline it only pushes the nodes off-center, so skip it.
    const shouldPad = rows.length > 1;

    return (
      <div className="w-full">
        <h3 className="mb-3 text-center text-base font-bold text-gray-700 sm:mb-4 sm:text-lg md:text-xl">
          {title}
        </h3>

        <div className="flex justify-center overflow-x-auto overscroll-contain" dir="ltr">
          <div className="flex flex-col gap-0 px-2 pt-4 pb-4 sm:px-3 sm:pt-5 sm:pb-5 md:px-4 md:pt-6 md:pb-6 w-max">
            {timelineEvents.length === 0 ? (
              <p className="w-full py-12 text-center text-gray-400">
                رویدادی برای نمایش وجود ندارد.
              </p>
            ) : (
              rows.map((rowEvents, rowIndex) => {
                const isRtl = rowIndex % 2 === 1;
                const globalStartIndex = rowIndex * EVENTS_PER_ROW;

                // پر کردن ردیف با placeholder برای حفظ ساختار شبکه‌ای
                const paddedEvents: (TimelineEventItem | { isPlaceholder: true })[] = [
                  ...rowEvents,
                ];
                if (shouldPad) {
                  while (paddedEvents.length < EVENTS_PER_ROW) {
                    paddedEvents.push({ isPlaceholder: true });
                  }
                }

                return (
                  <div key={rowIndex} className="flex flex-col w-full">
                    <div
                      className={`flex flex-nowrap items-start ${isRtl ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {paddedEvents.map((event, localIdx) => {
                        if ("isPlaceholder" in event) {
                          return (
                            <React.Fragment key={`placeholder-${localIdx}`}>
                              <div className="flex w-[120px] sm:w-[150px] md:w-[180px] flex-shrink-0" />
                              {localIdx < EVENTS_PER_ROW - 1 && <div className="flex w-[20px] sm:w-[30px] md:w-[40px] flex-shrink-0" />}
                            </React.Fragment>
                          );
                        }

                        const globalIdx = globalStartIndex + localIdx;
                        return (
                          <React.Fragment key={globalIdx}>
                            {renderEventNode(event, globalIdx)}
                            {/* کانکتور فقط بین آیتم‌های واقعی */}
                            {localIdx < EVENTS_PER_ROW - 1 && localIdx < rowEvents.length - 1 && renderConnector(isRtl)}
                            {/* حفظ فاصله‌ی خالی در انتهای آیتم‌های واقعی اگر ردیف پر نیست */}
                            {shouldPad && localIdx === rowEvents.length - 1 && localIdx < EVENTS_PER_ROW - 1 && <div className="flex w-[20px] sm:w-[30px] md:w-[40px] flex-shrink-0" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    {rowIndex < rows.length - 1 && (
                      <div
                        className={`flex w-full py-0.5 sm:py-1 ${isRtl ? "justify-start" : "justify-end"}`}
                        aria-hidden
                      >
                        <div className="flex w-[120px] flex-shrink-0 justify-center sm:w-[150px] md:w-[180px]">
                          <svg
                            className="h-8 w-6 shrink-0 text-gray-400 sm:h-10 sm:w-8 md:h-12 md:w-10 m-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 40 56"
                          >
                            <line x1="20" y1="5" x2="20" y2="38" strokeOpacity="0.8" />
                            <path d="M14 32L20 48L26 32" strokeOpacity="1" fill="none" />
                          </svg>
                        </div>
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

  return (
    <div className="mx-auto w-full max-w-6xl rounded-lg bg-white p-3 sm:rounded-xl sm:p-4 md:p-6">
      <h2 className="mt-3 mb-3 text-center text-lg font-bold text-gray-800 sm:mt-4 sm:mb-4 sm:text-xl md:mt-6 md:mb-6 md:text-2xl lg:text-3xl">
        تایم‌لاین رویدادها
      </h2>

      <div className="mb-3 flex flex-wrap justify-center gap-2.5 text-[10px] text-gray-600 sm:mb-4 sm:gap-4 sm:text-xs">
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-600 sm:h-3 sm:w-3" />
          انجام شده
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
          پیش رو (جاری)
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400 sm:h-3 sm:w-3" />
          آینده
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-600 sm:h-3 sm:w-3" />
          معوق (گذشته)
        </span>
      </div>

      {/* دو تایم‌لاین جداگانه، به صورت عمودی روی هم چیده شده‌اند */}
      <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
        {renderTimeline("وضعیت استخدامی", firstTimeline)}
        {renderTimeline("مرتبه علمی", secondTimeline)}
      </div>
    </div>
  );
};

export default TimelineComponent;

import type { Teacher } from "../types/Teacher";

interface MyTeacherContainerProps {
  teacher: Teacher;
  onClick: (teacher: Teacher) => void;
}

export default function MyTeacherContainer({  
  teacher,
  onClick,
}: MyTeacherContainerProps) {
  return (
    <button
      onClick={() => onClick(teacher)}
      className="grid h-auto min-h-[60px] grid-cols-1 gap-2 rounded-[15px] bg-white p-3 text-left shadow-sm transition-colors hover:bg-gray-50 focus:outline-none sm:min-h-[70px] sm:grid-cols-4 sm:gap-0 sm:rounded-[20px] sm:p-2 md:min-h-[80px] md:rounded-[25px] lg:h-14"
    >
      {/* Mobile Card Layout */}
      <div className="col-span-1 flex flex-col gap-1 sm:hidden">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-black">
            {`${teacher.firstName} ${teacher.lastName}`}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <span className="rounded bg-gray-100 px-2 py-0.5">
            {teacher.faculty}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5">
            {teacher.rank}
          </span>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden content-center pr-4 text-start text-xs text-black sm:col-span-2 sm:block sm:pr-8 md:pr-12 lg:pr-20 lg:text-sm">
        {`${teacher.firstName} ${teacher.lastName}`}
      </div>
      <div className="hidden content-center text-center text-xs text-black sm:col-span-1 sm:block lg:text-sm">
        {teacher.faculty}
      </div>
      <div className="hidden content-center text-center text-xs text-black sm:col-span-1 sm:block lg:text-sm">
        {teacher.rank}
      </div>
    </button>
  );
}

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
      className="grid h-14 grid-cols-4 rounded-[25px] bg-white py-2 text-left transition-colors hover:bg-gray-50 focus:outline-none"
    >
      <div className="col-span-2 content-center pr-20 text-start text-black">
        {`${teacher.firstName} ${teacher.lastName}`}
      </div>
      <div className="col-span-1 content-center text-center text-black">
        {teacher.faculty}
      </div>
      <div className="col-span-1 content-center text-center text-black">
        {teacher.rank}
      </div>
    </button>
  );
}

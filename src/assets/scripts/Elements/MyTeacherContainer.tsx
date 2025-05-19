interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  faculty: string;
  rank: string;
}

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
      className="grid h-20 grid-cols-4 rounded-[25px] bg-white text-left transition-colors hover:bg-gray-50 focus:outline-none"
    >
      <div className="col-span-2 content-center pr-20 text-start text-black text-xl">
        {`${teacher.firstName} ${teacher.lastName}`}
      </div>
      <div className="col-span-1 content-center text-center text-black text-xl">
        {teacher.faculty}
      </div>
      <div className="col-span-1 content-center text-center text-black text-xl">
        {teacher.rank}
      </div>
    </button>
  );
}
interface Teacher {
  firstName: string;
  lastName: string;
  faculty: string;
  rank: string;
}

interface UserInfoProps {
  teacher: Teacher;
  onBack: () => void;
}

export default function UserInfo({ teacher, onBack }: UserInfoProps) {
  return (
    <div className="h-full">
      <button
        onClick={onBack}
        className="mb-4 rounded-[25px] bg-white px-4 py-2 text-black hover:bg-gray-50"
      >
        بازگشت
      </button>
      
      <div className="rounded-[25px] bg-white p-6">
        <h2 className="mb-6 text-2xl">اطلاعات استاد</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-600">نام:</div>
          <div>{teacher.firstName}</div>
          <div className="text-gray-600">نام خانوادگی:</div>
          <div>{teacher.lastName}</div>
          <div className="text-gray-600">دانشکده:</div>
          <div>{teacher.faculty}</div>
          <div className="text-gray-600">رتبه علمی:</div>
          <div>{teacher.rank}</div>
        </div>
      </div>
    </div>
  );
}
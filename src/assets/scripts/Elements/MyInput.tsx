import { ChangeEvent } from "react";

interface MyInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function MyInput({
  placeholder = "",
  value = "",
  onChange,
  className = "",
}: MyInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative inline-block w-full">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-[25px] bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 outline-none ring-inset placeholder:text-gray-700 hover:bg-gray-50 ${className}`}
        dir="rtl"
      />
    </div>
  );
}

import { ChangeEvent } from "react";

interface MyInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  'data-testid'?: string;
}

export default function MyInput({
  placeholder,
  value,
  onChange,
  'data-testid': dataTestId,
}: MyInputProps) {
  return (
    <div className="relative inline-block w-full">
      <input
        type="text"
        data-testid={dataTestId}
        className="w-full rounded-[25px] bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 outline-none ring-inset placeholder:text-gray-700 hover:bg-gray-50"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="rtl"
      />
    </div>
  );
}

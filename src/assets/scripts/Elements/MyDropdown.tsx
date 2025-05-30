import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface DropdownProps {
  options: readonly string[];
  defaultOption?: string;
  onSelect?: (selected: string) => void;
  label?: string;
  className?: string;
}

export default function Dropdown({
  options,
  defaultOption,
  onSelect,
  label,
  className = "",
}: DropdownProps) {
  const [selectedOption, setSelectedOption] = useState(defaultOption || "همه");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="absolute -top-3 right-4 bg-white px-2 text-sm text-gray-600">
          {label}
        </label>
      )}
      <Menu as="div" className="relative inline-block w-full">
        <div>
          <MenuButton className="inline-flex w-full items-center justify-between rounded-[25px] bg-white px-3 py-4 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
            <span className="text-right text-gray-500">{selectedOption}</span>
            <ChevronDownIcon
              aria-hidden="true"
              className="size-5 text-gray-400"
            />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden"
        >
          <div className="flex w-full flex-col">
            <MenuItem key="همه">
              {({ active }) => (
                <button
                  className={`w-full px-4 py-2 text-right text-sm ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`}
                  onClick={() => handleSelect("همه")}
                >
                  همه
                </button>
              )}
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option}>
                {({ active }) => (
                  <button
                    className={`w-full px-4 py-2 text-right text-sm ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}

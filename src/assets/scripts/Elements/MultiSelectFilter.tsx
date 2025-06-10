import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface MultiSelectFilterProps {
  options: readonly string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  label?: string; // Optional label for the button
  className?: string; // Optional class for the container
}

export default function MultiSelectFilter({
  options,
  selectedOptions,
  onSelectionChange,
  label = "فیلتر",
  className = "",
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckboxChange = (option: string, isChecked: boolean) => {
    let newSelection;
    if (isChecked) {
      newSelection = [...selectedOptions, option];
    } else {
      newSelection = selectedOptions.filter((item) => item !== option);
    }
    onSelectionChange(newSelection);
  };

  const handleToggleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      onSelectionChange([...options]);
    } else {
      onSelectionChange([]);
    }
  };

  // Check if all options are selected
  const allSelected =
    options.length > 0 && selectedOptions.length === options.length;

  return (
    <div
      className={`relative inline-block text-right ${className}`}
      ref={dropdownRef}
    >
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="ring-opacity-5 absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {/* Select All/Deselect All option */}
            {options.length > 0 && (
              <label
                className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                tabIndex={-1}
                role="menuitem"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 rounded text-blue-600"
                  checked={allSelected}
                  onChange={(e) => handleToggleSelectAll(e.target.checked)}
                />
                <span className="mr-2">
                  {allSelected ? "لغو انتخاب همه" : "انتخاب همه"}
                </span>
              </label>
            )}

            {/* Individual options */}
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                tabIndex={-1}
                role="menuitem"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 rounded text-blue-600"
                  checked={selectedOptions.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(option, e.target.checked)
                  }
                />
                <span className="mr-2">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

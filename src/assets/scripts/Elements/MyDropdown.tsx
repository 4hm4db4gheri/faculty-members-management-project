import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";

interface DropdownProps {
  options: readonly string[];
  defaultOption?: string;
  onSelect?: (selected: string | string[]) => void;
  label?: string;
  className?: string;
  value?: string | string[];
  multiSelect?: boolean;
}

export default function Dropdown({
  options,
  defaultOption,
  onSelect,
  label,
  className = "",
  value,
  multiSelect = false,
}: DropdownProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    multiSelect
      ? Array.isArray(value)
        ? value
        : []
      : value
        ? [value as string]
        : [],
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOptions(
        multiSelect ? (Array.isArray(value) ? value : []) : [value as string],
      );
    }
  }, [value, multiSelect]);

  const handleSelect = (option: string) => {
    let newSelected: string[];

    if (multiSelect) {
      if (selectedOptions.includes(option)) {
        // If already selected, remove it
        newSelected = selectedOptions.filter((item) => item !== option);
      } else {
        // Add to selection
        newSelected = [...selectedOptions, option].sort((a, b) => {
          // Sort by the number of days (extract number from "X روز قبل")
          const daysA = parseInt(a.split(" ")[0]);
          const daysB = parseInt(b.split(" ")[0]);
          return daysA - daysB;
        });
      }
    } else {
      // Single select mode
      newSelected = [option];
    }

    setSelectedOptions(newSelected);
    if (onSelect) {
      if (multiSelect) {
        onSelect(newSelected);
      } else {
        onSelect(newSelected[0]);
      }
    }
  };

  const getDisplayValue = () => {
    if (selectedOptions.length === 0) {
      return defaultOption || "انتخاب کنید";
    }

    if (multiSelect) {
      return selectedOptions.join("، ");
    }

    return selectedOptions[0];
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
          <MenuButton className="inline-flex w-full items-center justify-between rounded-[25px] bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
            <span className="text-right text-gray-500">
              {getDisplayValue()}
            </span>
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
            {options.map((option) => (
              <MenuItem key={option}>
                {({ active }) => (
                  <button
                    className={`w-full px-4 py-2 text-right text-sm ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } ${selectedOptions.includes(option) ? "bg-blue-50" : ""}`}
                    onClick={() => handleSelect(option)}
                  >
                    {selectedOptions.includes(option) && "✓ "}
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

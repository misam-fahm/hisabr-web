import React, { useRef, useEffect } from "react";

// Dropdown Component
const Dropdown = ({
  label,
  options,
  selectedOption,
  className,
  shadowclassName,
  widthchange,
  onSelect,
  isOpen,
  toggleOpen,
}: {
  label?: string;
  options: string[];
  selectedOption?: string;
  className?: string;
  shadowclassName?: string;
  widthchange?: string;
  onSelect: (option: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleOpen();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleOpen]);

  return (
    <div
      ref={dropdownRef}
      className={`${className || "relative below-md:w-full"} ${widthchange || "below-md:w-[100%] below-lg:w-[260px]"}`}
    >
      <p
        className={`text-[#2D374880] text-[12px] below-md:hidden ${
          label ? "mb-2" : ""
        }`}
      >
        {label}
      </p>
      {/* Dropdown Button */}
      <button
        onClick={toggleOpen}
        className={`bg-[#ffffff] text-[#4B4B4B] ${
          shadowclassName ? shadowclassName : "shadow"
        } shadow px-4 py-[10px] h-[35px] w-[260px] ${widthchange || "below-md:w-[100%] below-lg:w-[260px]"} rounded flex items-center justify-between below-md:w-full text-[12px] focus:outline-none`}
      >
        <span>{selectedOption || "Year"}</span>
        <img
          src="./images/dropdown1.svg"
          className={`ml-3 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 w-full mt-1 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded ${
            shadowclassName ? shadowclassName : "shadow"
          } shadow`}
          style={{ zIndex: 50 }}
        >
          {options?.map((option, index) => (
            <div
              key={index}
              onClick={() => onSelect(option)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

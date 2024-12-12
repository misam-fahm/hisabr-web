import React, { useState } from "react";

// Dropdown Component
const Dropdown = ({
  label,
  options,
  selectedOption,
  className,
  onSelect,
  isOpen,
  toggleOpen,
}: {
  label: string;
  options: string[];
  selectedOption: string;
  className?: string ;
  onSelect: (option: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
}) => (
  <div className={`${className ? className : "relative w-[30%] below-md:w-full"}`}>
    <p className="text-[#2D374880] text-[12px] mb-2">{label}</p>
    {/* Dropdown Button */}
    <button
      onClick={toggleOpen}
      className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
    >
      <span>{selectedOption}</span>
      <img
        src="./images/icon.svg"
        className={`w-4 h-4 ml-2 transition-transform duration-200 ${
          isOpen ? "transform rotate-180" : ""
        }`}
      />
    </button>

    {/* Dropdown Menu */}
    {isOpen && (
      <div
        className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
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

export default Dropdown

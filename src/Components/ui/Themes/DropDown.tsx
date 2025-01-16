import React, { useRef, useEffect,useState } from "react";
import { FieldError, FieldErrorsImpl, FieldValues, Merge, useFormContext} from "react-hook-form";

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
  errors,
}: {
  label?: string;
  errors?:any;
  options: any;
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
     
      className={`${className || "relative below-md:w-full"} ${widthchange || "below-md:w-[100%] below-lg:w-[260px] tablet:w-full"}`}
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
  type="button" // Prevent form submission
  onClick={(e) => {
    e.stopPropagation(); // Prevent dialog close
    toggleOpen();
  }}
  className={`bg-[#ffffff] text-[#4B4B4B] ${
    shadowclassName ? shadowclassName : "shadow"
  } shadow px-3 below-md:h-[38px] h-[35px] w-full ${
    widthchange || "below-md:w-[100%] below-lg:w-full"
  } rounded flex items-center justify-between below-md:w-full text-[12px] border focus:outline-none`}
>
  <span>{selectedOption || "Year"}</span>
  <img
    src="/images/dropdown1.svg"
    className={`-mr-0.5 transition-transform duration-200 ${
      isOpen ? "transform rotate-180" : ""
    }`}
  />
</button>


      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 w-full mt-1 bg-[#ffffff] h-[200px] overflow-auto scrollbar-thin text-[#4B4B4B] text-[12px] border rounded ${
            shadowclassName ? shadowclassName : "shadow"
          } shadow`}
          style={{ zIndex: 50 }}
        >
          {options?.map((option, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent dialog close
                onSelect(option);
              }}
              // onClick={() => onSelect(option)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {errors && errors?.message && (
				<p className="mt-1  absolute text-[10px] top-[2.30rem] z-10 text-red-600">
					{errors?.message as string}
				</p>
			)}
    </div>
  );
};

export default Dropdown;

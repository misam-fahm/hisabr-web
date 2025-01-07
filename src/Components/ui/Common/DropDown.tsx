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
  errors, // New prop for validation errors
  borderClassName = "border-gray-400",
  ...rest // Spread other props like register
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
  errors?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | undefined;
  borderClassName?: string;
  [key: string]: any; // Allow additional props like register
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false); // State to track focus

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
         onClick={(e) => {
          e.stopPropagation(); // Prevent dialog close
          toggleOpen();
          setIsFocused(true); // Set focus state
        }}
        // onClick={toggleOpen}
        onBlur={() => setIsFocused(false)} // Remove focus state on blur
        className={`bg-[#ffffff] text-[#4B4B4B] ${
          shadowclassName ? shadowclassName : "shadow"
        } shadow px-3  below-md:h-[38px] h-[35px] w-full ${widthchange || "below-md:w-[100%] below-lg:w-full"} rounded flex items-center justify-between below-md:w-full text-[12px] border
        ${
          errors ?
            "border-red-500" 
            : isFocused
            ? "border-blue-500" // Blue border on focus
            : borderClassName
        } focus:outline-none`} // Add error styling
        {...rest} // Apply validation props
      >
        <span>{selectedOption || "Year"}</span>
        <img
          src="./images/dropdown1.svg"
          className={`-mr-0.5 transition-transform duration-200 ${
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
				<p className="mt-0 absolute text-[10px]  z-10 text-red-600">
					{errors?.message as string}
				</p>
			)}
    </div>
  );
};

export default Dropdown;

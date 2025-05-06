'use client';
import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";
import { format } from "date-fns";

const CustomDatePicker = ({
  value,
  onChange,
  errors,
  placeholder = "Date",
}: {
  value?: Date;
  errors?: any;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center below-md:h-[38px] h-[35px] justify-between p-3 border border-gray-300 rounded bg-white cursor-pointer"
      >
        <span className="text-[#636363] text-[12px]">
          {selectedDate ? format(selectedDate, "MM-dd-yyyy") : placeholder}
        </span>
        <img src="/images/calendericon.svg" alt="Calendar Icon" className="-mr-1 w-3 h-3" />
      </div>

      {isOpen && (
        <div className="absolute top-[90%] left-1/2 z-50 bg-white shadow-lg p-4 rounded-lg w-full transform -translate-x-1/2 -translate-y-1/2">
          <DatePicker
            selected={selectedDate || undefined}
            onChange={handleDateChange}
            inline
            maxDate={new Date()}
            locale={enGB}
            formatWeekDay={(day) => day.slice(0, 3)}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => {
              const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
              
              const currentYear = new Date().getFullYear();
              const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
              
              return (
                <div className="flex justify-between items-center">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="cursor-pointer bg-transparent border-none outline-none"
                  >
                    <img src="/images/LeftIcon.svg" alt="Previous" />
                  </button>
                  <div className="flex w-full justify-center gap-6">
                  <select
    value={months[date.getMonth()]}
    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
    className="react-datepicker__current-month  cursor-pointer bg-transparent border-none outline-none text-[#d3d3d3] appearance-none px-1 mr-0"
  >
    {months.map((month, index) => (
      <option
        key={index}
        value={month}
        style={{
          backgroundColor: "#d3d3d3", // Option background
          color: "#334155", // Text color
          outline: "none", // Remove outline
          borderRadius: "4px",
        }}
      >
        {month}
      </option>
    ))}
  </select>
  <select
    value={date.getFullYear()}
    onChange={({ target: { value } }) => changeYear(Number(value))}
    className="react-datepicker__current-month cursor-pointer bg-transparent border-none outline-none text-[#d3d3d3] appearance-none px-1 mr-0"
  >
    {years.map((year) => (
  <option
  key={year}
  value={year}
  className="bg-gray-300 text-gray-800 border-none outline-none rounded px-2 py-1"
>
  {year}
</option>
    ))}
  </select>
                  </div>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="cursor-pointer bg-transparent border-none outline-none"
                  >
                    <img src="/images/RightIcon.svg" alt="Next" />
                  </button>
                </div>
              );
            }}
          />
        </div>
      )}
      {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
    </div>
  );
};

export default CustomDatePicker;

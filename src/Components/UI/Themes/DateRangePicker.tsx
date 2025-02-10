"use client";

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "./datepicker.css"
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";

const DateRangePicker = ({ 
    widthchang, 
    startDate, 
    endDate,
    setStartDate,
    setEndDate,
    fetchData,
    fetchDataForTender,
    fetchDataForItems
  } : { 
    widthchang?: string, 
    startDate: any, 
    endDate: any,
    setStartDate: any,
    setEndDate: any,
    fetchData?: any
    fetchDataForTender?:any
    fetchDataForItems?:any
  }) => {
  // const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  // const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | undefined>(
    undefined
  );
  const pickerRef = useRef<HTMLDivElement>(null);
  const handleClickIcon = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setLastSelectedDate(start ?? undefined);
    setStartDate(start ?? undefined);
    setEndDate(end ?? undefined);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div
        onClick={handleClickIcon}
        className={`flex items-center justify-between rounded below-md:h-[38px] h-[35px] border border-gray-300 bg-white cursor-pointer ${
          widthchang ? "" : "below-md:w-full w-full"
        }`}
      >
        <span className="text-[#636363] text-[12px] px-3">
          {startDate && endDate
            ? `From: ${startDate.toLocaleDateString()} - To: ${endDate.toLocaleDateString()}`
            : startDate
              ? `Selected: ${startDate.toLocaleDateString()}`
              : "Date Range"}
        </span>
        <img className="pr-2" src="/images/calendericon.svg" alt="calendar" />
      </div>

      {isOpen && (
        <div className="absolute top-[40px] z-40 below-md:top-[43px] left-0 bg-white shadow-lg px-4 pb-4 rounded ">
          <DatePicker
  selected={startDate}
  onChange={handleDateChange}
  startDate={startDate}
  endDate={endDate}
  selectsRange
  inline
  maxDate={new Date()}
  locale={enGB}
  formatWeekDay={(day) => day.slice(0, 3)}
  dayClassName={(date) => {
    if (lastSelectedDate && date.getTime() === lastSelectedDate.getTime()) {
      return "last-selected-day";
    }
    return "";
  }}
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

    // Get the current year and generate a list of years including the current year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="cursor-pointer bg-transparent border-none outline-none"
        >
          <img src="/images/LeftIcon.svg" alt="Previous" />
        </button>
        <div className="flex">
  {/* Month Selector */}
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

  {/* Year Selector */}
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

        {/* Next Button */}
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

          <div className="flex flex-row justify-between items-center border-[#DBDBDB] border-t-[1px]">
            {startDate && endDate ? (
              <>
                {/* "From" Box */}
                <div className="relative mt-4 border-[#282828] border-[1px] text-[#282828] px-3 h-9 w-[30%] text-[11px] rounded-xl flex items-center justify-center">
                  <span className="absolute -top-[10px] left-[30%] transform -translate-x-1/2 bg-white px-1 text-[10px] text-[#282828]">
                    From
                  </span>
                  <p className="text-[10px]">
                    {startDate.toLocaleDateString()}
                  </p>
                </div>

                {/* "To" Box */}
                <div className="relative mt-4 border-[#282828] border-[1px] text-[#282828] px-3 h-9 w-[30%] text-[11px] rounded-xl flex items-center justify-center">
                  <span className="absolute -top-[10px] left-[30%] transform -translate-x-1/2 bg-white px-1 text-[10px] text-[#282828]">
                    To
                  </span>
                  <p className="text-[10px]">{endDate.toLocaleDateString()}</p>
                </div>
              </>
            ) : (
              // "Selected Date" Box
              <div className="relative mt-4 border-[#282828] border-[1px] text-[#282828] px-3 h-9 w-[60%] text-[10px] rounded-xl flex items-center justify-center">
                <span className="absolute -top-[10px] left-[15%] transform -translate-x-1/2 bg-white px-1 text-[10px] text-[#282828]">
                  Date
                </span>
                <p className="text-[12px]">
                  {startDate?.toLocaleDateString() || ""}
                </p>
              </div>
            )}

            <div>
                <button
                  className="bg-[#334155] mt-4 text-white px-4 py-2 w-[100%] text-[12px] font-normal rounded-xl"
                  onClick={async () => {
                    setIsOpen(false);
                    await fetchData();  
                    if (typeof fetchDataForTender === "function") {
                      await fetchDataForTender();
                    } else {
                     ""
                    }

                    if (typeof fetchDataForItems === "function") {
                      await fetchDataForItems();
                    } else {
                     ""
                    }
                    
                  }}
                >
                  Set Date
                </button>
            </div>
          </div>
        </div>
       
      )}
    </div>
  );
};

export default DateRangePicker;

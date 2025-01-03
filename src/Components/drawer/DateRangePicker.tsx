"use client";

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";

const DateRangePicker = ({ widthchang }: { widthchang?: string }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | undefined>(
    undefined
  ); // Use undefined instead of null
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
        className={`flex items-center justify-between rounded h-[35px] bg-white cursor-pointer shadow ${
          widthchang ? "" : "below-md:w-full w-full"
        }`}
      >
        <span className="text-[#636363] text-[12px] px-3">
          {startDate && endDate
            ? `From: ${startDate.toLocaleDateString()} - To: ${endDate.toLocaleDateString()}`
            : startDate
              ? `Selected: ${startDate.toLocaleDateString()}`
              : "Select Date Range"}
        </span>
        <img className="pr-2" src="/images/CalenderIcon.svg" alt="calendar" />
      </div>

      {isOpen && (
        <div className="absolute top-[50px] left-0 z-50 bg-white shadow-lg p-4 rounded">
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
              if (
                lastSelectedDate &&
                date.getTime() === lastSelectedDate.getTime()
              ) {
                return "last-selected-day";
              }
              return "";
            }}
          />
          <div className="flex flex-row justify-between items-center border-[#DBDBDB] border-t-[1px] ">
            <div className="relative mt-4 border-[#282828] border-[1px] text-[#282828] px-3 py-[17px] w-[30%] text-[10px] rounded-xl flex items-center justify-center">
              <span className="absolute -top-[10px] left-[30%] transform -translate-x-1/2 bg-white px-1 text-[10px] text-[#282828]">
                From
              </span>
              <p className="text-sm">
                {startDate ? startDate.toLocaleDateString() : ""}
              </p>
            </div>

            <div className="relative mt-4 border-[#282828] border-[1px] text-[#282828] px-3 py-[17px] w-[30%] text-[10px] rounded-xl flex items-center justify-center">
              <span className="absolute -top-[10px] left-[30%] transform -translate-x-1/2 bg-white px-1 text-[10px] text-[#282828]">
                To
              </span>
              <p className="text-sm">
                {endDate ? endDate.toLocaleDateString() : ""}
              </p>
            </div>

            <div>
              <button
                className="bg-[#334155] mt-4 text-white px-4 py-2 w-[100%] text-[14px] font-medium rounded-xl"
                onClick={() => setIsOpen(false)}
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

"use client";

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ widthchang }: { widthchang?: string }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<number>(
    new Date().getMonth()
  );
  const pickerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<DatePicker | null>(null);

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

  const handleMonthChange = (date: Date) => {
    setVisibleMonth(date.getMonth());
  };

  const filterDates = (date: Date): boolean => {
    return date.getMonth() === visibleMonth;
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div
        onClick={handleClickIcon}
        className={`flex items-center justify-between  rounded h-[35px] bg-white cursor-pointer shadow 
          ${widthchang ? " " : "below-md:w-full w-full"}`}
      >
        <span className="text-[#636363] text-[12px] px-3">
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : "Select Date Range"}
        </span>
        <img
          className="pr-2"
          src="/images/CalenderIcon.svg"
          alt="calendar"
          onClick={() => {
            if (calendarRef.current) {
              (calendarRef.current as any).setOpen(true); // Open the calendar on icon click
            }
          }}
        />
      </div>

      {/* Datepicker */}
      {isOpen && (
        <div className="absolute top-[50px] left-0 z-50">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates as [Date | undefined, Date | undefined];
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            maxDate={new Date()}
            onMonthChange={handleMonthChange}
            filterDate={filterDates}
            ref={calendarRef} // Add reference for the DatePicker
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
"use client";

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
        className="flex items-center justify-between rounded h-[35px] w-[260px] below-md:w-full px-3 bg-white cursor-pointer shadow"
      >
        <span className="text-[#636363] text-[12px]">
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : "Select Date Range"}
        </span>
        <img
          src="/images/daterange.svg"
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
              const [start, end] = dates as [Date | null, Date | null];
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

"use client";

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale"; // Importing locale

const DateRangePicker = ({ widthchang }: { widthchang?: string }) => {
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

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // Custom className for selected dates
  const dayClassName = (date: Date) => {
    if (startDate && endDate) {
      // Highlight the range of dates
      if (date >= startDate && date <= endDate) {
        return "custom-selected-date";
      }
    }
    return "";
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
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            maxDate={new Date()}
            onMonthChange={handleMonthChange}
            filterDate={filterDates}
            ref={calendarRef} // Add reference for the DatePicker
            locale={enGB} // Setting the locale to English (Great Britain)
            formatWeekDay={(day) => day.slice(0, 3)} // Display only the first 3 letters of weekdays (e.g., Sun, Mon, Tue)
            dayClassName={dayClassName} // Apply custom class for selected dates
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

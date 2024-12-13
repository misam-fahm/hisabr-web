"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Toggle calendar visibility

  const handleClickIcon = () => setIsOpen((prev) => !prev); // Toggle calendar

  return (
    <div className="relative">
      {/* Clickable Area */}
      <div
        onClick={handleClickIcon}
        className="flex items-center justify-between rounded-md px-3 py-[9px] bg-white cursor-pointer shadow-md"
      >
        <span className="text-[#636363] text-[12px]">
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : "Select Date Range"}
        </span>
        <img src="/images/daterange.svg" alt="calendar" />
      </div>

      {/* Datepicker */}
      {isOpen && (
        <div className="absolute top-[50px] left-0 z-50 shadow-md">
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
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

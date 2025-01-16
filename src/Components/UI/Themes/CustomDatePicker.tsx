'use client';
import React, { useState ,useRef,useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";


const CustomDatePicker = ({
    value,
    onChange,
    errors,
    placeholder = "Date",
    buttonText = "Set Date",
}: {
    value?: Date;
    errors?:any;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    buttonText?: string;
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        onChange?.(date);
        setIsOpen(false); // Automatically close the dropdown
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false); // Close the dropdown if clicked outside
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Input Field */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center h-[35px] justify-between p-3 border rounded-md bg-white cursor-pointer shadow"
            >
                <span className="text-[#4B4B4B] text-[12px]">
                    {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : placeholder}
                </span>
                <img
                    src="/images/calendericon.svg"
                    alt="Calendar Icon"
                    className=" w-3 h-3"
                />
            </div>

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="absolute top-[90%] left-1/2 z-50 bg-white shadow-lg p-4 rounded-lg w-full transform -translate-x-1/2 -translate-y-1/2">
                    <DatePicker
                        selected={selectedDate || undefined} // Convert null to undefined
                        onChange={handleDateChange}
                        inline
                        maxDate={new Date()} // Disable future dates
                        locale={enGB}
                        formatWeekDay={(day) => day.slice(0, 3)}
                        calendarClassName=""
                    />
                  
                </div>
            )}
           {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
			
        </div>
    );
};

export default CustomDatePicker;

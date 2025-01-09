// import React, { useState } from 'react'
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const CalenderRangePicker = ({
//   value,
//   onChange,
//   placeholder = "Select Date Range",
//   buttonText = "Set Date",
// }: {
//   value?: { startDate?: Date; endDate?: Date };
//   onChange?: (dates: { startDate?: Date; endDate?: Date }) => void;
//   placeholder?: string;
//   buttonText?: string;
// }) => {
//     const [startDate, setStartDate] = useState<Date | null>(
//         value?.startDate || null
//       );
//       const [endDate, setEndDate] = useState<Date | null>(value?.endDate || null);
//       const [isOpen, setIsOpen] = useState(false);
     
//       const handleDateChange = (dates: [Date | null, Date | null]) => {
//         const [start, end] = dates;
//         setStartDate(start);
//         setEndDate(end);
//         onChange?.({ startDate: start || undefined, endDate: end || undefined });
//       };
    

//   return (
//     <div className="relative w-[348px]">
//       {/* Input Field */}
//       <div
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer shadow-md"
//       >
//         <span className="text-gray-500 text-sm">
//           {startDate && endDate
//             ? `From: ${startDate.toLocaleDateString()} - To: ${endDate.toLocaleDateString()}`
//             : placeholder}
//         </span>
//         <img
//           src="/images/calendericon.svg"
//           alt="Calendar Icon"
//           className="w-4 h-4"
//         />
//       </div>

//       {/* Calendar Dropdown */}
//       {isOpen && (
//         <div className="absolute top-[50px] left-0 z-50 bg-white shadow-lg p-4 rounded-lg w-full">
//           <DatePicker
//             selected={startDate}
//             onChange={handleDateChange}
//             startDate={startDate}
//             endDate={endDate}
//             selectsRange
//             inline
//             maxDate={new Date()}
//             calendarClassName="w-full"
//           />
//           <div className="flex items-center mt-4">
//             <label className="text-gray-500 text-sm mr-4">Date</label>
//             <input
//               type="text"
//               value={startDate?.toLocaleDateString() || ""}
//               className="border rounded-md p-2 text-gray-700 text-sm"
//               readOnly
//             />
//           </div>
//           <button
//             className="bg-blue-600 text-white px-4 py-2 mt-4 w-full rounded-md hover:bg-blue-700"
//             onClick={() => setIsOpen(false)}
//           >
//             {buttonText}
//           </button>
//         </div>
//       )}
//     </div>
   
//   )
// }

// export default CalenderRangePicker

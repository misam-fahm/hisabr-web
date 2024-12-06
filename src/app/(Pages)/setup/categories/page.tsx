"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AddCategories from "@/Components/Setup/AddCategories";
import AddNewItems from "@/Components/Setup/AddNewItems";

const page = () => {
  const data = [
    {
      name: "Beverage",
      type: "VISA",
      percent: "2 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Bakery",
      type: "Amex",
      percent: "1.5 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "American Express",
      type: "Discovery  ",
      percent: "3 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Dairy",
      type: "Master",
      percent: "3.5 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Snacks",
      type: "Amex",
      percent: "10 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Soft Serve",
      type: "Discovery",
      percent: "12 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Beverage",
      type: "VISA",
      percent: "2.5 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Bakery",
      type: "Amex",
      percent: "6.2 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
  ];
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]); // From and To Date
  const [startDate, endDate] = dateRange;
  const [isOpen, setIsOpen] = useState(false); //control pop up vivibility
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <main className="px-6 mt-20">
      <>
        <div className="flex flex-col mb-5">
          <div className="flex justify-between">
            <p className="font-bold text-[16px]">Item Categories</p>
            <div className="flex space-x-4">
            
                <AddNewItems/>
            
                <AddCategories />
             
            </div>
          </div>
        </div>
        {/* Categories Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-full ">
            <table className="w-full border-collapse text-[12px] text-white">
              <thead className="bg-[#334155]">
                <tr>
                  <th className="py-3 px-4 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[25%]">
                    {" "}
                    Name
                  </th>
                  <th className="py-3 px-3 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[25%]">
                    Description
                  </th>
                  <th className="py-3 px-3 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[25%]">
                    No. of Items
                  </th>
                  <th className="py-3 px-4 text-[15px] text-center text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
                    Edit
                  </th>
                  <th className="py-3 px-4 text-[15px] text-center text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
                    Delete
                  </th>
                </tr>
              </thead>
            </table>

            <div
              className="h-[340px] overflow-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              <table className="min-w-full">
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#F3F3F6]"}
                    >
                      <td className="py-3 px-4 text-sm text-left text-[#636363] w-[25%]">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-left text-[#636363] w-[25%]">
                        {item.type}
                      </td>
                      <td className="py-3 px-4 text-left text-sm text-[#636363] w-[25%]">
                        {item.percent}
                      </td>
                      <td className="py-1 px-4 text-sm text-center text-[#636363] w-[10%]">
                        <img
                          src={item.imgSrc}
                          alt="Edit"
                          className=" inline-block ml-4"
                        />
                      </td>
                      <td className="py-1 px-4 text-sm text-center text-[#636363] w-[10%]">
                        <img
                          src={item.imgsrc}
                          alt="Delete"
                          className="  inline-block ml-5"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </>
    </main>
  );
};

export default page;
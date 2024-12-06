"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AddCategories from "@/Components/Setup/AddCategories";
import AddNewItems from "@/Components/Setup/AddNewItems";

const page = () => {
  const data = [
    {
      name: "Milk Packet",
      category: "Dairy",
      price: "2 %",
      quantity: 100,
      weight: "1 litre",

      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Bread Loaf",
      category: " Bakery",
      price: "1.5 %",
      quantity: 100,
      weight: "300 gm",

      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Butter Stick",
      category: "Dairy  ",
      price: "3 %",
      quantity: 100,
      weight: "100 gm",

      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Chocolate ",
      category: " Bakery",
      price: "3.5 %",
      quantity: 100,
      weight: "200 gm",

      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Cheese Block",
      category: "Dairy",
      price: "10 %",
      quantity: 100,
      weight: "1 litre",

      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Chocolate",
      category: " Bakery",
      price: "12 %",
      quantity: 100,
      weight: "300 gm",

      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Cheese Block",
      category: "Dairy",
      price: "2.5 %",
      quantity: 100,
      weight: "1 litre",

      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "Milk Packet",
      category: " Bakery",
      price: "6.2 %",
      quantity: 100,
      weight: "300 gm",
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
            <p className="font-bold text-[16px]">Items</p>
            <div className="fle space-x-4">
              <button className="font-semibold text-[14px] bg-[#1AA47D] hover:bg-[#168A68] px-5 h-[37px] text-[#FFFFFF] rounded-md">
                {/* Add New Item */}
                <AddNewItems />
              </button>

              <button className="font-semibold text-[14px] bg-[#1AA47D] px-6 hover:bg-[#168A68]  h-[37px] text-[#FFFFFF] rounded-md">
                <AddCategories />
              </button>
            </div>
          </div>
        </div>
        {/* Items Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-full">
            <table className="w-full border-collapse text-[12px] text-white">
              <thead className="bg-[#334155]">
                <tr>
                  <th className="py-3 px-4 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[20%]">
                    {" "}
                    Name
                  </th>
                  <th className="py-3 px-3 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
                    Category
                  </th>
                  <th className="py-3 px-3 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
                    Price
                  </th>
                  <th className="py-3 px-2 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
                    Quantity
                  </th>
                  <th className="py-3 px-2 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
                    Weight
                  </th>
                  <th className="py-3 px-2 text-left text-[15px] text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
                    Edit
                  </th>
                  <th className="py-3 px-2 text-left text-[15px] text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
                    Delete
                  </th>
                </tr>
              </thead>
            </table>

            <div
              className="h-[340px] overflow-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              <table className="min-w-full ">
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-3 px-4 text-sm text-left text-[#636363] w-[20%]">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-left text-[#636363] w-[15%]">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-left text-sm text-[#636363] w-[15%]">
                        {item.price}
                      </td>
                      <td className="py-3 px-4 text-left text-sm text-[#636363] w-[15%]">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-left text-sm text-[#636363] w-[15%]">
                        {item.weight}
                      </td>
                      <td className="py-1 px-4 text-sm text-center text-[#636363] w-[10%]">
                        <img
                          src={item.imgSrc}
                          alt="Edit"
                        />
                      </td>
                      <td className="py-1 px-4 text-sm text-center text-[#636363] w-[10%]">
                        <img
                          src={item.imgsrc}
                          alt="Delete"
                          
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
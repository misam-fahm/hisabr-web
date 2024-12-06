import AddTender from "@/Components/Setup/AddTender";
import Link from "next/link";
import React from "react";

const Page = () => {
  const data = [
    {
      name: "American Express",
      type: "VISA",
      percent: "2 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "American Express",
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
      name: "American Express",
      type: "Master",
      percent: "3.5 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "American Express",
      type: "Amex",
      percent: "10 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "American Express",
      type: "Discovery",
      percent: "12 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "American Express",
      type: "VISA",
      percent: "2.5 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
    {
      name: "American Express",
      type: "Amex",
      percent: "6.2 %",
      imgSrc: "/images/edit.svg",
      imgsrc: "/images/delete.svg",
    },
  ];

  return (
    <main className="mt-24 ml-6 mr-6">
      <div className="w-full">
        <div className="flex justify-between">
          <p className="font-bold text-[16px]">Tender</p>
         
            <button className="font-semibold text-[14px] bg-[#1AA47D] hover:bg-[#168A68] px-5 h-[37px] text-[#FFFFFF] rounded-md">
        <AddTender/>
            </button>
          
        </div>

        <div className="relative mt-4 shadow-md rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-300 shadow-md rounded-md">
            <thead className="bg-[#334155] sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[30%]">
                  Name
                </th>
                <th className="py-3 px-4 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[25%]">
                  Type
                </th>
                <th className="py-3 px-4 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[25%]">
                  Percent
                </th>
                <th className="py-3 px-4  text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
                  Edit
                </th>
                <th className="py-3 px-4 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
                  Delete
                </th>
              </tr>
            </thead>
          </table>
          <div
            className="overflow-auto h-[300px]"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="min-w-full">
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#F3F3F6]"}
                  >
                    <td className="py-3 px-4 text-sm text-left text-[#636363] w-[30%]">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-left text-[#636363] w-[25%]">
                      {item.type}
                    </td>
                    <td className="py-3 px-4 text-left text-sm text-[#636363] w-[25%]">
                      {item.percent}
                    </td>
                    <td className="py-1 px-4 text-sm text-left text-[#636363] w-[10%]">
                      <img
                        src={item.imgSrc}
                        alt="Edit"
                        
                      />
                    </td>
                    <td className="py-1 px-4 text-sm text-left text-[#636363] w-[10%]">
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
    </main>
  );
};

export default Page;
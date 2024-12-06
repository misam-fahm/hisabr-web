import AddStore from "@/Components/Setup/AddStore";
import Link from "next/link";
import React from "react";

const Page = () => {
  const data = [
    {
      store : "13246",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
      
    },
    {
      store : "Store 1",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
    },
    {
      store : "Store 2",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
    },
    {
      store : "Store 3",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
    },
    {
      store : "Store 1",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
    },
    {
      store : "Store 2",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
    },
    {
      store : "Store 3",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
    },
    {
      store : "13246",
      timestamp: "13246",
      location: "VatisinVille",
      description:"MORTGAGE",
      royalty:"MORTGAGE",
      imgSrc: "/images/greenEdit.svg",
    },
  ];

  return (
    <main className="mt-24 ml-6 mr-6">
      <div className="w-full">
        <div className="flex justify-between">
          <p className="font-bold text-[16px]">Stores</p>
        
            <button className="font-semibold text-[14px] bg-[#1AA47D] hover:bg-[#168A68] px-5 h-[37px] text-[#FFFFFF] rounded-md">
              <AddStore/>
            </button>
         
        </div>

        <div className="relative mt-4 shadow-md rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-300 shadow-md rounded-md">
            <thead className="bg-[#334155] sticky top-0 z-10">
              <tr>
                <th className="py-3 text-[15px] px-4 text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[11%]">
                Store 

                </th>
                <th className="py-3 px-4 text-[15px] text-center text-xs font-medium text-[#FFFFFF] tracking-wider w-[20%]">
                Timestamp

                </th>
                <th className="py-3 px-4 text-[15px] text-start text-xs font-medium text-[#FFFFFF] tracking-wider w-[20%]">
                Location
                </th>
                <th className="py-3 px-4 text-[15px] text-start text-xs font-medium text-[#FFFFFF] tracking-wider w-[19%]">
                Description
                </th>
                <th className="py-3 px-4 text-[15px] text-start text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
                Royalty
                </th>
                <th className="py-3 px-4 text-[15px] text-center text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
                  Edit
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
                    <td className="py-3 px-4 text-sm text-left text-[#636363] w-[11%]">
                      {item.store}
                    </td>
                    <td className="py-3 px-4 text-sm text-center  text-[#636363] w-[20%]">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 text-start text-sm text-[#636363] w-[20.5%]">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 text-start text-sm text-[#636363] w-[19%]">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-start text-sm text-[#636363] w-[15%]">
                      {item.royalty}
                    </td>
                    <td className="py-1 px-4 text-sm text-center text-[#636363] w-[15%]">
                      <img
                        src={item.imgSrc}
                        alt="Edit"
                        className="inline-block ml-4"
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
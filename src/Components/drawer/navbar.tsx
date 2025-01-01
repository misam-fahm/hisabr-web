"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import Images from "../ui/Common/Image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentPath = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setIsClient(true); // Ensuring we are on the client side
  }, []);

  useEffect(() => {
    if (isClient) {
      const currentRoute = currentPath.replace("/", "");

      let newTitle = "";
      switch (currentRoute?.toLowerCase()) {
        case "myprofile":
          newTitle = "My Profile";
          break;
        case "editprofile":
          newTitle = "Edit Profile";
          break;
        case "sales-kpi":
          newTitle = "Sales Kpi";
          break;
        case "summary":
          newTitle = "Summary";
          break;
        case "sales":
          newTitle = "Sales";
          break;
        case "sales/sales_view":
          newTitle = "Sales Details";
          break;
        case "invoices":
          newTitle = "Invoices";
          break;
        case "invoicedetails":
          newTitle = "Invoices/Invoice Details";
          break;
        case "expenses":
          newTitle = "Expenses";
          break;
        case "setup/categories":
          newTitle = "Item Categories";
          break;
        case "setup/items":
          newTitle = "Items";
          break;
        case "setup/tenders":
          newTitle = "Tenders";
          break;
        case "setup/stores":
          newTitle = "Stores";
          break;
        case "setup/configuration":
          newTitle = "Configuration";
          break;
        case "details1":
          newTitle = "Gross Revenue Analysis";
          break;
        case "details2":
          newTitle = " Tender Analysis";
          break;
        case "details4":
          newTitle = "Customer Count Analysis";
          break;
        case "details5":
          newTitle = "Operating Expense Analysis";
          break;
        case "details6":
          newTitle = " Cost Analysis";
          break;
        case "details7":
          newTitle = "Labor Analysis";
          break;
        case "details8":
          newTitle = "Items Analysis";
          break;

        case "logout":
          newTitle = "Logout";
          break;
        default:
          newTitle = "Home";
      }

      setTitle(newTitle);
      document.title = newTitle;
    }
  }, [isClient, currentPath]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="w-full sticky z-30 bg-[#ffff] h-[50px] flex justify-center items-center shadow ">
      <div className="flex justify-between below-md:justify-center  items-center  w-full">
        <div className=" flex justify-center items-center pl-8 below-md:pl-0 ">
          {" "}
          <text className="text-[18px] font-bold text-defaultblack ">
            {title}
          </text>
        </div>
        <div className="flex justify-end  items-center  below-md:absolute  below-md:right-0 ">
          <Images
            className="w-10 h-10 mr-4 rounded-full"
            src="/images/admin.png"
            alt="Admin"
          />
          <div className="flex flex-col below-md:hidden">
            <p className="text-[14px] font-semibold text-right">Saheel</p>
            <p className="text-[12px] font-medium">Admin</p>
          </div>

          <div
            className="ml-8 mr-4 cursor-pointer below-md:hidden"
            ref={dropdownRef}
          >
            <p
              onClick={handleToggle}
              className="w-10 h-10 flex items-center justify-center"
            >
              <img src="/images/ProfileDropdown.svg" alt="Menu Icon" />
            </p>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-3 mr-2 pl-4 w-52 bg-white shadow-lg rounded-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]">
                    <img
                      src="/images/Profile.svg"
                      className="inline-block mr-2"
                    />
                    My Profile
                  </li>
                  <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]">
                    <img
                      src="/images/logout2.svg"
                      className="inline-block mr-2"
                    />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Navbar;

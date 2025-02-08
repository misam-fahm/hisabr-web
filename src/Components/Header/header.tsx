"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import Images from "../UI/Themes/Image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentPath = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const {invoiceid}:any = useParams(); 
  const { salesid }: any = useParams();   
  const safeDecodeBase64 = (str: string | undefined): string => {
  if (!str) return ""; 
    try {
      return atob(str.replace(/\-/g, "+").replace(/_/g, "/"));
    } catch (error) {
      console.error("Invalid Base64 string:", str);
      return ""; 
    }
  };
  const decodedSaleId=safeDecodeBase64(salesid);
  const decodedId = safeDecodeBase64(invoiceid);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  useEffect(() => {
    if (isClient) {
      let currentRoute = currentPath.replace(/^\/|\/$/g, "");
      let normalizedDecodedSaleId  = decodedSaleId?.trim(); 
      let normalizedDecodedId = decodedId?.trim(); 
      let newTitle = "";
  
      if (currentRoute.startsWith("invoices/") && normalizedDecodedId) {
        newTitle = "Invoices/Invoice Details";
      }else if (currentRoute.startsWith("sales/") && normalizedDecodedSaleId){
        newTitle= "Sales/ Sales Details";
      }
       else {
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
          case "invoices":
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("fromItemsAnalysis") === "true") {
              newTitle = "Items";
            } else if (params.get("fromHome") === "true") {
              newTitle = "Cost";
            } else {
              newTitle = "Invoices";
            }
          }
          break;
          case "expenses":
            if (typeof window !== "undefined") { 
              const params = new URLSearchParams(window.location.search);
              if (params.get("fromLabourAnalysis") === "true") {
                newTitle = "Labour"; 
              } else if (params.get("fromHome") === "true") {
                newTitle = "Operating Expense";
              } else {
                newTitle = "Expenses"; 
              }
            }
            break;  
          case "setup/categories":
            newTitle = "Categories";
            break;
          case "setup/items":
            newTitle = "Items";
            break;
          case "setup/tenders":
            newTitle ="Tenders";
            break;
          case "setup/stores":
            newTitle = "Stores";
            break;
          case "setup/configuration":
            newTitle = "Configuration";
            break;
          case "grossrevenue":
            newTitle = "Gross Revenue";
            break;
          case "customercount":
            newTitle = "Customer Count";
            break;
          case "logout":
            newTitle = "Logout";
            break;
          default:
            newTitle = "Home";
        }
      }
      setTitle(newTitle);
      document.title = newTitle;
    }
  }, [isClient, currentPath, decodedId]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setIsRotated((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setIsRotated(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    router.replace('/login'); // Redirect to login page
  };

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
            className="ml-8 mr-4 cursor-pointer below-md:hidden relative"
            ref={dropdownRef}
          >
            <p
              onClick={handleToggle}
              className="w-10 h-10 flex items-center justify-center "
            >
              <img
                src="/images/profiledropdownside.svg"
                alt="Menu Icon"
                className={`transition-transform duration-300 ${
                  isRotated ? "rotate-180" : "rotate-0"
                }`}
              />
            </p>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-3 mr-2 pl-4 w-52 bg-white shadow-lg rounded-lg">
                <ul className="py-2 ">
                  <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]"
                  onClick={()=> router.push("/myprofile")}
                  >
                    <img
                      src="/images/Profile.svg"
                      className="inline-block mr-2"
                    />
                    My Profile
                  </li>
                  <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]"
                    onClick={() =>
                      handleLogout()
                  }>
                    <img
                      src="/images/navbarlogouticon.svg"
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

export default Header;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface DrawerProps {
  children: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [setupOpen, setSetupOpen] = useState(false); // State to toggle the dropdown
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null); // Track active submenu item
  
  const router = useRouter();

  const Menus = [
    { title: "Home", src: "home1", path: "/" },
    { title: "Sales-KPI", src: "saleskpi", path: "/sales-kpi" },
    // { title: "KPI", src: "kpi", path: "/kpi" },
    { title: "Summary", src: "summary", path: "/summary" },
    { title: "Sales", src: "sales", path: "/sales" },
    { title: "Invoices", src: "invoices", path: "/invoices" },
    { title: "Expenses", src: "expences", path: "/expenses" },
    {
      title: "Setup",
      src: "setup",
      submenus: [
        { title: "Item Categories", path: "/setup/categories" },
        { title: "Items", path: "/setup/items" },
        { title: "Tenders", path: "/setup/tenders" },
        { title: "Stores", path: "/setup/stores" },
        { title: "Configuration", path: "/setup/configuration" },
      ],
    },
    // { title: "Logout", src: "logout", path: "/logout", gap: true },
  ];

  const handleNavigation = (path: string, submenuTitle?: string) => {
    setActiveSubmenu(submenuTitle || null); // Set active submenu for styling
    router.push(path);
  };

  const sidebarClass = open ? "w-[230px]" : "w-[70px]";

  return (
    <main className="flex h-[100vh]">
      <div
        className={`${sidebarClass} duration-300   bg-defaultblack text-defaultwhite sticky top-0 left-0 z-20`}
        
      >
        <img
          src="/images/Arrow.svg"
          className={`absolute cursor-pointer rounded-full -right-[0.7rem] top-5 opacity-[0.73] ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />

       

        <div
          className={`flex gap-x-4 mt-[13px]  ${open ? "pl-6" : "pl-3"} ${open ? "ml-[13px]" : "ml-[3px]"}`}
        >
          <img
            src={open ? "/images/logo.svg" : "/images/halflogo.png"}
            className={`cursor-pointer ${open ? "w-[136px]" : "w-[36px]"} h-auto`}
          />
        </div>
        <div className="max-h-[calc(100vh-160px)] py-4 overflow-auto scrollbar-thin scrollbar-thumb-[#A9A5CA33] scrollbar-track-transparent ">

        <ul className="">
        {Menus.map((menu:any , index) => (
            <React.Fragment key={index}>
              {/* Main Menu Item */}
              <li
                onClick={() =>
                  menu.submenus
                    ? setSetupOpen(!setupOpen)
                    : handleNavigation(menu.path!)
                }
                className={`text-defaultwhite text-[14px] flex items-center gap-x-4 cursor-pointer p-3 pl-6 hover:bg-[#A9A5CA33] rounded-tr-full rounded-br-full ${
                  menu?.gap ? "mt-11" : "mt-1"
                } ${
                  index === 0 && "bg-[#A9A5CA33]"
                } ${menu.title === "Logout" && "rounded-tr-none rounded-br-none rounded-lg"}`}
              >
                <img src={`/images/${menu.src}.png`} />
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                  {menu.title}
                </span>
                {/* Dropdown Arrow for Setup */}
                {menu.submenus && open && (
                  <img
                    src={`/images/dropDown.png`}
                    className={`ml-auto ${
                      setupOpen ? "rotate-180" : ""
                    } duration-300`}
                  />
                )}
              </li>

              {/* Submenu Items bg-[#B2BAC5]  */}
              {menu.submenus && setupOpen && open && (
                <ul className="relative ml-8 mt-2  pr-9">
                  <div className="absolute  top-0 w-0.5 h-full bg-[#B2BAC5] opacity-50 "></div>
                  {menu.submenus.map((submenu:any, subIndex:any) => (
                    <li
                      key={subIndex}
                      onClick={() =>
                        handleNavigation(submenu.path, submenu.title)
                      }
                      className={`flex items-center gap-x-2 text-[14px] cursor-pointer px-4 py-2 rounded-tr-full rounded-br-full hover:bg-[#A9A5CA33] ${
                        activeSubmenu === submenu.title
                          ? "bg-[#A9A5CA33] shadow-md"
                          : ""
                      }`}
                      style={{ marginBottom: "3px" }}
                    >
                      <span >{submenu.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
       
        </div>
        <div className="flex px-6  mt-10 gap-4">
          <img src="/images/logout.png"/>
          <label> Logout</label>

        </div>
        
       
      </div>
    </main>
  );
};

export default Drawer;

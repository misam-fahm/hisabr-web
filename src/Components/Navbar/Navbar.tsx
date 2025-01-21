"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
//import Images from "../UI/Themes/Image";
import clsx from "clsx";

interface DrawerProps {
  children: ReactNode;
}

const Navbar: React.FC<DrawerProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [setupOpen, setSetupOpen] = useState(false); // State to toggle the dropdown
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null); // Track active submenu item
  const router = useRouter();
  const currentPath = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setIsClient(true);
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
        case "invoices":
          newTitle = "Invoices";
          break;
        case "invoicedetails":
          newTitle = "Invoice Details";
          break;
        case "expenses":
          newTitle = "Expenses";
          break;
        case "logout":
          newTitle = "Logout";
          break;
        default:
          newTitle = "";
      }

      setTitle(newTitle);
      document.title = newTitle;
    }
  }, [isClient, currentPath]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 800px)");

    const handleResize = () => {
      setOpen(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const Menus = [
    { title: "Home", src: "home1", path: "/" },
    { title: "Sales-KPI", src: "saleskpi", path: "/sales-kpi" },
    { title: "Summary", src: "summary", path: "/summary" },
    { title: "Sales", src: "sales", path: "/sales" },
    { title: "Invoices", src: "invoices", path: "/invoices" },
    { title: "Expenses", src: "expences", path: "/expenses" },
    { type: "Setup", title: "SETUP" },
    { title: "Categories", src: "Categories", path: "/setup/categories" },
    { title: "Items", src: "Items2", path: "/setup/items" },
    { title: "Tenders", src: "Tenders", path: "/setup/tenders" },
    { title: "Stores", src: "Stores", path: "/setup/stores" },
    {
      title: "Configuration",
      src: "Configuration",
      path: "/setup/configuration",
    },
  ];

  const handleNavigation = (path: string, submenuTitle?: string) => {
    setActiveSubmenu(submenuTitle || null);
    router.push(path);

    if (window.innerWidth < 801) {
      setOpen(false);
    }
  };

  const sidebarClass = clsx({
    "w-[230px]": open,
    "w-[85px] below-md:w-0": !open,
  });

  const pathsToHideHamburger = [
    "/sales/sales_view",
    "/grossrevenue",
    "/details2",
    "/customercount",
    "/details5",
    "/details6",
    "/details7",
    "/details8",
  ];
  const shouldHideHamburger = pathsToHideHamburger.some((path) =>
    currentPath.includes(path)
  );

  return (
    <main
      className={`flex h-[100vh] ${
        pathsToHideHamburger.some((path) => currentPath.includes(path))
          ? "tablet:hidden"
          : ""
      }`}
    >
      {/* Backdrop */}
      {open && (
        <div
          className="below-md:fixed below-md:inset-0 below-md:bg-black below-md:bg-opacity-50 below-md:z-50"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {title === "My Profile" ||
      title === "Edit Profile" ||
      title === "Invoice Details" ? (
        <img
          src="/images/mobilebackicon.svg"
          className="fixed top-4 left-4 cursor-pointer z-50"
          onClick={() => router.back()}
        />
      ) : (
        !shouldHideHamburger && (
          <img
            src="/images/hammenu.svg"
            className="fixed top-4 left-4 cursor-pointer z-40 below-lg:hidden below-md:block"
            onClick={() => setOpen(!open)}
          />
        )
      )}
      <div
        className={`${sidebarClass} duration-300 h-full bg-[#0F1044] text-defaultwhite sticky below-md:fixed top-0 left-0 z-40 below-md:z-50`}
      >
        <img
          src="/images/drawertoggle.svg"
          className={`absolute cursor-pointer rounded-full -right-[0.8rem] below-md:hidden top-3 opacity-[0.73] ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />

        <div
          className={`flex gap-x-4 mt-[13px] ${open ? "pl-3" : "pl-3"}  below-md:pl-1 ${open ? "ml-[13px]" : "ml-[3px]"}`}
        >
          <img
            src={open ? "/images/logo.svg" : "/images/halflogo.svg"}
            className={`cursor-pointer ${open ? "w-[136px] -mt-4" : "w-[36px]"} `}
          />
          {title === "My Profile" ||
          title === "Edit Profile" ||
          title === "Invoice Details" ? (
            <img
              src="/images/mobilebackicon.svg"
              className="fixed top-4 left-4 cursor-pointer z-50"
              onClick={() => router.back()}
            />
          ) : (
            !shouldHideHamburger && (
              <img
                src="/images/x.svg"
                onClick={() => setOpen(!open)}
                className="below-lg:hidden -mt-4 tablet:hidden sticky z-40 pl-5"
              />
            )
          )}
        </div>
        <div className="max-h-[calc(100vh-160px)] py-4 overflow-auto scrollbar-thin scrollbar-thumb-[#A9A5CA33] scrollbar-track-transparent">
          <ul>
            {Menus.map((menu: any, index) => (
              <div key={index}>
                {/* Main Menu Item */}
                <li
                  onClick={() =>
                    menu.submenus
                      ? setSetupOpen(!setupOpen)
                      : handleNavigation(menu.path!)
                  }
                  className={`text-[#FFFFFFCC] text-[14px] flex items-center gap-x-4 cursor-pointer p-3 pl-6 hover:bg-[#A9A5CA33] hover:shadow-[inset_2px_3px_6.9px_0px_#A9A5CA33] mr-5 rounded-tr-full rounded-br-full
            ${currentPath === menu.path ? " bg-[#A9A5CA33] shadow-[inset_2px_3px_6.9px_0px_#A9A5CA33]" : ""}
            ${open ? "mt-1" : "mt-2"} 
            ${menu.title === "Logout" ? "rounded-tr-none rounded-br-none rounded-lg" : ""}
            ${
              menu.title === "SETUP"
                ? `border border-[#B8BCC3B2] cursor-default pointer-events-none w-12 h-5 ml-5 pl-[9px] hover:bg-transparent hover:shadow-none rounded-tl-full rounded-bl-full py-1 !text-[#B8BCC3B2] text-[9px] 
              ${!open ? "ml-[7px]" : ""}`
                : ""
            }`}
                >
                  {/* Only render the image if the menu is not "Setup" */}
                  {menu.title !== "SETUP" && (
                    <img src={`/images/${menu.src}.svg`} />
                  )}

                  {/* Show the "SETUP" title even when drawer is closed */}
                  <span
                    className={`${!open && menu.title !== "SETUP" ? "hidden" : ""} origin-left duration-200`}
                  >
                    {menu.title}
                  </span>
                </li>
              </div>
            ))}
          </ul>
        </div>

        <div
          className={`flex mt-5 gap-4 below-md:ml-2 bg-[#A9A5CA33] shadow-[inset_2px_3px_6.9px_0px_#A9A5CA33] px-4 py-[10px]  ${open ? "mr-8" : "mr-7 below-md:bg-transparent below-md:shadow-none"} ml-3 rounded-md`}
        >
          <img src="/images/logout.svg" />
          {open && <p className="text-[14px] text-[#FFFFFFCC]">Logout</p>}
        </div>
      </div>
    </main>
  );
};

export default Navbar;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Images from "../ui/Common/Image";

interface DrawerProps {
  children: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ children }) => {
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
  ];

  const handleNavigation = (path: string, submenuTitle?: string) => {
    setActiveSubmenu(submenuTitle || null);
    router.push(path);

    if (window.innerWidth < 801) {
      setOpen(false);
    }
  };

  const sidebarClass = open ? "w-[230px]" : "w-[70px] below-md:w-0";

  const pathsToHideHamburger = [
    "/sales/sales_view",
    "/details1",
    "/details2",
    "/details4",
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
      {title === "My Profile" ||
      title === "Edit Profile" ||
      title === "Invoice Details" ? (
        <img
          src="/images/backIcon.svg"
          className="fixed top-4 left-4 cursor-pointer z-50"
          onClick={() => router.back()}
        />
      ) : (
        !shouldHideHamburger && (
          <img
            src="/images/hamburger.svg"
            className="fixed top-4 left-4 cursor-pointer z-40 below-lg:hidden below-md:block"
            onClick={() => setOpen(!open)}
          />
        )
      )}
      <div
        className={`${sidebarClass} duration-300 h-full bg-defaultblack text-defaultwhite sticky below-md:fixed top-0 left-0 z-40`}
      >
        <img
          src="/images/Arrow.svg"
          className={`absolute cursor-pointer rounded-full -right-[0.7rem] below-md:hidden top-5 opacity-[0.73] ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />

        <div
          className={`flex gap-x-4 mt-[13px] ${open ? "pl-3" : "pl-3"}  below-md:pl-1 ${open ? "ml-[13px]" : "ml-[3px]"}`}
        >
          <Images
            src={open ? "/images/logo.svg" : "/images/halflogo.png"}
            className={`cursor-pointer ${open ? "w-[136px]" : "w-[36px]"}  h-[45px]`}
          />
          {title === "My Profile" ||
          title === "Edit Profile" ||
          title === "Invoice Details" ? (
            <img
              src="/images/backIcon.svg"
              className="fixed top-4 left-4 cursor-pointer z-50"
              onClick={() => router.back()}
            />
          ) : (
            !shouldHideHamburger && (
              <img
                src="/images/x.svg"
                onClick={() => setOpen(!open)}
                className="below-lg:hidden tablet:hidden sticky z-40 pl-5"
              />
            )
          )}
        </div>
        <div className="max-h-[calc(100vh-160px)] py-4 overflow-auto scrollbar-thin scrollbar-thumb-[#A9A5CA33] scrollbar-track-transparent ">
          <ul className="">
            {Menus.map((menu: any, index) => (
              <React.Fragment key={index}>
                {/* Main Menu Item */}
                <li
                  onClick={() =>
                    menu.submenus
                      ? setSetupOpen(!setupOpen)
                      : handleNavigation(menu.path!)
                  }
                  className={`text-defaultwhite  text-[14px] flex items-center gap-x-4 cursor-pointer p-3 pl-6 hover:bg-[#EEEEEE1A] hover:shadow-[inset_2px_3px_6.9px_0px_#A9A5CA33]   mr-5 rounded-tr-full rounded-br-full 
                    ${currentPath === menu.path ? "bg-[#EEEEEE1A]  shadow-[inset_2px_3px_6.9px_0px_#A9A5CA33]" : ""} 
                    ${menu?.gap ? "mt-11" : "mt-1"} 
                    ${menu.title === "Logout" ? "rounded-tr-none rounded-br-none rounded-lg" : ""}`}
                >
                  <img src={`/images/${menu.src}.svg`} />
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {menu.title}
                  </span>
                  {/* Dropdown Arrow for Setup */}
                  {menu.submenus && open && (
                    <img
                      src={`/images/dropdown.svg`}
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
                    {menu.submenus.map((submenu: any, subIndex: any) => (
                      <li
                        key={subIndex}
                        onClick={() =>
                          handleNavigation(submenu.path, submenu.title)
                        }
                        className={`flex items-center gap-x-2 text-[14px] cursor-pointer px-4 py-2 rounded-tr-full rounded-br-full hover:bg-[#A9A5CA33] ${
                          activeSubmenu === submenu.title
                            ? "bg-[#A9A5CA33] shadow-[inset_2px_3px_6.9px_0px_#A9A5CA33]"
                            : "bg-transparent"
                        }`}
                        style={{ marginBottom: "3px" }}
                      >
                        <span>{submenu.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div
          className={`flex mt-10 gap-4 below-md:ml-2 bg-[#A9A5CA33] shadow-[inset_2px_3px_6.9px_0px_#A9A5CA33] px-4 py-[10px]  ${open ? "mr-8" : "mr-3 below-md:bg-transparent below-md:shadow-none"} ml-3 rounded-md`}
        >
          <img src="/images/logout.svg" />
          {open && <p className="text-[14px]">Logout</p>}
        </div>
      </div>
    </main>
  );
};

export default Drawer;

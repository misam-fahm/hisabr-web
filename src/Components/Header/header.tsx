"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { sendApiRequest } from "@/utils/apiUtils";

interface UserData {
  firstname: string;
  lastname: string;
  profileImage?: string;
  usertype?: string;
}

interface ToastState {
  message: string;
  type: string;
}

const Header: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const [title, setTitle] = useState("");
  const [customToast, setCustomToast] = useState<ToastState>({ message: "", type: "" });
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // New state for authorization

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currentPath = usePathname();
  const { invoiceid, salesid }: any = useParams();

  const safeDecodeBase64 = (str: string | undefined): string => {
    if (!str) return "";
    try {
      return atob(str.replace(/\-/g, "+").replace(/_/g, "/"));
    } catch (error) {
      console.error("Invalid Base64 string:", str);
      return "";
    }
  };

  const decodedSaleId = safeDecodeBase64(salesid);
  const decodedId = safeDecodeBase64(invoiceid);

  const fetchUserData = async () => {
    try {
      const response: any = await sendApiRequest({ mode: "getUserById" });
      if (response?.status === 200) {
        setData(response.data.user[0]);
        
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch user data.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getTitle = (route: string, userType?: string): string => {
    const normalizedRoute = route.replace(/^\/|\/$/g, "");
    const normalizedDecodedSaleId = decodedSaleId?.trim();
    const normalizedDecodedId = decodedId?.trim();

    if (normalizedRoute.startsWith("setup/")) {
      const setupRoutes: Record<string, string> = {
        "setup/items": "Items",
        "setup/stores": "Stores",
        "setup/configuration": "Configuration",
        "setup/categories": userType === "A" ? "Categories" : "Access Denied",
        "setup/dqcategories": userType === "A" ? "DQ Categories" : "Access Denied",
        "setup/tenders": userType === "A" ? "Tenders" : "Access Denied",
        "setup/userdetails": userType === "A" ? "User Management" : "Access Denied",
      };
      return setupRoutes[normalizedRoute.toLowerCase()] || "Setup";
    }

    if (normalizedRoute.startsWith("invoices/") && normalizedDecodedId) {
      return "Invoices/Invoice Details";
    }
    if (normalizedRoute.startsWith("sales/") && normalizedDecodedSaleId) {
      return "Sales/Sales Details";
    }

    const routeTitles: Record<string, string> = {
      myprofile: "My Profile",
      editprofile: "Edit Profile",
      "sales-kpi": "Dashboard",
      summary: "Summary",
      dqcategory: "DQ Export",
      sales: "Sales",
      invoices: "Invoices",
      expenses: "Expenses",
      cashreconc: "Cash Reconciliation",
      grossrevenue: "Gross Revenue",
      customercount: "Customer Count",
      logout: "Logout",
    };
    return routeTitles[normalizedRoute.toLowerCase()] || "Dashboard";
  };

  const updateTitleWithQueryParams = () => {
    let newTitle = getTitle(currentPath, data?.usertype);
    const normalizedRoute = currentPath.replace(/^\/|\/$/g, "");

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (normalizedRoute === "invoices") {
        if (searchParams.get("fromItemsAnalysis") === "true") newTitle = "Items";
        else if (searchParams.get("fromHome") === "true") newTitle = "Cost";
      } else if (normalizedRoute === "expenses") {
        if (searchParams.get("fromLabourAnalysis") === "true") newTitle = "Labour";
        else if (searchParams.get("fromHome") === "true") newTitle = "Operating Expense";
      } else if (normalizedRoute === "cashreconc") {
        if (searchParams.get("fromLabourAnalysis") === "true") newTitle = "Labour";
        else if (searchParams.get("fromHome") === "true") newTitle = "Operating cashreconc";
      }
    }

    setTitle(newTitle);
    document.title = newTitle;
  };

  const checkAccessControl = () => {
    if (!data) return true; // Assume authorized until data is loaded
    const currentRoute = currentPath.replace(/^\/|\/$/g, "").toLowerCase();
    const userType = data.usertype;
    const restrictedSetupRoutes = [
      "setup/categories",
      "setup/dqcategories",
      "setup/tenders",
      "setup/userdetails",
    ];

    const isRestricted = restrictedSetupRoutes.includes(currentRoute) && userType !== "A";
    setIsAuthorized(!isRestricted);
    return !isRestricted;
  };

  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isMounted || !data) return;
    updateTitleWithQueryParams();
    const isAllowed = checkAccessControl();
    if (!isAllowed) {
      router.push(data.usertype === "U" ? "/unauthorised" : "/");
    }
  }, [currentPath, data, isMounted, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsRotated(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setIsRotated((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserType");
    router.replace("/login");
  };

  const getInitials = (): string =>
    data?.firstname && data?.lastname
      ? `${data.firstname.charAt(0).toUpperCase()}${data.lastname.charAt(0).toUpperCase()}`
      : "NA";

  const renderSkeleton = () => (
    <header className="w-full sticky z-30 bg-white h-[50px] flex justify-center items-center shadow">
      <div className="flex justify-between items-center w-full below-md:justify-center">
        <div className="flex justify-center items-center pl-8 below-md:pl-0">
          <span className="text-[18px] font-bold text-defaultblack">Loading...</span>
        </div>
        <div className="flex justify-end items-center below-md:absolute below-md:right-0">
          <div className="w-10 h-10 mr-4 flex items-center justify-center rounded-full bg-[#29235bb1] text-defaultwhite font-semibold text-lg">
            NA
          </div>
        </div>
      </div>
    </header>
  );

  if (!isMounted || data === null) return renderSkeleton();
  if (isAuthorized === false) return null; // Prevent rendering before redirect

  return (
    <header className="w-full sticky z-30 bg-white h-[50px] flex justify-center items-center shadow">
      <div className="flex justify-between items-center w-full below-md:justify-center">
        <div className="flex justify-center items-center pl-8 below-md:pl-0">
          <span className="text-[18px] font-bold text-defaultblack">{title || "Loading..."}</span>
        </div>
        <div className="flex justify-end items-center below-md:absolute below-md:right-0">
          {data ? (
            <>
              {data.profileImage && !imageError ? (
                <img
                  className="w-10 h-10 mr-4 rounded-full"
                  src={data.profileImage}
                  alt="Profile"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-10 h-10 mr-4 flex items-center justify-center rounded-full bg-[#29235bb1] text-defaultwhite font-semibold text-lg">
                  {getInitials()}
                </div>
              )}
              <div className="flex flex-col below-md:hidden">
                <p className="text-[14px] font-semibold text-right">{data.firstname}</p>
                <p className="text-[12px] font-medium">{data.lastname}</p>
              </div>
            </>
          ) : (
            <div className="w-10 h-10 mr-4 flex items-center justify-center rounded-full bg-[#29235bb1] text-defaultwhite font-semibold text-lg">
              NA
            </div>
          )}
          <div className="ml-8 mr-4 cursor-pointer below-md:hidden relative" ref={dropdownRef}>
            <button
              onClick={handleToggle}
              className="w-10 h-10 flex items-center justify-center"
              aria-label="Toggle profile dropdown"
            >
              <img
                src="/images/profiledropdownside.svg"
                alt="Dropdown Icon"
                className={`transition-transform duration-300 ${isRotated ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-3 mr-2 pl-4 w-52 bg-white shadow-lg rounded-lg">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]"
                    onClick={() => router.push("/myprofile")}
                  >
                    <img src="/images/Profile.svg" className="inline-block mr-2" alt="Profile" />
                    My Profile
                  </li>
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]"
                    onClick={handleLogout}
                  >
                    <img src="/images/navbarlogouticon.svg" className="inline-block mr-2" alt="Logout" />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

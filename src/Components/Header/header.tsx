"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { sendApiRequest } from "@/utils/apiUtils";

// --- Global Context Types ---
interface StoreOption {
  id: number;
  name: string;
}
interface DateRangeOption {
  id: number;
  name: string;
  value: string;
}
interface GlobalContextType {
  storeOptions: StoreOption[];
  selectedStore: StoreOption | null;
  setSelectedStore: (store: StoreOption) => void;
  dateRangeOptions: DateRangeOption[];
  selectedDateRange: DateRangeOption;
  setSelectedDateRange: (range: DateRangeOption) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// --- Global Context Provider ---
const dateRangeOptionsDefault: DateRangeOption[] = [
  { id: 1, name: "This Month (MTD)", value: "this_month" },
  { id: 2, name: "This Year (YTD)", value: "this_year" },
  { id: 3, name: "Last Month", value: "last_month" },
  { id: 4, name: "Last Year", value: "last_year" },
];

export function useGlobalContext() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext must be used within GlobalContext.Provider");
  return ctx;
}

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

const getRangeFromOption = (option: DateRangeOption): { start: Date; end: Date } => {
  const now = new Date();
  let start: Date, end: Date;
  switch (option.value) {
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = now;
      break;
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
      break;
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "last_year":
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = now;
  }
  return { start, end };
};

const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
  // Load persisted selectedDateRange first (lazy init)
  const [dateRangeOptions] = useState<DateRangeOption[]>(dateRangeOptionsDefault);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>(() => {
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("selectedDateRangeId");
      if (savedId) {
        const found = dateRangeOptionsDefault.find(o => o.id === Number(savedId));
        if (found) return found;
      }
    }
    return dateRangeOptionsDefault[0];
  });
  // Initial range from (possibly persisted) selectedDateRange
  const initialRange = getRangeFromOption(
    typeof window !== "undefined"
      ? (selectedDateRange || dateRangeOptionsDefault[0])
      : dateRangeOptionsDefault[0]
  );
  const [startDate, setStartDate] = useState<Date | undefined>(initialRange.start);
  const [endDate, setEndDate] = useState<Date | undefined>(initialRange.end);
  // Persisted store
  const [selectedStore, setSelectedStore] = useState<StoreOption | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedStore");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return null;
  });

  // Fetch stores and reconcile persisted selection
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await sendApiRequest({ mode: "getUserStore" });
        if (response?.status === 200) {
          const stores = response?.data?.stores || [];
          const formattedStores = stores.map((store: any) => ({
            name: `${store.name} - ${store.location || "Unknown Location"}`,
            id: store.id,
          }));
          setStoreOptions(formattedStores);
          // If persisted store still exists use it, else default to first
          if (formattedStores.length > 0) {
            setSelectedStore(prev => {
              if (prev && formattedStores.some(s => s.id === prev.id)) return prev;
              return formattedStores[0];
            });
          }
        }
      } catch {
        // silent
      }
    };
    fetchStores();
  }, []);

  // Persist selectedStore
  useEffect(() => {
    if (selectedStore) {
      try { localStorage.setItem("selectedStore", JSON.stringify(selectedStore)); } catch {}
    }
  }, [selectedStore]);

  // When selectedDateRange changes, update dates & persist
  useEffect(() => {
    if (!selectedDateRange) return;
    const { start, end } = getRangeFromOption(selectedDateRange);
    setStartDate(start);
    setEndDate(end);
    try { localStorage.setItem("selectedDateRangeId", String(selectedDateRange.id)); } catch {}
  }, [selectedDateRange]);

  return (
    <GlobalContext.Provider
      value={{
        storeOptions,
        selectedStore,
        setSelectedStore,
        dateRangeOptions,
        selectedDateRange,
        setSelectedDateRange,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// --- Header Component ---
const Header: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const [title, setTitle] = useState("");
  const [customToast, setCustomToast] = useState<ToastState>({ message: "", type: "" });
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

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
      itemratebyunit: "Item Rate by Unit",
      expenses: "Expenses",
      cashreconc: "Cash Reconciliation",
      grossrevenue: "Gross Revenue",
      customercount: "Customer Count",
      logout: "Logout",
      plreport: "P&L",
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
    if (!data) return true;
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

  return (
    <GlobalProvider>
      {(!isMounted || data === null) && renderSkeleton()}
      {isMounted && data !== null && isAuthorized !== false && (
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
      )}
      {isMounted && data !== null && isAuthorized === false && null}
    </GlobalProvider>
  );
};

export { GlobalProvider };
export default Header;

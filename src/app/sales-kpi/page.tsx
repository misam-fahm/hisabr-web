"use client";
import { FC, useEffect, useState } from "react";
import DonutChart from "@/Components/Charts-Graph/DonutChart";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { useRouter } from "next/navigation";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { sendApiRequest } from "@/utils/apiUtils";
import { format } from "date-fns";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import Tooltip from "@/Components/UI/Toolstips/Tooltip";
import YearlySalesGraph from "@/Components/Charts-Graph/YearlySalesGraph";
import TenderRevenueChart from "@/Components/Charts-Graph/TenderRevenueChart";
import TenderCommAmtChart from "@/Components/Charts-Graph/TenderCommAmtChart";

const SalesKPI: FC = () => {
  const router = useRouter();
  const tableDataForTender: any[] = [
    { name: "Cash", revenue: 10000, commission: "", amount: 0 },
    { name: "Amex", revenue: 15000, commission: "3.0%", amount: 450.0 },
    { name: "Master", revenue: 20000, commission: "2.5%", amount: 500.0 },
    { name: "VISA", revenue: 18000, commission: "2.0%", amount: 360.0 },
  ];
  const tableDataForItems: any[] = [
    { name: "Beverage", revenue: 93, commission: "248.00" },
    { name: "Cakes", revenue: 77, commission: "350.00" },
    { name: "Food", revenue: 56, commission: "450.00" },
    { name: "Novelties-Boxed", revenue: 93, commission: "248.00" },
    { name: "Soft Serve", revenue: 77, commission: "350.00" },
    { name: "Donations", revenue: 56, commission: "450.00" },
  ];
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [data, setData] = useState<any>([]);
  // const [isFirstCall, setIsFirstCall] = useState<boolean>(true);
  const [tender, setTender] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [prevYearData, setPrevYearData] = useState<any>(null);
const [prevPeriodData, setPrevPeriodData] = useState<any>(null);
const [currYearData, setCurrYearData] = useState<any>(null);
const [periodType, setPeriodType] = useState<"month" | "quarter" | "year" | "multi">("year");  const [showTooltip, setShowTooltip] = useState(false);
  const [operatExpAmt, setOperatExpAmt] = useState(0);
  const [royaltyAmt, setRoyaltyAmt] = useState(0);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const labourCost = Number(data?.labour_cost) || 0;
  const taxAmount = Number(data?.tax_amt) || 0;
  const sales: any = data?.net_sales ? Math.round(data?.net_sales) : 0;
  const profit: any = data?.net_sales
    ? Math.round(
        data?.net_sales -
          data?.producttotal -
          data?.labour_cost -
          operatExpAmt -
          royaltyAmt
      )
    : 0;
  // const royalty = data?.net_sales ? Number((data.net_sales * 0.09 /).toFixed(2)) : 0;
  // const operatingExpenses = data?.labour_cost ? 109817 : 0;
  const validProfit = data?.net_sales
  ? Math.max(
      Math.round(
        data.net_sales -
          data.producttotal -
          data.labour_cost -
          operatExpAmt -
          royaltyAmt
      ),
      0
    )
  : 0;

// Calculate total excluding Sales
const total = labourCost + taxAmount + royaltyAmt + operatExpAmt + validProfit;

// Calculate raw percentages
const percentages = total > 0
  ? {
      labourCost: (labourCost / total) * 100,
      taxAmount: (taxAmount / total) * 100,
      royalty: (royaltyAmt / total) * 100,
      operatingExpenses: (operatExpAmt / total) * 100,
      profit: (validProfit / total) * 100,
    }
  : {
      labourCost: 0,
      taxAmount: 0,
      royalty: 0,
      operatingExpenses: 0,
      profit: 0,
    };

// Normalize percentages to sum to 100%
const percentageValues = [
  percentages.labourCost,
  percentages.taxAmount,
  percentages.royalty,
  percentages.operatingExpenses,
  percentages.profit,
];
const percentageSum = percentageValues.reduce((sum, val) => sum + val, 0);
const normalizedPercentages =
  percentageSum > 0
    ? percentageValues.map((val) => ((val / percentageSum) * 100).toFixed(2))
    : percentageValues.map(() => "0.00");

const tableData = [
  {
    label: "Profit",
    amount: validProfit.toLocaleString(),
    per: normalizedPercentages[4],
    color: "#3CB371",
  },
  {
    label: "Labour Cost",
    amount: (Math.round(labourCost) || 0).toLocaleString(),
    per: normalizedPercentages[0],
    color: "#4B4B4B",
  },
  {
    label: "Sales Tax",
    amount: (Math.round(taxAmount) || 0).toLocaleString(),
    per: normalizedPercentages[1],
    color: "#DAB777",
  },
  {
    label: "Royalty",
    amount: (Math.round(royaltyAmt) || 0).toLocaleString(),
    per: normalizedPercentages[2],
    color: "#653C59",
  },
  {
    label: "Operating Expenses",
    amount: (Math.round(operatExpAmt) || 0).toLocaleString(),
    per: normalizedPercentages[3],
    color: "#FF5555",
  },
];

useEffect(() => {
  if (isVerifiedUser) {
    const currentYear = new Date().getFullYear();
    setStartDate(new Date(`${currentYear}-01-01`));
    setEndDate(new Date(`${currentYear}-12-31`));
    getUserStore();
    // Fetch current year data
    fetchCurrentYearData(currentYear);
  }
}, [isVerifiedUser]);

const fetchCurrentYearData = async (currentYear: number) => {
  try {
    const response: any = await sendApiRequest({
      mode: "getSalesKpi",
      storeid: selectedOption?.id || 69,
      startdate: `${currentYear}-01-01`,
      enddate: `${currentYear}-12-31`,
    });

    if (response?.status === 200) {
      const salesKpi = response?.data?.saleskpi[0] || {};
      setCurrYearData(salesKpi);

      // Calculate operatExpAmt and royaltyAmt for current year
      const months = 12; // Full year
      const payrollTaxAmt = salesKpi.labour_cost * (salesKpi.payrolltax / 100);
      const yearExpAmt = salesKpi.Yearly_expense;
      const currYearOperatExpAmt =
        salesKpi.additional_expense +
        payrollTaxAmt +
        yearExpAmt +
        salesKpi.monthly_expense * months || 0;
      const currYearRoyaltyAmt =
        salesKpi.net_sales * (salesKpi.royalty / 100 || 0.09) || 0;

      setCurrYearData((prev: any) => ({
        ...prev,
        operatExpAmt: currYearOperatExpAmt,
        royaltyAmt: currYearRoyaltyAmt,
      }));
    }
  } catch (error) {
    console.error("Error fetching current year data:", error);
    setCustomToast({
      message: "Error fetching current year data",
      type: "error",
    });
  }
};
useEffect(() => {
    if (startDate && endDate && selectedOption) {
      fetchData();
      // setIsFirstCall(false);
      fetchDataForTender();
      // fetchDataForItems();
    }
  }, [selectedOption]);

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
  };

  const getMonthsDifference = () => {
    // const start = new Date(startDate);
    // const end = new Date(endDate);
    if (startDate && endDate) {
      const yearDiff = endDate.getFullYear() - startDate.getFullYear();
      const monthDiff = endDate.getMonth() - startDate.getMonth();
      return yearDiff * 12 + (monthDiff + 1);
    }
  };

  const fetchData = async () => {
    try {
      if (startDate && endDate) {
        const response: any = await sendApiRequest({
          mode: "getSalesKpi",
          storeid: selectedOption?.id || 69,
          startdate: startDate && format(startDate, "yyyy-MM-dd"),
          enddate: endDate && format(endDate, "yyyy-MM-dd"),
        });

        if (response?.status === 200) {
          setData(response?.data?.saleskpi[0] || []);
          const months = getMonthsDifference() || 12;
          const payrollTaxAmt =
            response?.data?.saleskpi[0]?.labour_cost *
            (response?.data?.saleskpi[0]?.payrolltax / 100);
          const yearExpAmt =
            (response?.data?.saleskpi[0]?.Yearly_expense / 12) * months;
          setOperatExpAmt(
            response?.data?.saleskpi[0]?.additional_expense +
              payrollTaxAmt +
              yearExpAmt +
              response?.data?.saleskpi[0]?.monthly_expense * months || 0
          );
          setRoyaltyAmt(
            response?.data?.saleskpi[0]?.net_sales *
              (response?.data?.saleskpi[0]?.royalty / 100 || 0.09)
          );
          // response?.data?.total > 0 &&
          //   setTotalItems(response?.data?.saleskpi[0] || 0);
        } else {
          setCustomToast({
            ...customToast,
            message: response?.message,
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataForTender = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      if (startDate && endDate) {
        const response: any = await sendApiRequest({
          mode: "getLatestTenders",
          storeid: selectedOption?.id || 69,
          startdate: startDate && format(startDate, "yyyy-MM-dd"),
          enddate: endDate && format(endDate, "yyyy-MM-dd"),
        });

        if (response?.status === 200) {
          setTender(response?.data?.tenders || []);
        } else {
          setCustomToast({
            ...customToast,
            message: response?.message,
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching tender data:", error);
      setCustomToast({
        ...customToast,
        message: "Error fetching tender data",
        type: "error",
      });
    } finally {
      setLoading(false); // Set loading to false after fetching (success or failure)
    }
  };

  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      fetchData();
      fetchDataForTender();
    }
  }, [startDate, endDate, selectedOption]);
  // const fetchDataForItems = async () => {
  //   try {
  //     if (startDate && endDate) {
  //       const response: any = await sendApiRequest({
  //         mode: "getDqRevCenterSmmary",
  //         storeid: selectedOption?.id || 69,
  //         startdate: startDate && format(startDate, 'yyyy-MM-dd'),
  //         enddate: endDate && format(endDate, 'yyyy-MM-dd'),
  //       });

  //       if (response?.status === 200) {
  //         setItems(response?.data?.dqcategories || []);
  //         // response?.data?.total > 0 &&
  //         //   setTotalItems(response?.data?.saleskpi[0] || 0);
  //       } else {
  //         setCustomToast({
  //           ...customToast,
  //           message: response?.message,
  //           type: "error",
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  // }
  // };

  // const fetchDropdownData = async () => {
  //   try {
  //     const response = await sendApiRequest({ mode: "getAllStores" });
  //     if (response?.status === 200) {
  //       setStore(response?.data?.stores || []);
  //     } else {
  //       handleError(response?.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching stores:", error);
  //   }
  // };

  const [openSection, setOpenSection] = useState<null | string>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };


  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const stores = response?.data?.stores || [];
        // Map stores to the format expected by the Dropdown component
        const formattedStores = stores.map((store) => ({
          name: `${store.name} - ${store.location || "Unknown Location"}`, // Ensure location is handled
          id: store.id,
        }));
        
        setStore(formattedStores); // Update store state with formatted data
        
        if (stores.length > 0) {
          setSelectedOption({
            name: `${stores[0].name} - ${stores[0].location || "Unknown Location"}`,
            id: stores[0].id,
          });
        }
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const res: any = await sendApiRequest({
        token: token
      }, `auth/verifyToken`);
      res?.status === 200 
        ? setIsVerifiedUser(true) 
        : router.replace('/login');
    } catch (error) {
      router.replace('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      verifyToken(token);
    }
  }, []);

  useEffect(() => {
    if (isVerifiedUser) {
      const currentYear = new Date().getFullYear();
      // setStartDate(new Date(`${currentYear}-01-01`));
      // setEndDate(new Date(`${currentYear}-12-31`));
      setStartDate(new Date(currentYear, 0, 1));
      setEndDate(new Date(currentYear, 11, 31));
      getUserStore();
      // fetchDropdownData();
    }
  }, [isVerifiedUser]);

  const handlePressStart = () => {
    setShowTooltip(true);

    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  const handleClickForTender = () => {
    router.push("/setup/tenders?fromHome=true");
  };

  const handleClickForInvoice = () => {
    router.push("/invoices?fromSaleItems=true");
  };

  const totalPayments = tender?.reduce(
    (sum: any, row: any) => sum + (row.payments || 0),
    0
  );
  const totalCommission = tender?.reduce(
    (sum: any, row: any) =>
      sum + ((row.payments || 0) * (row.commission || 0)) / 100,
    0
  );
  const totalFinalAmount =
    tender?.reduce(
      (sum: number, row: any) => sum + (row.payments * row.commission) / 100,
      0
    ) ?? 0;

  const totalQty = items?.reduce(
    (acc: any, row: any) => acc + Number(row.quantity),
    0
  );
  const totalExtPrice = items?.reduce(
    (acc: any, row: any) => acc + Number(row.total),
    0
  );

  // Ensure there's no error when `items` is empty
  const hasItems = items && items.length > 0;

  const colorMapping: { [key: string]: string } = {
    Beverages: "#376066CC",
    Seafood: "#DEC560",
    Frozen: "#5B7993",
    Meat: "red",
    Dessert: "brown",
    Grocery: "#796C79",
    "Packaged & Other": "black",
    Dairy: "gray",
    Produce: "#796C79",
    "Cleaning Products": "lightblue",
    Tortilla: "green",
  };

  // Assuming `items` comes from an API response
  const enhancedItems = items?.map((item: any) => ({
    ...item,
    color: colorMapping[item.itemname] || "#CCCCCC", // Default color if not found
  }));
// Helper function to determine the period type (year, quarter, month, or multi)
const determinePeriodType = (start: Date, end: Date): "month" | "quarter" | "year" | "multi" => {
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  const startMonth = start.getMonth();
  const endMonth = end.getMonth();
  const startDay = start.getDate();
  const endDay = end.getDate();

  // Check if the range spans a full year (Jan 1 to Dec 31)
  if (
    startYear === endYear &&
    startMonth === 0 &&
    endMonth === 11 &&
    startDay === 1 &&
    endDay === 31
  ) {
    return "year";
  }

  // Calculate the number of months in the range
  const monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

  // Check if the range is exactly one month
  if (
    monthDiff === 1 &&
    startDay === 1 &&
    new Date(endYear, endMonth + 1, 0).getDate() === endDay // Last day of the month
  ) {
    return "month";
  }

  // Check if the range is exactly one quarter (3 months)
  if (monthDiff === 3) {
    const quarterStartMonths = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
    if (
      quarterStartMonths.includes(startMonth) &&
      startDay === 1 &&
      new Date(endYear, endMonth + 1, 0).getDate() === endDay
    ) {
      return "quarter";
    }
  }

  // If the range spans multiple months or quarters, return "multi"
  return "multi";
};

// Helper function to calculate previous year and period dates
const getPreviousDates = () => {
  if (!startDate || !endDate) return { prevYearStart: null, prevYearEnd: null, prevPeriodStart: null, prevPeriodEnd: null, period: "multi" as const };

  const period = determinePeriodType(startDate, endDate);
  setPeriodType(period);

  let prevYearStart: Date | null = null;
  let prevYearEnd: Date | null = null;
  let prevPeriodStart: Date | null = null;
  let prevPeriodEnd: Date | null = null;

  // Previous year is always the year before the startDate
  prevYearStart = new Date(startDate.getFullYear() - 1, 0, 1); // Jan 1 of previous year
  prevYearEnd = new Date(startDate.getFullYear() - 1, 11, 31); // Dec 31 of previous year

  if (period === "month") {
    // For a month, use the same month of the previous year
    prevPeriodStart = new Date(startDate.getFullYear() - 1, startDate.getMonth(), 1);
    prevPeriodEnd = new Date(startDate.getFullYear() - 1, startDate.getMonth() + 1, 0); // Last day of the same month last year
  } else if (period === "quarter") {
    // For a quarter, use the same quarter of the previous year
    prevPeriodStart = new Date(startDate.getFullYear() - 1, startDate.getMonth(), 1);
    prevPeriodEnd = new Date(endDate.getFullYear() - 1, endDate.getMonth() + 1, 0); // Last day of the same quarter last year
  }
  // For "year" or "multi", prevPeriodStart and prevPeriodEnd remain null to hide the previous period data

  return { prevYearStart, prevYearEnd, prevPeriodStart, prevPeriodEnd, period };
};

// Fetch previous year and period data
const fetchPreviousData = async () => {
  if (!startDate || !endDate || !selectedOption) return;

  const { prevYearStart, prevYearEnd, prevPeriodStart, prevPeriodEnd, period } = getPreviousDates();
  if (!prevYearStart || !prevYearEnd) return;

  try {
    // Fetch previous year data
    const prevYearResponse: any = await sendApiRequest({
      mode: "getSalesKpi",
      storeid: selectedOption?.id || 69,
      startdate: format(prevYearStart, "yyyy-MM-dd"),
      enddate: format(prevYearEnd, "yyyy-MM-dd"),
    });

    if (prevYearResponse?.status === 200) {
      const prevYearSalesKpi = prevYearResponse?.data?.saleskpi[0] || {};
      setPrevYearData(prevYearSalesKpi);

      // Calculate operatExpAmt and royaltyAmt for previous year
      const months = 12; // Full year
      const payrollTaxAmt = prevYearSalesKpi.labour_cost * (prevYearSalesKpi.payrolltax / 100);
      const yearExpAmt = prevYearSalesKpi.Yearly_expense;
      const prevYearOperatExpAmt =
        prevYearSalesKpi.additional_expense +
        payrollTaxAmt +
        yearExpAmt +
        prevYearSalesKpi.monthly_expense * months || 0;
      const prevYearRoyaltyAmt =
        prevYearSalesKpi.net_sales * (prevYearSalesKpi.royalty / 100 || 0.09) || 0;

      // Store these values in prevYearData or a separate state if needed
      setPrevYearData((prev: any) => ({
        ...prev,
        operatExpAmt: prevYearOperatExpAmt,
        royaltyAmt: prevYearRoyaltyAmt,
      }));
    }

    // Fetch previous period data (month or quarter) only if period is "month" or "quarter"
    if (prevPeriodStart && prevPeriodEnd && (period === "month" || period === "quarter")) {
      const prevPeriodResponse: any = await sendApiRequest({
        mode: "getSalesKpi",
        storeid: selectedOption?.id || 69,
        startdate: format(prevPeriodStart, "yyyy-MM-dd"),
        enddate: format(prevPeriodEnd, "yyyy-MM-dd"),
      });

      if (prevPeriodResponse?.status === 200) {
        const prevPeriodSalesKpi = prevPeriodResponse?.data?.saleskpi[0] || {};
        setPrevPeriodData(prevPeriodSalesKpi);

        // Calculate operatExpAmt and royaltyAmt for previous period
        const months = period === "month" ? 1 : 3; // 1 for month, 3 for quarter
        const payrollTaxAmt = prevPeriodSalesKpi.labour_cost * (prevPeriodSalesKpi.payrolltax / 100);
        const yearExpAmt = (prevPeriodSalesKpi.Yearly_expense / 12) * months;
        const prevPeriodOperatExpAmt =
          prevPeriodSalesKpi.additional_expense +
          payrollTaxAmt +
          yearExpAmt +
          prevPeriodSalesKpi.monthly_expense * months || 0;
        const prevPeriodRoyaltyAmt =
          prevPeriodSalesKpi.net_sales * (prevPeriodSalesKpi.royalty / 100 || 0.09) || 0;

        // Store these values in prevPeriodData or a separate state if needed
        setPrevPeriodData((prev: any) => ({
          ...prev,
          operatExpAmt: prevPeriodOperatExpAmt,
          royaltyAmt: prevPeriodRoyaltyAmt,
        }));
      } else {
        setPrevPeriodData({}); // Clear previous period data if fetch fails
      }
    } else {
      setPrevPeriodData({}); // Clear previous period data for "year" or "multi" selections
    }
  } catch (error) {
    console.error("Error fetching previous data:", error);
    setCustomToast({
      message: "Error fetching previous period data",
      type: "error",
    });
    setPrevPeriodData({}); // Clear previous period data on error
  }
};

const calculateProfit = (data: any): number => {
  if (!data?.net_sales) return 0;
  const profit = Math.round(
    data.net_sales -
      (data.producttotal || 0) -
      (data.labour_cost || 0) -
      (data.operatExpAmt || 0) -
      (data.royaltyAmt || 0)
  );
  return profit < 0 ? 0 : profit;
};

// Update useEffect to fetch previous data when startDate, endDate, or selectedOption changes
useEffect(() => {
  if (startDate && endDate && selectedOption) {
    fetchData();
    fetchDataForTender();
    fetchPreviousData();
  }
}, [startDate, endDate, selectedOption]);

  return (
    isVerifiedUser && (
      <main
        className="max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)] below-md:max-h-[calc(100vh-0)] overflow-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        <div>
          <div className="flex flex-row below-md:flex-col below-md:items-end sticky  justify-between pt-6 below-md:pt-4 below-md:px-3  pl-6 pr-6 pb-6 below-md:pb-4 bg-[#f7f8f9] ">
            <div className="flex flex-row below-md:flex-col w-full gap-3">
              <Dropdown
                options={store}
                selectedOption={selectedOption?.name || "Store"}
                onSelect={(selectedOption: any) => {
                  setSelectedOption({
                    name: selectedOption.name,
                    id: selectedOption.id,
                  });
                  setIsStoreDropdownOpen(false);
                }}
                isOpen={isStoreDropdownOpen}
                toggleOpen={toggleStoreDropdown}
              />

              <div className="w-[260px] tablet:w-full below-md:w-full">
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  fetchData={fetchData}
                  fetchDataForTender={fetchDataForTender}
                  // fetchDataForItems={fetchDataForItems}
                />
              </div>
            </div>
            {/* <div className="below-md:hidden tablet:hidden">
            <button className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg w-[170px] h-[35px] rounded-md text-white text-[13px] font-medium">
              <img
                src="/images/saleskpireport.svg"
                alt="Upload Icon"
                className="mr-1"
              />
              PI Report
            </button>
          </div> */}
          </div>

          {/* grid 1 */}
          <div className="grid grid-cols-4 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3 pl-6 pr-6 items-stretch tablet:flex-wrap tablet:gap-3">
  {/* Net Sales Card */}
  <div
    className="flex flex-row bg-[#FFFFFF] cursor-pointer rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch"
    onClick={() => router.push("/sales")}
  >
    <div>
      <p className="text-[14px] text-[#575F6DCC] font-medium">Net Sales</p>
      <p className="text-[16px] text-[#2D3748] font-bold">
        {data?.net_sales
          ? `$${Math.round(data?.net_sales)?.toLocaleString()}`
          : "$00,000"}
      </p>
      <p className="text-[11px] text-[#575F6D] font-normal">
        <span>
          Prev. Yr.{" "}
          {prevYearData?.net_sales
            ? `$${Math.round(prevYearData.net_sales).toLocaleString()}`
            : "$0"}
        </span>
        <br />
  <span>
    Curr. Yr.{" "}
    {currYearData?.net_sales
      ? `$${Math.round(currYearData.net_sales).toLocaleString()}`
      : "$0"}
  </span>
  <br />        {periodType !== "year" &&
          periodType !== "multi" &&
          prevPeriodData?.net_sales && (
            <span>
              {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
              {`$${Math.round(prevPeriodData.net_sales).toLocaleString()}`}
            </span>
          )}
      </p>
    </div>
    <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
      <img src="./images/saleskpisales.svg" />
    </div>
  </div>

  {/* Profit Card */}
  <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
    <div className="w-[75%]">
      <p className="text-[14px] text-[#575F6DCC] font-medium">Profit</p>
      <p className="text-[16px] text-[#2D3748] font-bold">
        {data?.net_sales
          ? `$${validProfit.toLocaleString()}`
          : "$00,000"}
      </p>
      <p className="text-[11px] text-[#575F6D] font-normal">
        <span>
        Prev. Yr.{" "}
          {prevYearData?.net_sales
            ? `$${calculateProfit(prevYearData).toLocaleString()}`
            : "$0"}
        </span>
        <br />
            <span>
              Curr. Yr.{" "}
              {currYearData?.net_sales
                ? `$${calculateProfit(currYearData).toLocaleString()}`
                : "$0"}
            </span>
        <br />        {periodType !== "year" &&
          periodType !== "multi" &&
          prevPeriodData?.net_sales && (
            <span>
              {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
              {`$${calculateProfit(prevPeriodData).toLocaleString()}`}
            </span>
          )}
      </p>
    </div>
    <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
      <img src="./images/saleskpiprofit.svg" />
    </div>
  </div>

  {/* Customer Count Card */}
  <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
    <div className="w-[75%]">
      <p className="text-[14px] text-[#575F6DCC] font-medium">Customer Count</p>
      <p className="text-[16px] text-[#2D3748] font-bold">
        {data?.customer_count
          ? `${Math.round(data.customer_count)?.toLocaleString()}`
          : "00,000"}
      </p>
      <p className="text-[11px] text-[#575F6D] font-normal">
        <span>
          Prev. Yr.{" "}
          {prevYearData?.customer_count
            ? `${Math.round(prevYearData.customer_count).toLocaleString()}`
            : "0"}
        </span>
        <br />
          <span>
            Curr. Yr.{" "}
            {currYearData?.customer_count
              ? `${Math.round(currYearData.customer_count).toLocaleString()}`
              : "0"}
          </span>
        <br />        
  {periodType !== "year" &&
          periodType !== "multi" &&
          prevPeriodData?.customer_count && (
            <span>
              {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
              {`${Math.round(prevPeriodData.customer_count).toLocaleString()}`}
            </span>
          )}
      </p>
    </div>
    <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
      <img src="./images/saleskpicustomercount.svg" />
    </div>
  </div>

  {/* Labour Cost Card */}
  <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
    <div>
      <p className="text-[14px] text-[#575F6DCC] font-medium">Labour Cost</p>
      <p className="text-[16px] text-[#2D3748] font-bold">
        {data?.labour_cost
          ? `$${Math.round(data.labour_cost)?.toLocaleString()}`
          : "$00,000"}
      </p>
      <p className="text-[11px] text-[#575F6D] font-normal">
        <span>
          Prev. Yr.{" "}
          {prevYearData?.labour_cost
            ? `$${Math.round(prevYearData.labour_cost).toLocaleString()}`
            : "$0"}
        </span>
        <br />
  <span>
    Curr. Yr.{" "}
    {currYearData?.labour_cost
      ? `$${Math.round(currYearData.labour_cost).toLocaleString()}`
      : "$0"}
  </span>
  <br />        {periodType !== "year" &&
          periodType !== "multi" &&
          prevPeriodData?.labour_cost && (
            <span>
              {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
              {`$${Math.round(prevPeriodData.labour_cost).toLocaleString()}`}
            </span>
          )}
      </p>
    </div>
    <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
      <img src="./images/labour.svg" />
    </div>
  </div>

            {/* grid 2 */}
{/* Sales Tax */}
<div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">Sales Tax</p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {data?.tax_amt
        ? `$${Math.round(data?.tax_amt)?.toLocaleString()}`
        : "$00,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.tax_amt
          ? `$${Math.round(prevYearData.tax_amt).toLocaleString()}`
          : "$0"}
      </span>
      <br />
        <span>
          Curr. Yr.{" "}
          {currYearData?.tax_amt
            ? `$${Math.round(currYearData.tax_amt).toLocaleString()}`
            : "$0"}
        </span>
      <br />
      {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.tax_amt && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.tax_amt).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpisalestax.svg" />
  </div>
</div>

{/* Royalty */}
<div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">Royalty</p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {royaltyAmt
        ? `$${Math.round(royaltyAmt)?.toLocaleString()}`
        : "$00,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.royaltyAmt
          ? `$${Math.round(prevYearData.royaltyAmt).toLocaleString()}`
          : "$0"}
      </span>
      <br />
        <span>
          Curr. Yr.{" "}
          {currYearData?.royaltyAmt
            ? `$${Math.round(currYearData.royaltyAmt).toLocaleString()}`
            : "$0"}
        </span>
       <br />
        {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.royaltyAmt && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.royaltyAmt).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpiroyalty.svg" />
  </div>
</div>

{/* Operating Expenses */}
<div
  className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm cursor-pointer border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch"
  onClick={() => router.push("/expenses")}
>
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">
      Operating Expenses
    </p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {operatExpAmt
        ? `$${Math.round(operatExpAmt)?.toLocaleString()}`
        : "$000,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.operatExpAmt
          ? `$${Math.round(prevYearData.operatExpAmt).toLocaleString()}`
          : "$0"}
      </span>
      <br />
        <span>
          Curr. Yr.{" "}
          {currYearData?.operatExpAmt
            ? `$${Math.round(currYearData.operatExpAmt).toLocaleString()}`
            : "$0"}
        </span>
       <br />
        {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.operatExpAmt && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.operatExpAmt).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpioperatingexpenses.svg" />
  </div>
</div>

{/* COGS */}
<div
  className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] cursor-pointer border-b-4 w-full p-4 justify-between items-stretch"
  onClick={() => router.push("/invoices")}
>
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">COGS</p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {data?.producttotal
        ? `$${Math.round(data?.producttotal)?.toLocaleString()}`
        : "$00,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.producttotal
          ? `$${Math.round(prevYearData.producttotal).toLocaleString()}`
          : "$0"}
      </span>
      <br />
        <span>
          Curr. Yr.{" "}
          {currYearData?.producttotal
            ? `$${Math.round(currYearData.producttotal).toLocaleString()}`
            : "$0"}
        </span>
        <br />   
           {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.producttotal && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.producttotal).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpicogs.svg" />
  </div>
</div>

{/* Total Revenue */}
<div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">Total Revenue</p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {data?.revenue
        ? `$${Math.round(data?.revenue)?.toLocaleString()}`
        : "$00,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.revenue
          ? `$${Math.round(prevYearData.revenue).toLocaleString()}`
          : "$0"}
      </span>
      <br />
        <span>
          Curr. Yr.{" "}
          {currYearData?.revenue
            ? `$${Math.round(currYearData.revenue).toLocaleString()}`
            : "$0"}
        </span>
       <br />    
         {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.revenue && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.revenue).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpiprofit.svg" />
  </div>
</div>

{/* Discount */}
<div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">Discount</p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {data?.discount
        ? `$${Math.round(data?.discount)?.toLocaleString()}`
        : "$00,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.discount
          ? `$${Math.round(prevYearData.discount).toLocaleString()}`
          : "$0"}
      </span>
      <br />
        <span>
          Curr. Yr.{" "}
          {currYearData?.discount
            ? `$${Math.round(currYearData.discount).toLocaleString()}`
            : "$0"}
        </span>
      <br />
        {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.discount && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.discount).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpioperatingexpenses.svg" />
  </div>
</div>

{/* Promotions */}
<div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">Promotions</p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {data?.promotions
        ? `$${Math.round(data?.promotions)?.toLocaleString()}`
        : "$00,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.promotions
          ? `$${Math.round(prevYearData.promotions).toLocaleString()}`
          : "$0"}
      </span>
      <br />
      <span>
        Curr. Yr.{" "}
        {currYearData?.promotions
          ? `$${Math.round(currYearData.promotions).toLocaleString()}`
          : "$0"}
      </span>
      <br />
          {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.promotions && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.promotions).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpicustomercount.svg" />
  </div>
</div>

{/* Voids */}
<div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
  <div>
    <p className="text-[14px] text-[#575F6DCC] font-medium">Voids</p>
    <p className="text-[16px] text-[#2D3748] font-bold">
      {data?.voids
        ? `$${Math.round(data?.voids)?.toLocaleString()}`
        : "$00,000"}
    </p>
    <p className="text-[11px] text-[#575F6D] font-normal">
      <span>
        Prev. Yr.{" "}
        {prevYearData?.voids
          ? `$${Math.round(prevYearData.voids).toLocaleString()}`
          : "$0"}
      </span>
      <br />
        <span>
          Curr. Yr.{" "}
          {currYearData?.voids
            ? `$${Math.round(currYearData.voids).toLocaleString()}`
            : "$0"}
        </span>
      <br />    
    {periodType !== "year" &&
        periodType !== "multi" &&
        prevPeriodData?.voids && (
          <span>
            {periodType === "quarter" ? "Prev. Qr." : "Prev. Mo."}{" "}
            {`$${Math.round(prevPeriodData.voids).toLocaleString()}`}
          </span>
        )}
    </p>
  </div>
  <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center self-center">
    <img src="./images/saleskpicogs.svg" />
  </div>
</div>
          </div>
          <div>
          <p className="text-[14px] text-[#000000cc] font-bold pb-0 pl-8 pt-4">
  Average Order: {data?.avg_order
    ? `$${Math.round(data?.avg_order)?.toLocaleString()}`
    : "$00,000"}
</p>
                
             
              </div>
              <div className="px-6">
      {/* Expense Distribution */}
      <div className="flex flex-col rounded-lg bg-white mt-6 shadow-md">
        <button
          className="text-left font-bold text-[16px] text-[#334155] mx-4 my-4 flex justify-between items-center"
          onClick={() => toggleSection("expense")}
        >
          Expense Distribution
          <span>{openSection === "expense" ? "▲" : "▼"}</span>
        </button>
        {openSection === "expense" && (
          <div className="flex flex-col tablet:flex-col mx-3">
            <div className="flex flex-row items-center justify-between below-md:flex-col tablet:flex-col">
              <div className="-my-12">
                {/* Your DonutChart component */}
                <DonutChart values={data} operatExpAmt={operatExpAmt} />
              </div>
              <div className="overflow-x-auto w-[50%] custom-scrollbar">
                {/* Your Table for Expense Distribution */}
                <table className="items-center bg-transparent w-full below-md:mb-12 tablet:mb-12">
                  {/* Table head */}
                  <thead>
                    <tr>
                      <th className="px-6 bg-blueGray-50 text-[#737373] text-left border py-1 text-sm font-medium">
                        Label
                      </th>
                      <th className="px-6 bg-blueGray-50 text-[#737373] text-right border py-1 text-sm font-medium">
                        Amount
                      </th>
                      <th className="px-6 bg-blueGray-50 text-[#737373] text-right border py-1 text-sm font-medium">
                        %
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody>
                    {tableData?.length > 0 ? (
                      tableData
                        .filter((row: any) => row.label !== "Sales")
                        .map((row: any, index: number) => (
                          <tr key={index}>
                            <td className="border-t-0 px-6 text-left text-xs p-2 flex items-center text-[#404040] text-[13px]">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: row.color || "#CCCCCC" }}
                              ></div>
                              {row.label || "N/A"}
                            </td>
                            <td className="text-[14px] font-medium text-right border-t-0 px-6 text-xs p-2">
                              ${row.amount || "0"}
                            </td>
                            <td className="text-[14px] font-medium text-right border-t-0 px-6 text-xs p-2">
                              {row.per ? `${Number(row.per).toFixed(2)}%` : "0.00%"}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-[#404040] text-[14px]">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tender Revenue Distribution */}
      <div className="flex flex-col rounded-lg bg-white mt-6 shadow-md">
        <button
          className="text-left font-bold text-[16px] text-[#334155] mx-4 my-4 flex justify-between items-center"
          onClick={() => toggleSection("revenue")}
        >
          Tender Revenue Distribution
          <span>{openSection === "revenue" ? "▲" : "▼"}</span>
        </button>
        {openSection === "revenue" && (
          <div className="flex flex-col tablet:flex-col mx-3">
            <div className="flex flex-row items-center justify-between below-md:flex-col tablet:flex-col">
              {loading ? (
                <div className="w-[50%] h-[300px] flex justify-center items-center">
                  <Skeleton circle height={200} width={200} />
                </div>
              ) : tender?.length === 0 ? (
                <div className="w-[50%] h-[300px] flex justify-center items-center">
                  <NoDataFound />
                </div>
              ) : (
                <div className="w-[50%] h-[300px] flex justify-center items-center">
                  <TenderRevenueChart tenderData={tender} />
                </div>
              )}

              <div className="overflow-x-auto w-[50%] custom-scrollbar">
                <table className="items-center bg-transparent w-full below-md:mb-12 tablet:mb-12">
                  <thead>
                    <tr>
                      <th className="px-6 bg-blueGray-50 text-[#737373] text-left border py-1 text-sm font-medium">
                        Tender
                      </th>
                      <th className="px-6 bg-blueGray-50 text-[#737373] text-right border py-1 text-sm font-medium">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4">
                          <Skeleton count={3} height={30} />
                        </td>
                      </tr>
                    ) : tender?.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4">
                          <NoDataFound />
                        </td>
                      </tr>
                    ) : (
                      tender.map((row: any, index: number) => (
                        <tr key={index}>
                          <td className="border-t-0 px-6 text-left text-xs p-2 flex items-center text-[#404040] text-[13px]">
                            {row.tendername}
                          </td>
                          <td className="text-[14px] font-medium text-right border-t-0 px-6 text-xs p-2">
                            ${row.payments.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tender Commission Amount Distribution */}
      <div className="flex flex-col rounded-lg bg-white mt-6 shadow-md">
        <button
          className="text-left font-bold text-[16px] text-[#334155] mx-4 my-4 flex justify-between items-center"
          onClick={() => toggleSection("commission")}
        >
          Tender Commission Amount Distribution
          <span>{openSection === "commission" ? "▲" : "▼"}</span>
        </button>
        {openSection === "commission" && (
          <div className="flex flex-col tablet:flex-col mx-3">
            <div className="flex flex-row items-center justify-between below-md:flex-col tablet:flex-col">
              {loading ? (
                <div className="w-[50%] h-[300px] flex justify-center items-center">
                  <Skeleton circle height={200} width={200} />
                </div>
              ) : tender?.length === 0 ? (
                <div className="w-[50%] h-[300px] flex justify-center items-center">
                  <NoDataFound />
                </div>
              ) : (
                <div className="w-[50%] h-[300px] flex justify-center items-center">
                  <TenderCommAmtChart tenderData={tender} />
                </div>
              )}

              <div className="overflow-x-auto w-[50%] custom-scrollbar">
                <table className="items-center bg-transparent w-full below-md:mb-12 tablet:mb-12">
                  <thead>
                    <tr>
                      <th className="px-6 bg-blueGray-50 text-[#737373] text-left border py-1 text-sm font-medium">
                        Tender
                      </th>
                      <th className="px-6 bg-blueGray-50 text-[#737373] text-right border py-1 text-sm font-medium">
                        Comm. Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4">
                          <Skeleton count={3} height={30} />
                        </td>
                      </tr>
                    ) : tender?.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4">
                          <NoDataFound />
                        </td>
                      </tr>
                    ) : (
                      tender.map((row: any, index: number) => (
                        <tr key={index}>
                          <td className="border-t-0 px-6 text-left text-xs p-2 flex items-center text-[#404040] text-[13px]">
                            {row.tendername}
                          </td>
                          <td className="text-[14px] font-medium text-right border-t-0 px-6 text-xs p-2">
                            $
                            {(
                              (row.payments * row.commission) / 100 || 0
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
          {/* <div className="flex flex-col px-6 py-6">
          <div className="flex flex-col gap-3 ">
        <div className=" bg-white  border-t-4 border-[#BCC7D5]  rounded-md shadow-md below-md:shadow-none w-[100%] items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6 pb-3">
              <div className="flex flex-row gap-2">
                <img src="/images/persentage.svg" alt="Tender" />
                <p className="text-[#334155] text-[16px] font-bold">Tender</p>
              </div>
              <div className="cursor-pointer">
                <img
                  onClick={handleClickForTender}
                  src="/images/underdetails.svg"
                  alt="Details"
                />
              </div>
            </div>
            <div className="overflow-hidden  overflow-x-auto overflow-y-auto h-auto below-md:max-h-[27vh] custom-scrollbar ">
            <table className="w-full  bg-white  border border-gray-200">
                <thead className="bg-[#FAFBFB] shadow-md">
                  <tr className="text-left text-gray-600 font-semibold">
                    <th className="px-4 py-1.5 border-b border-gray-200 text-[14px]">
                      Name
                    </th>
                    <th className="px-4 py-1.5 border-b text-right border-gray-200 text-[14px]">
                      Revenue
                    </th>
                    <th className="px-4 py-1.5 text-right border-b border-gray-200 text-[14px]">
                      Commission
                    </th>
                    <th className="px-4 py-1.5 border-b text-right border-gray-200 text-[14px]">
                      Comm.Amt
                    </th>
                  </tr>
                </thead>

                     
                <tbody>
                { tender?.length === 0 ? (
                            <tr >
                                      <td colSpan={4} className=" ">
                                            <NoDataFound />
                                      </td>
                           </tr>
                 ) : ( 
                tender?.map((row:any, index:any) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#FAFBFB]"}
                    >
                      <td className="px-4 py-1.5 text-[14px] border-b border-gray-200 text-gray-600">
                      <Tooltip position="left" text= {row.tendername.length > 20 ? row.tendername : ""}>
                                           {row.tendername.length > 20 ? row.tendername.substring(0, 20) + "..." : row.tendername || "--"}
                      </Tooltip>

                      </td>
                      <td className="px-4 py-1.5 text-[14px] border-b text-right border-gray-200 text-[#334155] font-medium">
                      {row.payments ? "$" + row.payments.toLocaleString() : "$0"}

                      </td>
                      <td className="px-4 py-1.5 border-b border-gray-200 text-gray-600 text-[14px] font-medium text-right">
                        {row.commission ? (row.commission)?.toFixed(2) + "%" : 0.00 }
                      </td>
                      <td className="px-4 py-1.5 border-b text-right border-gray-200 text-[#3F526D] text-[14px] font-medium">
                      {row.payments && row.commission !== undefined
    ? `$${((row.payments * row.commission) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "--"}
                      </td>
                    </tr>
                  )))}
                </tbody>
                { tender?.length === 0 ? "" : 
                <tfoot className="bg-white">
                  <tr className="font-medium text-black text-[14px]">
                   
                    <td className="px-4 py-1.5 border-t text-right border-gray-200">
                    {totalPayments ? "$" + totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--"}
                    </td>
                    <td className="px-4 py-1.5 border-t text-right border-gray-200"> 
                       {totalCommission ? "$" + (totalCommission).toFixed(2) :"--"}
                       </td>
                    <td className="px-4 py-1.5 border-t text-right border-gray-200">
                    {totalFinalAmount ? "$" + totalFinalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--"}
                    </td>
                  </tr>
                </tfoot> }
              </table>
            </div>
          </div> */}

          {/* <div className=" bg-white  border-t-4 border-[#BCC7D5]  rounded-md shadow-md below-md:shadow-none w-[100%] items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6 pb-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/items.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">Items</p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/underdetails.svg" onClick={handleClickForInvoice} />
              </div>
            </div>

            <div className="overflow-hidden  overflow-x-auto overflow-y-auto  below-md:max-h-[27vh] custom-scrollbar ">
              <table className="w-full  bg-white  border border-gray-200">
              <thead className="bg-[#FAFBFB] shadow-md">
                  <tr className="text-left text-gray-600 font-semibold">
                    <th className="px-4 py-1.5 border-b border-gray-200 text-[14px]">
                      Name
                    </th>
                    <th className="px-4 py-1.5 border-b text-right border-gray-200 text-[14px]">
                      Qty
                    </th>

                    <th className="px-4 py-1.5 border-b text-right border-gray-200 text-[14px]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                { items?.length === 0 ? (
    <tr >
      <td  colSpan={3} className="">
        <NoDataFound />
      </td>
    </tr>
  ) : ( 
                  items?.map((row:any, index:any) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 1
                          ? "bg-white"
                          : "bg-[#FAFBFB] text-[14px]"
                      }`}
                    >
                      <td className="px-4 py-1.5  text-left border-b border-gray-200 text-gray-600 font-medium text-[14px]">
                        {row.categoryname}
                      </td>
                      <td className="px-4 py-1.5  border-b text-right font-medium border-gray-200 text-[#334155] text-[14px] ">
                        {row.quantity}
                      </td>
                      <td className="px-4 py-1.5 border-b text-right border-gray-200 text-[14px] font-medium text-[#334155]">
                        {row.total ? `$${row.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "--"}
                      </td>
                    </tr>
                  )))}
                </tbody>
                {hasItems && (
      <tfoot className="-bottom-1 bg-white sticky">
        <tr className="text-[black] text-[14px]">
          <td className="px-4 py-1.5 border-t text-left border-gray-200 font-medium">
            Total
          </td>
          <td className="px-4 py-1.5 border-t text-right border-gray-200 text-[14px] font-medium">
            {totalQty}
          </td>
          <td className="px-4 py-1.5 border-t text-right border-gray-200 text-[14px] font-medium">
          {totalExtPrice ? `$${totalExtPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "--"}
          </td>
        </tr>
      </tfoot>
    )}
              </table>
            </div>
          </div> */}
        </div>
        {/* <div className="w-full px-3 below-md:w-[100%] mt-8 bg-white below-md:ml-0 tablet:ml-0 tablet:mt-6 tablet:w-full below-md:mt-3 shadow-md rounded-md">
              <div className="flex flex-col"> */}
        {/* Header Section */}
        {/* <div className="flex flex-row justify-between px-6 pt-6 items-start"> */}
        {/* Sales Information */}
        {/* <div className="w-[50%] flex justify-center items-center">
                    <p className="text-[#393E47]  font-bold text-[16px]">
                    Sales by Items
                    </p> */}
        {/* <p className="text-[#0A0A0A] font-bold text-[24px] mt-1">
                      $ {totalExtPrice.toLocaleString()}
                    </p> */}
        {/* <div className="flex flex-row gap-2 bg-[#ECFDF5] p-1 w-20 rounded-sm mt-2 items-center">
                      <img
                        src="/images/direction.svg"
                        alt="Growth Icon"
                        className="w-4 h-4"
                      />
                      <p className="text-[rgba(55, 96, 102, 0.8)] text-[12px]">
                        11.2%
                      </p>
                    </div> */}
        {/* </div> */}

        {/* Dropdown */}
        {/* <div className="mb-6 relative z-[40] below-md:w-[100%] below-md:max-w-[35%]"> */}
        {/* <Dropdown
                      className="relative below-md:w-full rounded"
                      shadowclassName="shadow-none border border-gray-200"
                      options={Yearoptions}
                      selectedOption={selectedYearOption4}
                      onSelect={(option) => handleYearSelect(option, 4)}
                      isOpen={isYearOpen4}
                      toggleOpen={() => toggleYearDropdown(4)}
                      widthchange="below-lg:w-[130px] tablet:w-[130px]"
                    /> */}
        {/* </div>
                </div> */}

        {/* Pie Chart Section */}
        {/* <div className=" flex w-full justify-between flex-row gap-4">
                  <YearlySalesGraph enhancedItems={enhancedItems} totalQty={totalQty}  totalExtPrice={totalExtPrice}/>
            
                <div className="w-full">
                  <div className="w-full px-6 py-6 below-md:pb-12 tablet:pb-12">
                    <ul>
                      {enhancedItems?.map((item :any, index :any) => (
                        <li
                          key={index}
                          className="flex px-[15%] items-center justify-between py-2"
                        >
                         
                          <div className="flex items-center">
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-[#000000B2] text-[12px]">
                              {item.itemname}
                            </span>
                          </div>
                          
                          <span className="font-semibold text-[#0A0A0A] text-[14px]">
                            ${(item.totalextprice).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </div> */}
        {/* </div> */}
        {/* </div> */}
        {/* </div>
      </div> */}
        <div className="below-lg:hidden flex justify-end fixed bottom-5 right-5">
          <button
            className="focus:outline-none flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] w-[56px] h-[56px] rounded-xl relative"
            onTouchStart={handlePressStart} // For mobile devices
            onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
          >
            <img
              src="/images/saleskpireport.svg"
              alt="Upload Icon"
              className="w-[18px]"
            />
            {showTooltip && (
              <div className="absolute bottom-[70px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
                PI Report
                {/* Tooltip Pointer */}
                <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
              </div>
            )}
          </button>
        </div>
      </main>
    )
  );
};

export default SalesKPI;

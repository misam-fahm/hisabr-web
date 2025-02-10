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
import { format } from 'date-fns';
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [operatExpAmt, setOperatExpAmt] = useState(0);
  const [royaltyAmt, setRoyaltyAmt] = useState(0);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);

  const labourCost = Number(data?.labour_cost) || 0;
  const taxAmount = Number(data?.tax_amt) || 0;
  // const royalty = data?.net_sales ? Number((data.net_sales * 0.09 /).toFixed(2)) : 0;
  // const operatingExpenses = data?.labour_cost ? 109817 : 0;

  const total = labourCost + taxAmount + royaltyAmt + operatExpAmt;

  // Prevent division by zero
  const percentages = total > 0 ? {
    labourCost: ((labourCost / total) * 100).toFixed(2),
    taxAmount: ((taxAmount / total) * 100).toFixed(2),
    royalty: ((royaltyAmt / total) * 100).toFixed(2),
    operatingExpenses: ((operatExpAmt / total) * 100).toFixed(2),
  } : {
    labourCost: 0,
    taxAmount: 0,
    royalty: 0,
    operatingExpenses: 0,
  };



  const tableData = [
    // { label: "Profit", amount: "10,000", per: "65%", color: "#53755599" },
    { label: "Labour Cost", amount: (Math.round(data?.labour_cost ) || 0).toLocaleString(), per:  Number(percentages.labourCost), color: "#53755599" },
    { label: "Sales Tax", amount:(Math.round(data?.tax_amt) || 0).toLocaleString(), per: Number(percentages.taxAmount), color: "#DAB777" },
    { label: "Royalty", amount: (Math.round(royaltyAmt) || 0).toLocaleString(), per: Number(percentages.royalty), color: "#653C597A" },
    {
      label: "Operating Expenses",
      amount: data ?  (Math.round( operatExpAmt)).toLocaleString() : 0,
      per:   percentages.operatingExpenses ?  Number(percentages.operatingExpenses) : 0,
      color: "#79AFC7",
    },
    // { label: "COGS", amount: (Math.round(data.producttotal) || 0).toLocaleString(), per: "9.8%", color: "#AC8892" },
  ];


  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      fetchData();
      // setIsFirstCall(false);
      fetchDataForTender();
      fetchDataForItems();
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
          startdate: startDate && format(startDate, 'yyyy-MM-dd'),
          enddate: endDate && format(endDate, 'yyyy-MM-dd'),
        });

        if (response?.status === 200) {
          setData(response?.data?.saleskpi[0] || []);
          const months = getMonthsDifference() || 12;
          console.log("diff months ",months);
          const payrollTaxAmt = response?.data?.saleskpi[0]?.labour_cost * (response?.data?.saleskpi[0]?.payrolltax / 100);
          const yearExpAmt = (response?.data?.saleskpi[0]?.Yearly_expense / 12) * months;
          setOperatExpAmt(response?.data?.saleskpi[0]?.additional_expense + payrollTaxAmt + yearExpAmt || 0);
          setRoyaltyAmt(response?.data?.saleskpi[0]?.net_sales * ((response?.data?.saleskpi[0]?.royalty / 100) || 0.09));
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
    if (startDate && endDate) {
      const response: any = await sendApiRequest({
        mode: "getLatestTenders",
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, 'yyyy-MM-dd'),
        enddate: endDate && format(endDate, 'yyyy-MM-dd'),
      });

      if (response?.status === 200) {
        setTender(response?.data?.tenders || []);
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

const fetchDataForItems = async () => {
  try {
    if (startDate && endDate) {
      const response: any = await sendApiRequest({
        mode: "getLatestItems",
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, 'yyyy-MM-dd'),
        enddate: endDate && format(endDate, 'yyyy-MM-dd'),
      });

      if (response?.status === 200) {
        setItems(response?.data?.items || []);
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

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
        if (response?.data?.stores){
          setSelectedOption({
            name: response?.data?.stores[0]?.name,
            id: response?.data?.stores[0]?.id,
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
    const res: any = await sendApiRequest({
      token: token
    }, `auth/verifyToken`);
    res?.status === 200 
      ? setIsVerifiedUser(true) 
      : router.replace('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      verifyToken(token);
    }    
  }, []);

  useEffect(() => {
    if (isVerifiedUser) {
      const currentYear = new Date().getFullYear();
      setStartDate(new Date(`${currentYear}-01-01`));
      setEndDate(new Date(`${currentYear}-12-31`));
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
    router.push("/invoices?fromItemsAnalysis=true"); 
  };

  const totalPayments = tender?.reduce((sum:any, row:any) => sum + (row.payments || 0), 0);
  const totalCommission = tender?.reduce((sum:any, row:any) => sum + ((row.payments || 0) * (row.commission || 0)) / 100, 0);
  const totalFinalAmount = totalPayments + totalCommission;

  const totalQty = items?.reduce((acc:any, row:any) => acc + Number(row.totalqty), 0);
const totalExtPrice = items?.reduce((acc:any, row:any) => acc + Number(row.totalextprice), 0);

// Ensure there's no error when `items` is empty
const hasItems = items && items.length > 0;

  return (
    isVerifiedUser && <main
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
                startDate = {startDate}
                endDate = {endDate}
                setStartDate = {setStartDate}
                setEndDate = {setEndDate}
                fetchData = {fetchData}
                fetchDataForTender={fetchDataForTender}
                fetchDataForItems={fetchDataForItems}
                />
            </div>
          </div>
          <div className="below-md:hidden tablet:hidden">
            <button className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg w-[170px] h-[35px] rounded-md text-white text-[13px] font-medium">
              <img
                src="/images/saleskpireport.svg"
                alt="Upload Icon"
                className="mr-1"
              />
              PI Report
            </button>
          </div>
        </div>

        {/* grid 1 */}
        <div className="grid grid-cols-4 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3  pl-6 pr-6 items-stretch tablet:flex-wrap tablet:gap-3">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">Sales</p>
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.net_sales ? `$${Math.round(data?.net_sales)?.toLocaleString()}` : '$00,000'}</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-normal">
                  increase in sales
                </span>
              </p> */}
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpisales.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div className="w-[75%]">
              <p className="text-[14px] text-[#575F6DCC] font-medium">Profit</p>
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.net_sales ?
                `$${Math.round(data?.net_sales - data?.producttotal - data?.labour_cost - operatExpAmt - royaltyAmt)?.toLocaleString()}`  // Calculate 9% and format it to 2 decimal places
                  : '$00,000'
                }</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold ">
                65%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total revenue
                </span>
              </p> */}
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpiprofit.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div className="w-[75%]">
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Customer Count
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.customer_count ? `${Math.round(data?.customer_count)?.toLocaleString()}` : '00,000'}</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                40%{" "}
                <span className="text-[#575F6D] font-normal">
                  growth in Customers
                </span>
              </p> */}
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpicustomercount.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Labour Cost
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.labour_cost ? `$${Math.round(data?.labour_cost)?.toLocaleString()}` : '$00,000'}</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                16%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p> */}
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/labour.svg" />
            </div>
          </div>

          {/* grid 2 */}
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Sales Tax
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.tax_amt ? `$${Math.round(data?.tax_amt)?.toLocaleString()}` : '$00,000'}</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                8.6%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p> */}
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpisalestax.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Royalty
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">
                {royaltyAmt 
                  ? `$${Math.round(royaltyAmt)?.toLocaleString()}`  // Calculate 9% and format it to 2 decimal places
                  : '$00,000'
                }
              </p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                9.0%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p> */}
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpiroyalty.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Operating Expenses
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">{operatExpAmt?
                `$${Math.round(operatExpAmt)?.toLocaleString()} `  // Calculate 9% and format it to 2 decimal places
                  : '$000,000'
                }</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                0%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p> */}
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpioperatingexpenses.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">COGS</p>
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.producttotal ? `$${Math.round(data?.producttotal)?.toLocaleString()}` : '$00,000'}</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                9.8%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p> */}
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpicogs.svg" />
            </div>
          </div>
        </div>

        <div className="flex flex-col below-md:flex-col tablet:flex-col justify-between rounded-lg below-md:mb-6 bg-white mt-6 below-md:mt-3 below-md:mx-3 shadow-md ml-6 mr-6">
          <div className="w-full text-left font-bold mx-4 mt-6 text-[16px] text-[#334155]">
            Expense Distribution
          </div>
          <div className="flex flex-row items-center justify-between below-md:flex-col tablet:flex-col mx-3">
            <div className="-my-12">
              <DonutChart values={data} operatExpAmt={operatExpAmt} />
            </div>
            <div className="overflow-x-auto w-[50%] custom-scrollbar">
              <table className="items-center bg-transparent w-full below-md:mb-12 tablet:mb-12">
                <thead>
                  <tr>
                    <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-left border border-solid border-blueGray-300 py-1 text-sm  border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium ">
                      Label
                    </th>
                    <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-right border border-solid border-blueGray-300 py-1 text-sm border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium ">
                      Amount
                    </th>
                    <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-center border border-solid border-blueGray-300 py-1 text-sm border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td className="border-t-0 px-6 below-md:px-2 text-left border-l-0 border-r-0 text-xs whitespace-nowrap p-2 flex items-center text-[#404040] text-[13px]">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: row.color }}
                        ></div>
                        {row.label}
                      </td>
                      <td className="text-[14px] font-medium border-t-0 px-6 below-md:px-2 text-right border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        $ {row.amount}
                      </td>
                      <td className="text-[14px] font-medium border-t-0 px-6 below-md:px-2 text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                        {row.per}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-6 py-6">
        <div className=" bg-white  border-t-4 border-[#BCC7D5]  rounded-md shadow-md below-md:shadow-none w-[49%] items-stretch">
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
            <div className="overflow-hidden  overflow-x-auto overflow-y-auto max-h-[42vh] below-md:max-h-[27vh] custom-scrollbar ">
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
                      Amount
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
                        {row.tendername ? row.tendername : "--"}
                      </td>
                      <td className="px-4 py-1.5 text-[14px] border-b text-right border-gray-200 text-[#334155] font-medium">
                        { row.payments ? "$" + row.payments?.toLocaleString() : "--"}
                      </td>
                      <td className="px-4 py-1.5 border-b border-gray-200 text-gray-600 text-[14px] font-medium text-right">
                        {row.commission ? row.commission + "%" : "--" }
                      </td>
                      <td className="px-4 py-1.5 border-b text-right border-gray-200 text-[#3F526D] text-[14px] font-medium">
                              {row.payments && row.commission !== undefined
                                   ? `$${(row.payments + (row.payments * row.commission) / 100).toFixed(2)}`
                                   : "--"}
                      </td>
                    </tr>
                  )))}
                </tbody>
                { tender?.length === 0 ? "" : 
                <tfoot className="bg-white">
                  <tr className="font-medium text-[#E31212] text-[14px]">
                    <td className="px-4 py-1.5 border-t border-gray-200">
                      Total
                    </td>
                    <td className="px-4 py-1.5 border-t text-right border-gray-200">
                        {totalPayments ?  "$" + totalPayments  : "--"}
                    </td>
                    <td className="px-4 py-1.5 border-t text-right border-gray-200"> 
                       {totalCommission ? "$" + totalCommission :"--"}
                       </td>
                    <td className="px-4 py-1.5 border-t text-right border-gray-200">
                    {totalFinalAmount ? "$" + totalFinalAmount  :"--"}
                    </td>
                  </tr>
                </tfoot> }
              </table>
            </div>
          </div>
          <div className=" bg-white  border-t-4 border-[#BCC7D5]  rounded-md shadow-md below-md:shadow-none w-[49%] items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6 pb-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/items.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">Items</p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/underdetails.svg" onClick={handleClickForInvoice} />
              </div>
            </div>

            <div className="overflow-hidden  overflow-x-auto overflow-y-auto max-h-[42vh] below-md:max-h-[27vh] custom-scrollbar ">
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
                        {row.itemname}
                      </td>
                      <td className="px-4 py-1.5  border-b text-right font-medium border-gray-200 text-[#334155] text-[14px] ">
                        {row.totalqty}
                      </td>
                      <td className="px-4 py-1.5 border-b text-right border-gray-200 text-[14px] font-medium text-[#334155]">
                        ${row.totalextprice}
                      </td>
                    </tr>
                  )))}
                </tbody>
                {hasItems && (
      <tfoot className="-bottom-1 bg-white sticky">
        <tr className="text-[#E31212] text-[14px]">
          <td className="px-4 py-1.5 border-t text-left border-gray-200 font-medium">
            Total
          </td>
          <td className="px-4 py-1.5 border-t text-right border-gray-200 text-[14px] font-medium">
            {totalQty}
          </td>
          <td className="px-4 py-1.5 border-t text-right border-gray-200 text-[14px] font-medium">
            ${totalExtPrice.toFixed(2)}
          </td>
        </tr>
      </tfoot>
    )}
              </table>
            </div>
          </div>
        </div>
      </div>
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
  );
};

export default SalesKPI;

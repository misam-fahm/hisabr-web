"use client";
import { FC, useEffect, useState } from "react";
import DonutChart from "@/Components/Charts-Graph/DonutChart";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import { format } from 'date-fns';

const SalesKPI: FC = () => {
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [data, setData] = useState<any>([]);
  const [isFirstCall, setIsFirstCall] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const tableData = [
    { label: "Profit", amount: "10,000", per: "65%", color: "#53755599" },
    { label: "Labour Cost", amount: "2,000", per: "20%", color: "#DAB777" },
    { label: "Sales Tax", amount: "50,000", per: "75%", color: "#653C597A" },
    { label: "Royalty", amount: "20,000", per: "25%", color: "#79AFC7" },
    {
      label: "Operating Expenses",
      amount: "50,000",
      per: "75%",
      color: "#29507B",
    },
    { label: "COGS", amount: "30,000", per: "45%", color: "#AC8892" },
  ];

  useEffect(() => {
    if (startDate && endDate && isFirstCall) {
      fetchData();
      setIsFirstCall(false);
    }
  }, [startDate, endDate]);

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
  };

  const fetchData = async () => {
    try {
      if (startDate && endDate) {
        const response: any = await sendApiRequest({
          mode: "getsaleskpi",
          storename: selectedOption?.name || "13246",
          startdate: startDate && format(startDate, 'yyyy-MM-dd'),
          enddate: endDate && format(endDate, 'yyyy-MM-dd'),
        });

        if (response?.status === 200) {
          setData(response?.data?.saleskpi[0] || []);
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

  const fetchDropdownData = async () => {
    try {
      const response = await sendApiRequest({ mode: "getallstores" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setStartDate(new Date(`${currentYear}-01-01`));
    setEndDate(new Date(`${currentYear}-12-31`));
    fetchDropdownData();
  }, []);

  const handlePressStart = () => {
    setShowTooltip(true);

    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  return (
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
                startDate = {startDate}
                endDate = {endDate}
                setStartDate = {setStartDate}
                setEndDate = {setEndDate}
                fetchData = {fetchData}/>
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
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.net_sales ? `$${data?.net_sales.toLocaleString()}` : '$00,000'}</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-normal">
                  increase in sales
                </span>
              </p>
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpisales.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div className="w-[75%]">
              <p className="text-[14px] text-[#575F6DCC] font-medium">Profit</p>
              <p className="text-[16px] text-[#2D3748] font-bold">$</p>
              <p className="text-[11px] text-[#388E3C] font-semibold ">
                65%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total revenue
                </span>
              </p>
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
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.customer_count ? `${data?.customer_count}` : '00,000'}</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                40%{" "}
                <span className="text-[#575F6D] font-normal">
                  growth in Customers
                </span>
              </p>
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
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.labour_cost ? `$${data?.labour_cost.toLocaleString()}` : '$00,000'}</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                16%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p>
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
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.tax_amt ? `$${data?.tax_amt.toLocaleString()}` : '$00,000'}</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                8.6%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p>
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
                {data?.net_sales 
                  ? `$${(data.net_sales * 0.09).toFixed(2).toLocaleString()}`  // Calculate 9% and format it to 2 decimal places
                  : '$00,000'
                }
              </p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                9.0%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p>
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
              <p className="text-[16px] text-[#2D3748] font-bold">$</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                0%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p>
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/saleskpioperatingexpenses.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">COGS</p>
              <p className="text-[16px] text-[#2D3748] font-bold">{data?.producttotal ? `$${data?.producttotal.toLocaleString()}` : '$00,000'}</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                9.8%{" "}
                <span className="text-[#575F6D] font-normal">
                  of total expenses
                </span>
              </p>
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
          <div className="flex flex-row items-center below-md:flex-col tablet:flex-col mx-3">
            <div className="-my-12">
              <DonutChart />
            </div>
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="items-center bg-transparent w-full below-md:mb-12 tablet:mb-12">
                <thead>
                  <tr>
                    <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-left border border-solid border-blueGray-300 py-1 text-sm  border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium ">
                      Label
                    </th>
                    <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-center border border-solid border-blueGray-300 py-1 text-sm border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium ">
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
                      <td className="text-[14px] font-medium border-t-0 px-6 below-md:px-2 text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
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

"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExpensesPageData {
  storeid: string;
  startdate: string;
  enddate: string;
  months: number;
}

interface TableRow {
  label: string;
  value: number;
}

interface Option {
  name: string;
  value: string;
  id: number;
}

const PLReport: FC = () => {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPeriodOpen, setIsPeriodOpen] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Monthly");
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [isSubPeriodOpen, setIsSubPeriodOpen] = useState<boolean>(false);
  const [selectedSubPeriod, setSelectedSubPeriod] = useState<string>(
    new Date().toLocaleString('en-US', { month: 'long' })
  );
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalCogsAmount, setTotalCogsAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [netIncome, setNetIncome] = useState<number>(0);
  const [selectedStore, setSelectedStore] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState<boolean>(false);
  const [stores, setStores] = useState<any[]>([]);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [netSales, setNetSales] = useState<number>(0);
  const [pageData, setPageData] = useState<ExpensesPageData | null>(null);
  const [months, setMonths] = useState<number>(1);

  const formatAmount = (value: number) => {
    return value
      ? `$${value.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : "$0";
  };

  const calculatePercentage = (value: number, relativeTo: number): string => {
    if (!relativeTo || relativeTo === 0 || isNaN(value) || isNaN(relativeTo)) {
      return "0%";
    }
    const percentage = (value / relativeTo) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "label",
      header: () => <div className="text-left">Operating Expenses</div>,
      cell: (info) => <span>{String(info.getValue() || "N/A")}</span>,
      size: 200,
    },
    {
      accessorKey: "value",
      header: () => <div className="text-right pr-3">Amount</div>,
      cell: (info) => (
        <span className="text-right block pr-3">
          {formatAmount(Number(info.getValue()))}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "percentage",
      header: () => <div className="text-right pr-3">%</div>,
      cell: (info) => (
        <span className="text-right block pr-3">
          {calculatePercentage(info.row.original.value, totalAmount)}
        </span>
      ),
      size: 100,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 1000,
        pageIndex: 0,
      },
    },
  });

  const periodOptions: Option[] = [
    { name: "Monthly", value: "Monthly", id: 1 },
    { name: "Quarterly", value: "Quarterly", id: 2 },
    { name: "Half-Yearly", value: "Half-Yearly", id: 3 },
    { name: "Yearly", value: "Yearly", id: 4 },
  ];

  const yearOptions: Option[] = [
    { name: "2023", value: "2023", id: 1 },
    { name: "2024", value: "2024", id: 2 },
    { name: "2025", value: "2025", id: 3 },
    { name: "2026", value: "2026", id: 4 },
    { name: "2027", value: "2027", id: 5 },
  ];

  const monthOptions: Option[] = [
    { name: "January", value: "01", id: 1 },
    { name: "February", value: "02", id: 2 },
    { name: "March", value: "03", id: 3 },
    { name: "April", value: "04", id: 4 },
    { name: "May", value: "05", id: 5 },
    { name: "June", value: "06", id: 6 },
    { name: "July", value: "07", id: 7 },
    { name: "August", value: "08", id: 8 },
    { name: "September", value: "09", id: 9 },
    { name: "October", value: "10", id: 10 },
    { name: "November", value: "11", id: 11 },
    { name: "December", value: "12", id: 12 },
  ];

  const quarterOptions: Option[] = [
    { name: "Q1 (Jan-Mar)", value: "Q1", id: 1 },
    { name: "Q2 (Apr-Jun)", value: "Q2", id: 2 },
    { name: "Q3 (Jul-Sep)", value: "Q3", id: 3 },
    { name: "Q4 (Oct-Dec)", value: "Q4", id: 4 },
  ];

  const halfYearOptions: Option[] = [
    { name: "1st Half (Jan–Jun)", value: "H1", id: 1 },
    { name: "2nd Half (Jul–Dec)", value: "H2", id: 2 },
  ];

  const togglePeriodDropdown = () => {
    setIsPeriodOpen((prev) => !prev);
    setIsYearOpen(false);
    setIsSubPeriodOpen(false);
    setIsStoreDropdownOpen(false);
  };

  const handlePeriodSelect = (option: Option) => {
    setSelectedPeriod(option.name);
    setSelectedSubPeriod(
      option.name === "Monthly"
        ? new Date().toLocaleString('en-US', { month: 'long' })
        : option.name === "Quarterly"
        ? "Q1 (Jan-Mar)"
        : option.name === "Half-Yearly"
        ? "1st Half (Jan–Jun)"
        : ""
    );
    setIsPeriodOpen(false);
    setMonths(option.name === "Yearly" ? 12 : option.name === "Half-Yearly" ? 6 : option.name === "Quarterly" ? 3 : 1);
  };

  const toggleYearDropdown = () => {
    setIsYearOpen((prev) => !prev);
    setIsSubPeriodOpen(false);
    setIsStoreDropdownOpen(false);
  };

  const handleYearSelect = (option: Option) => {
    setSelectedYear(option.name);
    setIsYearOpen(false);
  };

  const toggleSubPeriodDropdown = () => {
    setIsSubPeriodOpen((prev) => !prev);
    setIsYearOpen(false);
    setIsStoreDropdownOpen(false);
  };

  const handleSubPeriodSelect = (option: Option) => {
    setSelectedSubPeriod(option.name);
    setIsSubPeriodOpen(false);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("expensesPageData");
    if (storedData) {
      try {
        const parsedData: ExpensesPageData = JSON.parse(storedData);
        if (
          parsedData.storeid &&
          parsedData.startdate &&
          parsedData.enddate &&
          parsedData.months
        ) {
          setPageData(parsedData);
          setMonths(parsedData.months);
        } else {
          setCustomToast({
            message: "Incomplete data in storage",
            type: "error",
          });
        }
      } catch (err) {
        setCustomToast({
          message: "Error parsing stored data",
          type: "error",
        });
      }
    } else {
      setCustomToast({
        message: "Missing required parameters",
        type: "error",
      });
    }
  }, []);

  const getDateRange = () => {
    let startdate = `${selectedYear}-01-01`;
    let enddate = `${selectedYear}-12-31`;
    let monthsCount = 12;

    if (selectedPeriod === "Monthly" && selectedSubPeriod) {
      const month = monthOptions.find((opt) => opt.name === selectedSubPeriod)?.value;
      if (month) {
        const monthNum = parseInt(month, 10);
        startdate = `${selectedYear}-${month}-01`;
        enddate = `${selectedYear}-${month}-${new Date(parseInt(selectedYear), monthNum, 0).getDate()}`;
        monthsCount = 1;
      } else {
        startdate = `${selectedYear}-01-01`;
        enddate = `${selectedYear}-01-31`;
        monthsCount = 1;
      }
    } else if (selectedPeriod === "Quarterly" && selectedSubPeriod) {
      switch (selectedSubPeriod) {
        case "Q1 (Jan-Mar)":
          startdate = `${selectedYear}-01-01`;
          enddate = `${selectedYear}-03-31`;
          monthsCount = 3;
          break;
        case "Q2 (Apr-Jun)":
          startdate = `${selectedYear}-04-01`;
          enddate = `${selectedYear}-06-30`;
          monthsCount = 3;
          break;
        case "Q3 (Jul-Sep)":
          startdate = `${selectedYear}-07-01`;
          enddate = `${selectedYear}-09-30`;
          monthsCount = 3;
          break;
        case "Q4 (Oct-Dec)":
          startdate = `${selectedYear}-10-01`;
          enddate = `${selectedYear}-12-31`;
          monthsCount = 3;
          break;
      }
    } else if (selectedPeriod === "Half-Yearly" && selectedSubPeriod) {
      if (selectedSubPeriod === "1st Half (Jan–Jun)") {
        startdate = `${selectedYear}-01-01`;
        enddate = `${selectedYear}-06-30`;
        monthsCount = 6;
      } else if (selectedSubPeriod === "2nd Half (Jul–Dec)") {
        startdate = `${selectedYear}-07-01`;
        enddate = `${selectedYear}-12-31`;
        monthsCount = 6;
      }
    }

    return { startdate, enddate, monthsCount };
  };

  const fetchData = async () => {
    if (!pageData && !selectedStore) {
      setCustomToast({
        message: "Please select a store",
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const { startdate, enddate, monthsCount } = getDateRange();
      setMonths(monthsCount);

      const response: any = await sendApiRequest({
        mode: "getplreport",
        storeid: selectedStore?.id || pageData?.storeid || 69,
        startdate,
        enddate,
        search: globalFilter,
      });

      if (response?.status === 200) {
        const saleskpi = response?.data?.expenses[0];
        const config = saleskpi?.config || {};
        const additionalExpenses = saleskpi?.additional_expense || [];
        const cogs = saleskpi?.cogs || [];

        const payrollTaxAmt =
          saleskpi?.labour_cost && config?.payroll_tax
            ? saleskpi.labour_cost * (config.payroll_tax / 100)
            : 0;

        const royaltyAmount = saleskpi?.royalty || 0;
        const royaltyPercentage = config?.royalty || 0;
        const laborCostAmount = saleskpi?.labour_cost || 0;

        const allExpenses: TableRow[] = [
          { label: "Payroll Tax", value: payrollTaxAmt },
          { label: "PAR", value: (config.par || 0) * monthsCount },
          { label: "NuCO2", value: (config.nuco2 || 0) * monthsCount },
          { label: "Trash", value: (config.trash || 0) * monthsCount },
          { label: "Repairs", value: (config.repair_exp || 0) * monthsCount },
          { label: "Gas Bill", value: (config.gas_bill_exp || 0) * monthsCount },
          { label: "Internet", value: (config.internet_exp || 0) * monthsCount },
          {
            label: "Insurance",
            value: ((config.insurance_exp || 0) / 12) * monthsCount,
          },
          { label: "Water Bill", value: (config.water_bill_exp || 0) * monthsCount },
          {
            label: "Property Tax",
            value: ((config.property_tax_exp || 0) / 12) * monthsCount,
          },
          {
            label: "Rent/Mortgage",
            value: (config.rent_mortgage_exp || 0) * monthsCount,
          },
          {
            label: "Labor Operator Salary",
            value: (config.labor_operat_salary_exp || 0) * monthsCount,
          },
          ...(royaltyAmount > 0.50
            ? [
                {
                  label: `Royalty (${royaltyPercentage}%)`,
                  value: royaltyAmount,
                },
              ]
            : []),
          ...(laborCostAmount > 0.50
            ? [
                {
                  label: `Labor Cost`,
                  value: laborCostAmount,
                },
              ]
            : []),
          ...additionalExpenses.map((exp: any) => ({
            label: exp?.expname || "Unknown Expense",
            value: Number(exp?.amount) || 0,
          })),
        ].filter((item) => item.value > 0);

        const sortedExpenses = allExpenses.sort((a, b) => b.value - a.value);

        const total = sortedExpenses.reduce(
          (sum: number, expense: TableRow) => sum + expense.value,
          0
        );

        const totalCogs = cogs.reduce(
          (sum: number, item: any) => sum + (Number(item.producttotal) || 0),
          0
        );

        const calculatedNetIncome = (saleskpi.net_sales || 0) - totalCogs - total;

        setData(sortedExpenses);
        setNetSales(saleskpi.net_sales || 0);
        setTotalItems(sortedExpenses.length);
        setTotalAmount(total);
        setTotalCogsAmount(totalCogs);
        setNetIncome(calculatedNetIncome);
      } else {
        setCustomToast({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomToast({
        message: "Error fetching expenses data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVerifiedUser && selectedStore && selectedYear && (selectedPeriod === "Yearly" || selectedSubPeriod)) {
      fetchData();
    }
  }, [isVerifiedUser, selectedStore]);

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const formattedStores = response?.data?.stores.map((store: any) => ({
          name: `${store.name} - ${store.location || "Unknown Location"}`,
          id: store.id,
        }));
        setStores(formattedStores);
        if (formattedStores.length > 0) {
          setSelectedStore(formattedStores[0]);
        }
      } else {
        setCustomToast({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const res: any = await sendApiRequest({ token }, `auth/verifyToken`);
      res?.status === 200 ? setIsVerifiedUser(true) : router.replace("/login");
    } catch (error) {
      router.replace("/login");
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
      getUserStore();
    }
  }, [isVerifiedUser]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
    setIsYearOpen(false);
    setIsPeriodOpen(false);
    setIsSubPeriodOpen(false);
  };

  const clearSearch = async () => {
    setGlobalFilter("");
  };

  const storeLocation = selectedStore?.name
    ? selectedStore.name.split(" - ")[1] || "Unknown Location"
    : "Select a Store";

  const getPeriodDisplay = () => {
    if (selectedPeriod === "Yearly") {
      return selectedYear;
    } else if (selectedPeriod === "Monthly") {
      return `${selectedSubPeriod} ${selectedYear}`;
    } else if (selectedPeriod === "Quarterly") {
      return `${selectedSubPeriod} ${selectedYear}`;
    } else if (selectedPeriod === "Half-Yearly") {
      return `${selectedSubPeriod} ${selectedYear}`;
    }
    return "Select Period";
  };

  const handleSearch = () => {
    if (!selectedStore || !selectedYear || (selectedPeriod !== "Yearly" && !selectedSubPeriod)) {
      setCustomToast({
        message: "Please complete all required selections",
        type: "error",
      });
      return;
    }
    fetchData();
  };

  const downloadPDF = () => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setProperties({
    title: `Income Statement ${storeLocation} ${getPeriodDisplay()}`,
    author: storeLocation,
    creator: 'Financial Reporting System',
  });

  doc.setFont('helvetica', 'normal');

  const addHeader = (page: number) => {
    doc.setFontSize(18); // Title bigger
    doc.setFont('helvetica', 'bold');
    doc.text('Income Statement', 105, 15, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(storeLocation, 105, 21, { align: 'center' });
    doc.text(`For the Period: ${getPeriodDisplay()}`, 105, 27, { align: 'center' });
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(10, 30, 200, 30);
  };

  const addFooter = (page: number) => {
    const pageCount = (doc as any).getNumberOfPages();
    doc.setPage(page);
    doc.setFontSize(8);
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    doc.text(`Prepared by: ${storeLocation}`, 10, 287);
    doc.text(`Generated on: ${today}`, 105, 287, { align: 'center' });
    doc.text(`Page ${page} of ${pageCount}`, 200, 287, { align: 'right' });
  };

  const sectionHeaderStyles = {
    fontSize: 16,  // font size 16 for all titles
    fontStyle: 'bold' as const,
    textColor: [0, 0, 0] as [number, number, number],
    cellPadding: 2,
    halign: 'left' as const,
    fillColor: [255, 255, 255] as [number, number, number],
  };

  const baseTableStyles = {
    theme: 'grid' as const,
    headStyles: {
      ...sectionHeaderStyles,
    },
    bodyStyles: {
      fontSize: 11,
      textColor: [0, 0, 0] as [number, number, number],
      cellPadding: 2,
      halign: 'left' as const,
      fillColor: [255, 255, 255] as [number, number, number],
    },
    columnStyles: {
      0: { cellWidth: 90, halign: 'left' as const },
      1: { cellWidth: 60, halign: 'right' as const },
      2: { cellWidth: 40, halign: 'right' as const },
    },
    didDrawCell: (data: any) => {
      if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 16;  // total rows font size 16
      }
    },
  };

  addHeader(1);
  let currentY = 38;

  // Income Section
  const incomeData = [['Sale of Goods', formatAmount(netSales), '100.0%']];
  const totalIncome = netSales;
  autoTable(doc, {
    startY: currentY,
    head: [['Income', '', '']],
    body: [...incomeData, ['Total Income', formatAmount(totalIncome), '100.0%']],
    ...baseTableStyles,
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Cost of Goods Sold Section
  const cogsData = [['Cost of Goods', formatAmount(totalCogsAmount), calculatePercentage(totalCogsAmount, totalIncome)]];
  const totalCogs = totalCogsAmount;
  autoTable(doc, {
    startY: currentY,
    head: [['Cost of Goods Sold', '', '']],
    body: [...cogsData, ['Total Cost of Goods Sold', formatAmount(totalCogs), calculatePercentage(totalCogs, totalIncome)]],
    ...baseTableStyles,
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Gross Profit Section (no header, just body)
  const grossProfit = totalIncome - totalCogs;
  autoTable(doc, {
    startY: currentY,
    body: [['Gross Profit', formatAmount(grossProfit), calculatePercentage(grossProfit, totalIncome)]],
    ...baseTableStyles,
    styles: {
      ...baseTableStyles.bodyStyles,
      fontStyle: 'bold',
      fontSize: 16,  // bigger font size for emphasis
    },
    showHead: 'never',
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Operating Expenses Section
  const expensesData = data.map((row) => [
    row.label,
    formatAmount(row.value),
    calculatePercentage(row.value, totalAmount),
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [['Operating Expenses', '', '']],
    body: [
      ...expensesData,
      [
        { content: 'Total Operating Expenses', styles: { fontStyle: 'bold', fontSize: 14 } },
        { content: formatAmount(totalAmount), styles: { fontStyle: 'bold', fontSize: 14, halign: 'right' } },
        { content: '100.0%', styles: { fontStyle: 'bold', fontSize: 14, halign: 'right' } },
      ],
    ],
    ...baseTableStyles,
    didDrawCell: (data: any) => {
      if (data.section === 'body' && data.row.index === data.table.body.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = 14; // enforce font size 16 for total row
      }
    },
  });
  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Net Income Section (no header, just body)
  autoTable(doc, {
    startY: currentY,
    body: [['Net Income', formatAmount(netIncome), calculatePercentage(netIncome, totalIncome)]],
    ...baseTableStyles,
    styles: {
      ...baseTableStyles.bodyStyles,
      fontStyle: 'bold',
      fontSize: 16,
    },
    showHead: 'never',
  });

  const pageCount = (doc as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    addFooter(i);
  }

  doc.save(`Income_Statement_${storeLocation}_${getPeriodDisplay().replace(/\s+/g, '_')}.pdf`);
};


return (
  <main
    className={`relative px-6 below-md:px-3 overflow-auto border-none h-full ${
      data.length > 10 ? "max-h-[calc(100vh-50px)]" : "min-h-[500px]"
    }`}
    style={{ scrollbarWidth: "thin" }}
  >
    {/* Sticky Filter Header */}
    <div className="sticky top-0 z-20 bg-[#f7f8f9] pb-4 pt-4 below-md:pt-3 below-md:pb-3 tablet:pt-3">
      <div className="flex flex-row items-center gap-3 w-full flex-wrap below-md:flex-col below-md:items-stretch tablet:flex-row tablet-home:flex-row">
        <Dropdown
          options={stores}
          selectedOption={selectedStore?.name || "Store"}
          onSelect={(option: any) => {
            setSelectedStore(option);
            setIsStoreDropdownOpen(false);
          }}
          isOpen={isStoreDropdownOpen}
          toggleOpen={toggleStoreDropdown}
          widthchange="flex-1 min-w-[140px]"
        />

        <Dropdown
          options={periodOptions}
          selectedOption={selectedPeriod}
          onSelect={handlePeriodSelect}
          isOpen={isPeriodOpen}
          toggleOpen={togglePeriodDropdown}
          widthchange="flex-1 min-w-[120px]"
        />

        <Dropdown
          options={yearOptions}
          selectedOption={selectedYear}
          onSelect={handleYearSelect}
          isOpen={isYearOpen}
          toggleOpen={toggleYearDropdown}
          widthchange="flex-1 min-w-[100px]"
        />

        {selectedPeriod !== "Yearly" && (
          <Dropdown
            options={
              selectedPeriod === "Monthly"
                ? monthOptions
                : selectedPeriod === "Quarterly"
                ? quarterOptions
                : halfYearOptions
            }
            selectedOption={selectedSubPeriod || "Select"}
            onSelect={handleSubPeriodSelect}
            isOpen={isSubPeriodOpen}
            toggleOpen={toggleSubPeriodDropdown}
            widthchange="flex-1 min-w-[120px]"
          />
        )}

        <button
          onClick={handleSearch}
          className="flex items-center justify-center bg-[#0F1044] hover:bg-[#0A0B2F] shadow-lg px-4 py-2 rounded-md text-white text-sm font-medium below-md:w-full"
          disabled={loading}
        >
          Search
        </button>

        {/* Download PDF for screens > 1350px */}
        <div className="hidden tablet-home:hidden xl:block ml-auto">
          <button
            onClick={downloadPDF}
            className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg px-6 py-2 rounded-md text-white text-sm font-medium"
            disabled={loading}
          >
            <img
              src="/images/webuploadicon.svg"
              alt="Download Icon"
              className="mr-1 rotate-180"
            />
            Download PDF
          </button>
        </div>
      </div>
    </div>

    {/* Floating PDF Download for smaller screens */}
    <div className="below-md:block tablet:block tablet-home:block xl:hidden hidden fixed bottom-6 right-6 z-30">
      <button
        onClick={downloadPDF}
        className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg w-[60px] h-[60px] rounded-lg text-white font-medium"
        disabled={loading}
      >
        <img
          src="/images/webuploadicon.svg"
          alt="Download Icon"
          className="w-6 h-6 rotate-180"
        />
      </button>
    </div>

    {/* KPI Cards */}
    <div className="flex flex-wrap gap-4 mt-4 md:grid-cols-2">
      {[
        { label: 'Net Sales', value: netSales },
        { label: 'Cost of Goods', value: totalCogsAmount },
        { label: 'Total Expenses', value: totalAmount },
        { label: 'Net Income', value: netIncome },
      ].map((item, index) => (
        <div
          key={index}
          className="flex-1 min-w-[220px] bg-white rounded-lg shadow-sm border-[#7b7b7b] border-b-4 p-4"
        >
          <div className="flex flex-col gap-2">
            <p className="text-[16px] text-[#575F6DCC] font-bold">{item.label}</p>
            <p className="text-[20px] text-[#2D3748] font-bold">
              {loading ? <Skeleton width={100} /> : formatAmount(item.value)}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Data Table */}
    <div className="shadow-sm border border-[#E4E4EF] rounded-md flex-grow flex flex-col mt-4">
      <div className="w-full overflow-x-auto rounded-md">
        <table className="min-w-full border-collapse text-[12px] below-md:text-[11px] tablet:text-[11px] table-auto">
          <thead className="bg-[#0F1044]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[14px] below-md:text-[12px] tablet:text-[13px]"
                    style={{
                      minWidth: `${header.column.getSize()}px`,
                      width: `${header.column.getSize()}px`,
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr
                  key={index}
                  className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-1.5"
                      style={{ minWidth: `${column.size}px` }}
                    >
                      <Skeleton height={30} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-1.5 text-[#636363] text-[13px] below-md:text-[11px] tablet:text-[12px]"
                        style={{ minWidth: `${cell.column.getSize()}px` }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {data.length > 0 && !loading && (
                  <tr className="bg-[#0F1044] text-white border-t border-[#E4E4EF]">
                    <td
                      className="px-4 py-1.5 text-[13px] font-bold below-md:text-[11px] tablet:text-[12px]"
                      style={{ minWidth: `${columns[0].size}px` }}
                    >
                      Total
                    </td>
                    <td
                      className="px-4 py-1.5 text-[13px] text-right pr-3 below-md:text-[11px] tablet:text-[12px]"
                      style={{ minWidth: `${columns[1].size}px` }}
                    >
                      {formatAmount(totalAmount)}
                    </td>
                    <td
                      className="px-4 py-1.5 text-[13px] text-right pr-3 below-md:text-[11px] tablet:text-[12px]"
                      style={{ minWidth: `${columns[2].size}px` }}
                    >
                      100%
                    </td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-[13px] below-md:text-[11px] tablet:text-[12px]"
                >
                  <NoDataFound />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </main>
);



};

export default PLReport;
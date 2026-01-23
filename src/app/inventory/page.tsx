
"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import Dropdown from "@/Components/UI/Themes/DropDown";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import Pagination from "@/Components/UI/Pagination/Pagination";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";
import { useGlobalContext } from "@/Components/Header/header";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// Interface for inventory file
interface InventoryFile {
    id: number;
    storeid: number;
    storename: string;
    weekstart: string;
    weekend: string;
    filetime: string;
    totalqty: number;
    totalamount: number;
    createdat: string;
}

// Interface for table row display (for upload preview)
interface TableRow {
    item_name: string;
    quantity: number;
    average_price: number;
    total: number;
    percent: number;
    inventory_product: string;
    inv_size: string;
    inv_measure: string;
}

// Interface for file upload
interface InventoryItem {
    item_name: string;
    quantity: number;
    total: number;
    percent: number;
    inventory_product: string;
    inv_size: string;
    inv_measure: string;
}

// Helper function to parse currency strings like "$74,201.88" or "($0.01)" to number
const parseCurrency = (value: string): number => {
    if (!value) return 0;
    const valueStr = value.toString().trim();
    const isNegative = valueStr.startsWith('(') && valueStr.endsWith(')');
    const cleaned = valueStr.replace(/[$,()]/g, '').trim();
    const num = parseFloat(cleaned);
    if (isNaN(num)) return 0;
    return isNegative ? -num : num;
};

// Helper function to parse percentage strings
const parsePercent = (value: string): number => {
    if (!value) return 0;
    const valueStr = value.toString().trim();
    const hasPercentSign = valueStr.includes('%');
    const cleaned = valueStr.replace(/%/g, '').replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    if (isNaN(num)) return 0;
    if (!hasPercentSign && num <= 1 && num > 0) {
        return num * 100;
    }
    return num;
};

// Helper function to parse quantity strings
const parseQuantity = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.toString().replace(/,/g, '').trim();
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
};

const Inventory: FC = () => {
    const router = useRouter();
    const containerRef = useRef(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
    const [inventoryFiles, setInventoryFiles] = useState<InventoryFile[]>([]);
    const [totalFiles, setTotalFiles] = useState<number>(0);
    const [filesLoading, setFilesLoading] = useState<boolean>(false);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
    const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedFileToDelete, setSelectedFileToDelete] = useState<InventoryFile | null>(null);
    const [activeFilter, setActiveFilter] = useState<'week' | 'date'>('week');
    const [customToast, setCustomToast] = useState<ToastNotificationProps>({
        message: "",
        type: "",
    });

    // Generate year options from 2023 to 2028
    const yearOptions = Array.from({ length: 6 }, (_, i) => ({
        id: 2023 + i,
        name: String(2023 + i),
    }));

    // Generate 52 weeks for selected year (Sunday to Saturday)
    const generateWeeksForYear = (year: number) => {
        const weeks: { id: number; name: string; start: Date; end: Date }[] = [];
        const firstDayOfYear = new Date(year, 0, 1);
        const dayOfWeek = firstDayOfYear.getDay();

        // Find the first Sunday of the year
        let firstSunday = new Date(year, 0, 1);
        if (dayOfWeek !== 0) {
            firstSunday = new Date(year, 0, 1 + (7 - dayOfWeek));
        }

        for (let i = 0; i < 52; i++) {
            const weekStart = new Date(firstSunday);
            weekStart.setDate(firstSunday.getDate() + (i * 7));

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            // Format as "week 01  MM/DD/YY - MM/DD/YY"
            const weekNum = String(i + 1).padStart(2, '0');
            const startFormatted = format(weekStart, 'MM/dd/yy');
            const endFormatted = format(weekEnd, 'MM/dd/yy');

            weeks.push({
                id: i + 1,
                name: `week ${weekNum}  ${startFormatted} - ${endFormatted}`,
                start: weekStart,
                end: weekEnd,
            });
        }

        return weeks;
    };

    // Get current week based on today's date
    const getCurrentWeek = (year: number) => {
        const weeks = generateWeeksForYear(year);
        const today = new Date();

        for (const week of weeks) {
            if (today >= week.start && today <= week.end) {
                return week;
            }
        }

        // If no match found, return first week
        return weeks[0];
    };

    // Year and Week selection for Excel upload
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedWeek, setSelectedWeek] = useState<{ id: number; name: string; start: Date; end: Date } | null>(null);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);

    const generatedWeeks = generateWeeksForYear(selectedYear);
    const weekOptions = [
        {
            id: 0,
            name: "Week 01 to Week 52",
            start: generatedWeeks[0].start,
            end: generatedWeeks[generatedWeeks.length - 1].end,
        },
        ...generatedWeeks
    ];

    // Valid store IDs from dropdown
    const validStoreIds = [
        "10624", // Eastman
        "10726", // Lithonia
        "10730", // Duluth
        "10862", // Greenwood
        "10878", // Clayton
        "13246", // Watkinsville
        "14749", // Toccoa, GA
        "43233", // Cordele, GA
        "43236", // Flat Shoals
        "43238", // Greensboro
        "44329", // Alpharetta
    ];

    // Use global context for store and date range
    const {
        storeOptions,
        selectedStore,
        setSelectedStore,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
    } = useGlobalContext();

    // Columns for inventory files
    const fileColumns: ColumnDef<InventoryFile>[] = [
        {
            id: "weeknumber",
            accessorKey: "weekstart",
            header: () => <div className="text-center">Week Number</div>,
            cell: (info) => {
                const row = info.row.original;
                const weekStart = new Date(row.weekstart);
                const weekStartYear = weekStart.getFullYear();

                // Calculate week number based on the week start date's year
                const weeks = generateWeeksForYear(weekStartYear);
                let weekNumber = 1;

                for (let i = 0; i < weeks.length; i++) {
                    if (weekStart >= weeks[i].start && weekStart <= weeks[i].end) {
                        weekNumber = weeks[i].id;
                        break;
                    }
                }

                return <span className="flex justify-center">Week {String(weekNumber).padStart(2, '0')}</span>;
            },
            size: 100,
        },
        {
            accessorKey: "weekstart",
            header: () => <div className="text-center">Week Start</div>,
            cell: (info) => (
                <span className="flex justify-center">{info.getValue() as string}</span>
            ),
            size: 100,
        },
        {
            accessorKey: "weekend",
            header: () => <div className="text-center">Week End</div>,
            cell: (info) => (
                <span className="flex justify-center">{info.getValue() as string}</span>
            ),
            size: 100,
        },
        {
            accessorKey: "totalqty",
            header: () => <div className="flex justify-end mr-3">Total Qty</div>,
            cell: (info) => (
                <span className="flex justify-end mr-3">
                    {Number(info.getValue()).toLocaleString()}
                </span>
            ),
            size: 100,
        },
        {
            accessorKey: "totalamount",
            header: () => <div className="flex justify-end mr-3">Total Amount ($)</div>,
            cell: (info) => (
                <span className="flex justify-end mr-3">
                    ${Number(info.getValue()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            ),
            size: 130,
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => handleViewItems(row.original)}
                        className="text-green-500 hover:text-green-700"
                        title="View Items"
                    >
                        <img
                            src="/images/vieweyeicon.svg"
                            alt="View"
                            className="w-4 h-4"
                        />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedFileToDelete(row.original);
                            setIsDeleteOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                    >
                        <img
                            src="/images/deletebinicon.svg"
                            alt="Delete"
                            className="w-4 h-4"
                        />
                    </button>
                </div>
            ),
            size: 80,
        },
    ];

    const fileTable = useReactTable({
        data: inventoryFiles || [],
        columns: fileColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
        },
    });

    // Fetch inventory files
    const fetchInventoryFiles = async (overrideFilter?: 'week' | 'date') => {
        if (!selectedStore?.id) return;

        // Determine which filter to use
        const filterToUse = overrideFilter || activeFilter;

        let startDateToUse: Date;
        let endDateToUse: Date;

        if (filterToUse === 'week') {
            if (selectedWeek) {
                // Specific week selected
                startDateToUse = selectedWeek.start;
                endDateToUse = selectedWeek.end;
            } else if (weekOptions.length > 0) {
                // No week selected - show full year (week 1 to week 52)
                startDateToUse = weekOptions[0].start;
                endDateToUse = weekOptions[weekOptions.length - 1].end;
            } else {
                return;
            }
        } else {
            // Date range selected
            if (startDate && endDate) {
                startDateToUse = startDate;
                endDateToUse = endDate;
            } else {
                return;
            }
        }

        setFilesLoading(true);
        try {
            const response: any = await sendApiRequest({
                mode: "getInventoryFiles",
                store_id: selectedStore.id,
                startdate: format(startDateToUse, "yyyy-MM-dd"),
                enddate: format(endDateToUse, "yyyy-MM-dd"),
                search: "",
                page: currentPage,
                limit: 10,
            });

            if (response?.status === 200 && response?.data?.inventoryfiles) {
                setInventoryFiles(response.data.inventoryfiles);
                setTotalFiles(response.data.total || 0);
            } else {
                setInventoryFiles([]);
                setTotalFiles(0);
            }
        } catch (error) {
            console.error("Error fetching inventory files:", error);
            setInventoryFiles([]);
            setTotalFiles(0);
        } finally {
            setFilesLoading(false);
        }
    };

    // Handle viewing items - navigate to detail page
    const handleViewItems = (file: InventoryFile) => {
        // URL-safe base64 encoding function
        const encodeUrlSafe = (str: string) => {
            return btoa(str)
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");
        };

        // Find full store name from options if available (to show "ID - Name")
        const storeOption = storeOptions?.find((opt: any) => opt.id == file.storeid);
        const fullStoreName = storeOption ? storeOption.name : (file.storename || "");

        const encodedId = encodeUrlSafe(file.id.toString());
        const encodedWs = encodeUrlSafe(file.weekstart || "");
        const encodedWe = encodeUrlSafe(file.weekend || "");
        const encodedStoreName = encodeUrlSafe(fullStoreName);

        router.push(`/inventory/${encodedId}?ws=${encodedWs}&we=${encodedWe}&sn=${encodedStoreName}`);
    };

    // Handle delete file (called from modal)
    const handleDeleteFile = async () => {
        if (!selectedFileToDelete) return;

        try {
            const response: any = await sendApiRequest({
                mode: "deleteInventory",
                storeweekfileid: selectedFileToDelete.id,
            });

            if (response?.status === 200) {
                setCustomToast({
                    message: "Inventory file deleted successfully",
                    type: "success",
                });
                // Refresh the file list
                fetchInventoryFiles();
            } else {
                setCustomToast({
                    message: response?.message || "Failed to delete inventory file",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            setCustomToast({
                message: "An error occurred while deleting the file",
                type: "error",
            });
        } finally {
            setIsDeleteOpen(false);
            setSelectedFileToDelete(null);
        }
    };

    // Handle file upload button click
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Parse XLS/XLSX file and extract inventory data
    const parseXLSFile = async (file: File) => {
        setUploadLoading(true);

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result;
                const workbook = XLSX.read(arrayBuffer, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: ""
                });

                // Extract store name from first row (e.g., "13246 - Watikinsville, GA - GC")
                let storeName = "";
                let storeId = "";
                if (jsonData[0] && jsonData[0][6]) {
                    const storeCell = String(jsonData[0][6]).trim();
                    storeName = storeCell;
                    // Extract store ID (number before first hyphen)
                    const match = storeCell.match(/^(\d+)/);
                    if (match) {
                        storeId = match[1];
                    }
                }

                // Validate store ID against valid store IDs
                if (!storeId) {
                    setCustomToast({
                        message: "Store ID not found in Excel file.",
                        type: "error",
                    });
                    setUploadLoading(false);
                    return;
                }

                if (!validStoreIds.includes(storeId)) {
                    setCustomToast({
                        message: `Invalid store ID: ${storeId}`,
                        type: "error",
                    });
                    setUploadLoading(false);
                    return;
                }

                // Validate that the Excel store matches the selected store from dropdown
                if (selectedStore?.name) {
                    const selectedStoreIdMatch = selectedStore.name.match(/^(\d+)/);
                    const selectedStoreId = selectedStoreIdMatch ? selectedStoreIdMatch[1] : null;

                    if (selectedStoreId && selectedStoreId !== storeId) {
                        setCustomToast({
                            message: `Store name does not match. Expected: ${selectedStoreId}, Found: ${storeId}`,
                            type: "error",
                        });
                        setUploadLoading(false);
                        return;
                    }
                }

                // Extract file time and date range from row 3 (index 2)
                let fileTime = "";
                let weekStart = "";
                let weekEnd = "";

                if (jsonData[2]) {
                    // File time is in column 1 (index 0): "1/13/2026 10:18:46 PM (UTC-05:00) Eastern Time (US & Canada)"
                    if (jsonData[2][0]) {
                        const fileTimeStr = String(jsonData[2][0]).trim();
                        // Parse the date part (before the time zone)
                        const dateMatch = fileTimeStr.match(/^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}:\d{2}\s+[AP]M)/);
                        if (dateMatch) {
                            const dateStr = dateMatch[1];
                            const timeStr = dateMatch[2];
                            const parsedDate = new Date(dateStr + ' ' + timeStr);
                            if (!isNaN(parsedDate.getTime())) {
                                fileTime = format(parsedDate, "yyyy-MM-dd HH:mm:ss");
                            }
                        }
                    }

                    // Date range is in column 7 (index 6): "5/1/2025 - 7/31/2025"
                    if (jsonData[2][6]) {
                        const dateRangeStr = String(jsonData[2][6]).trim();
                        const dateRangeParts = dateRangeStr.split('-').map(d => d.trim());
                        if (dateRangeParts.length === 2) {
                            const startDateParsed = new Date(dateRangeParts[0]);
                            const endDateParsed = new Date(dateRangeParts[1]);

                            if (!isNaN(startDateParsed.getTime())) {
                                weekStart = format(startDateParsed, "yyyy-MM-dd");
                            }
                            if (!isNaN(endDateParsed.getTime())) {
                                weekEnd = format(endDateParsed, "yyyy-MM-dd");
                            }
                        }
                    }
                }

                // If dates are not extracted from Excel, show error
                if (!weekStart || !weekEnd) {
                    setCustomToast({
                        message: "Could not extract date range from Excel file.",
                        type: "error",
                    });
                    setUploadLoading(false);
                    return;
                }

                let headerRowIndex = -1;
                let columnMap: { [key: string]: number } = {};

                for (let i = 0; i < Math.min(jsonData.length, 20); i++) {
                    const row = jsonData[i];
                    if (row && Array.isArray(row)) {
                        const rowStr = row.join(" ").toLowerCase();
                        if (rowStr.includes("item name") || rowStr.includes("quantity")) {
                            headerRowIndex = i;
                            row.forEach((cell: any, index: number) => {
                                const cellStr = String(cell).toLowerCase().trim();
                                if (cellStr.includes("item name")) columnMap["item_name"] = index;
                                if (cellStr === "quantity" || cellStr.includes("quantity")) columnMap["quantity"] = index;
                                if (cellStr.includes("average price")) columnMap["average_price"] = index;
                                if (cellStr === "total" || cellStr.includes("total")) columnMap["total"] = index;
                                if (cellStr === "percent" || cellStr.includes("percent")) columnMap["percent"] = index;
                                if (cellStr.includes("inventory product")) columnMap["inventory_product"] = index;
                                if (cellStr.includes("inv size") || cellStr === "inv size") columnMap["inv_size"] = index;
                                if (cellStr.includes("inv measure") || cellStr === "inv measure") columnMap["inv_measure"] = index;
                            });
                            break;
                        }
                    }
                }

                const parsedData: TableRow[] = [];
                const inventoryItems: InventoryItem[] = [];

                if (headerRowIndex !== -1) {
                    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
                        const row = jsonData[i];

                        if (!row || row.length === 0) continue;

                        const itemName = row[columnMap["item_name"]] || row[0];

                        if (!itemName || String(itemName).trim() === "") continue;

                        // Skip summary rows (Total, Summary, Grand Total, etc.)
                        const itemNameLower = String(itemName).toLowerCase().trim();
                        if (itemNameLower === "total" ||
                            itemNameLower === "summary" ||
                            itemNameLower === "grand total" ||
                            itemNameLower.includes("subtotal")) {
                            continue;
                        }

                        let totalValue = 0;
                        let quantityValue = 0;
                        let avgPriceValue = 0;
                        let percentValue = 0;
                        let invProduct = "";
                        let invSize = "";
                        let invMeasure = "";

                        if (columnMap["quantity"] !== undefined) {
                            quantityValue = parseQuantity(String(row[columnMap["quantity"]]));
                        } else if (row[2]) {
                            quantityValue = parseQuantity(String(row[2]));
                        }

                        if (columnMap["average_price"] !== undefined) {
                            avgPriceValue = parseCurrency(String(row[columnMap["average_price"]]));
                        } else if (row[4]) {
                            avgPriceValue = parseCurrency(String(row[4]));
                        }

                        if (columnMap["total"] !== undefined) {
                            totalValue = parseCurrency(String(row[columnMap["total"]]));
                        } else if (row[8]) {
                            totalValue = parseCurrency(String(row[8]));
                        }

                        if (columnMap["percent"] !== undefined) {
                            percentValue = parsePercent(String(row[columnMap["percent"]]));
                        } else if (row[11]) {
                            percentValue = parsePercent(String(row[11]));
                        }

                        if (columnMap["inventory_product"] !== undefined) {
                            invProduct = String(row[columnMap["inventory_product"]] || "").trim();
                        } else if (row[13]) {
                            invProduct = String(row[13] || "").trim();
                        }

                        if (columnMap["inv_size"] !== undefined) {
                            invSize = String(row[columnMap["inv_size"]] || "").trim();
                        } else if (row[14]) {
                            invSize = String(row[14] || "").trim();
                        }

                        if (columnMap["inv_measure"] !== undefined) {
                            invMeasure = String(row[columnMap["inv_measure"]] || "").trim();
                        } else if (row[15]) {
                            invMeasure = String(row[15] || "").trim();
                        }

                        // Only include items where total is greater than 0
                        if (totalValue > 0) {
                            const tableRow: TableRow = {
                                item_name: String(itemName).trim(),
                                quantity: quantityValue,
                                average_price: avgPriceValue,
                                total: totalValue,
                                percent: percentValue,
                                inventory_product: invProduct,
                                inv_size: invSize,
                                inv_measure: invMeasure,
                            };

                            parsedData.push(tableRow);

                            inventoryItems.push({
                                item_name: tableRow.item_name,
                                quantity: tableRow.quantity,
                                total: tableRow.total,
                                percent: tableRow.percent,
                                inventory_product: tableRow.inventory_product,
                                inv_size: tableRow.inv_size,
                                inv_measure: tableRow.inv_measure,
                            });
                        }
                    }
                }

                if (parsedData.length > 0) {
                    // Calculate totals from the actual filtered/parsed data
                    const totalQty = parsedData.reduce((sum, item) => sum + item.quantity, 0);
                    const totalAmount = parsedData.reduce((sum, item) => sum + item.total, 0);

                    try {
                        const response: any = await sendApiRequest({
                            mode: "insertInventory",
                            store_id: selectedStore?.id || 69,
                            store_name: storeId || selectedStore?.name || "",
                            week_start: weekStart,
                            week_end: weekEnd,
                            file_time: fileTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
                            filename: file.name,
                            total_qty: totalQty,
                            total_amount: totalAmount,
                            items: inventoryItems,
                        });

                        if (response?.status === 200) {
                            setCustomToast({
                                message: `Successfully saved ${parsedData.length} items`,
                                type: "success",
                            });
                            fetchInventoryFiles();
                        } else if (response?.status === 400) {
                            setCustomToast({
                                message: "File already exists",
                                type: "error",
                            });
                        } else {
                            setCustomToast({
                                message: response?.message || "Failed to save inventory data",
                                type: "error",
                            });
                        }
                    } catch (apiError) {
                        console.error("Error saving to API:", apiError);
                        setCustomToast({
                            message: "Error saving inventory data to database",
                            type: "error",
                        });
                    }
                } else {
                    setCustomToast({
                        message: "No valid data found in the file. Please check the file format.",
                        type: "error",
                    });
                }
            } catch (error) {
                console.error("Error parsing XLS file:", error);
                setCustomToast({
                    message: "Error parsing file. Please ensure it's a valid Excel file.",
                    type: "error",
                });
            } finally {
                setUploadLoading(false);
            }
        };

        reader.onerror = () => {
            setUploadLoading(false);
            setCustomToast({
                message: "Error reading file. Please try again.",
                type: "error",
            });
        };

        reader.readAsArrayBuffer(file);
    };

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validExtensions = ['.xls', '.xlsx', '.csv'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

            if (!validExtensions.includes(fileExtension)) {
                setCustomToast({
                    message: "Please upload a valid Excel file (.xls, .xlsx) or CSV file.",
                    type: "error",
                });
                return;
            }

            parseXLSFile(file);
        }
        event.target.value = "";
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

    // Fetch inventory files when store, year, week, or date changes
    useEffect(() => {
        if (selectedStore?.id) {
            setInventoryFiles([]); // Clear old data
            setTotalFiles(0);
            setCurrentPage(1); // Reset to first page when filters change
            fetchInventoryFiles();
        }
    }, [selectedStore?.id, selectedYear, selectedWeek]);

    // Fetch when page number changes
    useEffect(() => {
        if (selectedStore?.id && currentPage > 1) {
            fetchInventoryFiles();
        }
    }, [currentPage]);

    const toggleStoreDropdown = () => {
        setIsStoreDropdownOpen((prev) => !prev);
    };

    const checkScrollbarVisibility = () => {
        const container: any = containerRef.current;
        if (container) {
            const hasScrollbar = container.scrollHeight > container.clientHeight;
            setIsScrollbarVisible(hasScrollbar);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        checkScrollbarVisibility();
        const observer = new MutationObserver(() => {
            checkScrollbarVisibility();
        });
        observer?.observe(container, {
            childList: true,
            subtree: true,
        });

        window?.addEventListener("resize", checkScrollbarVisibility);

        return () => {
            observer.disconnect();
            window?.removeEventListener("resize", checkScrollbarVisibility);
        };
    }, [fileTable]);

    return (
        <main
            className={`relative px-6 below-md:px-3 overflow-auto border-none ${inventoryFiles?.length > 10 ? "max-h-[calc(100vh-50px)]" : "h-[calc(100vh-60px)]"
                }`}
            style={{ scrollbarWidth: "thin" }}
        >
            <ToastNotification message={customToast.message} type={customToast.type} />
            <>
                <div className="sticky z-20 bg-[#f7f8f9] pb-6 pt-4 below-md:pt-4 below-md:pb-4 tablet:pt-4">
                    <div className="flex flex-row flex-nowrap gap-3 w-full below-md:flex-col">
                        {/* Filter Controls - Store, Year, Week, DatePicker */}
                        <div className="flex flex-row gap-3 w-full below-md:flex-col">
                            {/* Store Dropdown */}
                            <Dropdown
                                options={storeOptions}
                                selectedOption={selectedStore?.name || "Store"}
                                onSelect={(option: any) => {
                                    setSelectedStore(option);
                                    setIsStoreDropdownOpen(false);
                                }}
                                isOpen={isStoreDropdownOpen}
                                toggleOpen={toggleStoreDropdown}
                                widthchange="flex-1 min-w-[180px] below-lg:min-w-[153.648px] w-full"
                            />

                            {/* Year Dropdown */}
                            <Dropdown
                                options={yearOptions}
                                selectedOption={String(selectedYear)}
                                onSelect={(option: any) => {
                                    setInventoryFiles([]); // Clear old data immediately
                                    setTotalFiles(0);
                                    setSelectedYear(option.id);
                                    setSelectedWeek(null);
                                    setActiveFilter('week');
                                    setIsYearDropdownOpen(false);
                                }}
                                isOpen={isYearDropdownOpen}
                                toggleOpen={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                                widthchange="flex-1 min-w-[100px] w-full"
                            />

                            {/* Week Dropdown */}
                            <Dropdown
                                options={weekOptions}
                                selectedOption={selectedWeek?.name || "Week 01 to Week 52"}
                                onSelect={(option: any) => {
                                    setSelectedWeek(option);
                                    setActiveFilter('week');
                                    setIsWeekDropdownOpen(false);
                                }}
                                isOpen={isWeekDropdownOpen}
                                toggleOpen={() => setIsWeekDropdownOpen(!isWeekDropdownOpen)}
                                widthchange="flex-1 min-w-[200px] w-full"
                            />


                        </div>

                        {/* Upload Button */}
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".xls,.xlsx,.csv"
                                className="hidden"
                            />
                            <button
                                onClick={handleUploadClick}
                                disabled={uploadLoading}
                                className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white min-w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] below-lg:h-[29.876px] rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload Excel
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Mobile View: Card section */}
                <div className="block md:hidden mb-5">
                    {filesLoading && (
                        <div className="flex items-center justify-center py-10">
                            <svg className="animate-spin h-8 w-8 text-[#168A6F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}

                    {/* Mobile view for files */}
                    {!filesLoading && inventoryFiles?.map((file, index) => (
                        <div
                            key={index}
                            className="flex flex-col w-full rounded-lg bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 px-3 py-4">
                                    <p className="text-[14px] font-bold">{file.storename}</p>
                                </div>
                            </div>
                            <div className="flex items-center px-4 -mt-4">
                                <div className="border-t border-gray-200 w-full"></div>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3">
                                <div className="flex flex-col text-[13px] space-y-3">
                                    <p className="text-[#636363]">Week Start</p>
                                    <p className="text-[#636363]">Week End</p>
                                    <p className="text-[#636363]">Total Qty</p>
                                    <p className="text-[#636363]">Total Amount</p>
                                </div>
                                <div className="flex flex-col text-[14px] text-right space-y-3">
                                    <p className="text-[#1A1A1A]">{file.weekstart}</p>
                                    <p className="text-[#000000]">{file.weekend}</p>
                                    <p className="text-[#1A1A1A]">{file.totalqty?.toLocaleString()}</p>
                                    <p className="text-[#1A1A1A]">${file.totalamount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <div className="px-4 pb-3">
                                <button
                                    onClick={() => handleViewItems(file)}
                                    className="w-full bg-[#168A6F] hover:bg-[#11735C] text-white text-[13px] px-3 py-2 rounded-md flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Items
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="hidden below-md:block">
                        <Pagination table={fileTable} totalItems={totalFiles} />
                    </div>
                </div>

                {/* Web View: Table */}
                <div className="overflow-x-auto shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md flex-grow flex flex-col below-md:hidden">
                    <div className="overflow-hidden max-w-full rounded-md">
                        <table className="w-full border-collapse text-white table-fixed rounded-md">
                            <thead className="bg-[#0F1044] top-0 z-10">
                                {fileTable.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[100px]"
                                                style={{
                                                    width: isScrollbarVisible
                                                        ? `${header.column.getSize() + 8}px`
                                                        : `${header.column.getSize()}px`,
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                        </table>
                        <div
                            ref={containerRef}
                            className="w-full overflow-y-auto scrollbar-thin flex-grow"
                            style={{ maxHeight: "calc(100vh - 350px)" }}
                        >
                            <table className="w-full border-collapse text-[12px] text-white table-fixed">
                                <tbody>
                                    {filesLoading ? (
                                        Array.from({ length: 10 }).map((_, index) => (
                                            <tr key={index} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                                                {fileColumns.map((column, colIndex) => (
                                                    <td key={colIndex} className="px-4 py-1.5" style={{ width: `${column.size}px` }}>
                                                        <Skeleton height={30} />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : inventoryFiles && inventoryFiles.length > 0 ? (
                                        fileTable.getRowModel().rows.map((row) => (
                                            <tr key={row.id} className={row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="px-4 py-1.5 text-[#636363] text-[14px]"
                                                        style={{ width: `${cell.column.getSize()}px` }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={fileColumns.length} className="py-6 text-center">
                                                <div className="flex flex-col items-center justify-center py-10">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className="text-[#636363] text-[16px] mb-2">No inventory files found</p>
                                                    <p className="text-[#9CA3AF] text-[14px] mb-4">
                                                        Upload an Excel file (.xls, .xlsx) or CSV to add inventory
                                                    </p>
                                                    <button
                                                        onClick={handleUploadClick}
                                                        className="bg-[#168A6F] hover:bg-[#11735C] text-white text-[13px] px-4 py-2 rounded-md flex items-center gap-2"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                        Upload Excel File
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {inventoryFiles && inventoryFiles.length > 0 && (
                    <div className="mt-4 below-md:hidden">
                        <Pagination table={fileTable} totalItems={totalFiles} />
                    </div>
                )}
            </>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteOpen}
                as="div"
                className="relative z-50"
                onClose={() => setIsDeleteOpen(false)}
            >
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-[420px] below-md:w-[335px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
                        <div>
                            <DialogTitle
                                as="h3"
                                className="flex justify-center text-[#5E6366] font-semibold text-[16px]"
                            >
                                Delete Inventory File
                            </DialogTitle>
                            <div className="flex flex-col mt-4 justify-center items-center text-[#5E6366] font-medium text-[15px]">
                                <p className="below-md:text-[12px] below-md:placeholder:font-normal">
                                    Are you sure you want to delete this inventory file?
                                </p>
                                <p className="below-md:text-[12px] below-md:font-normal">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex mt-7 justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteOpen(false)}
                                    className="mr-4 px-4 py-2 h-[35px] w-[165px] bg-[#E4E4E4] hover:bg-[#C9C9C9] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteFile}
                                    className="font-semibold text-[14px] bg-[#CD6D6D] w-[165px] px-6 h-[35px] text-[#FFFFFF] rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </main>
    );
};

export default Inventory;
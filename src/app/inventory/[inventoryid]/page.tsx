"use client";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { sendApiRequest } from "@/utils/apiUtils";
import { format } from "date-fns";
import ToastNotification, {
    ToastNotificationProps,
} from "@/Components/UI/ToastNotification/ToastNotification";
import Loading from "@/Components/UI/Themes/Loading";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import Pagination from "@/Components/UI/Pagination/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Interface for inventory item from API
interface InventoryItemData {
    id: number;
    storeweekfileid: number;
    storename: string;
    filename: string;
    itemname: string;
    quantity: number;
    total: number;
    percent: number;
    inventoryproduct: string;
    invsize: string;
    invmeasure: string;
    createdat: string;
}

// Interface for table row display
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

// Interface for file summary info passed through URL
interface FileSummary {
    storename: string;
    weekstart: string;
    weekend: string;
    totalamount: number;
    totalqty: number;
}

// Generate weeks for a given year (Sunday to Saturday)
const generateWeeksForYear = (year: number) => {
    const weeks: { id: number; start: Date; end: Date; }[] = [];
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();

    // Find the Sunday of the week containing Jan 1st (start of Week 1)
    const firstSunday = new Date(year, 0, 1 - dayOfWeek);

    for (let i = 0; i < 53; i++) {
        const weekStart = new Date(firstSunday);
        weekStart.setDate(firstSunday.getDate() + (i * 7));

        // If we've passed the end of the year and it's not the first few days of the next year, stop
        if (weekStart.getFullYear() > year && weekStart.getDate() > 6) break;

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        weeks.push({
            id: i + 1,
            start: weekStart,
            end: weekEnd,
        });
    }

    return weeks;
};

// Get week number from date
const getWeekNumber = (dateStr: string): number => {
    if (!dateStr) return 1;
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const weeks = generateWeeksForYear(year);

    for (let i = 0; i < weeks.length; i++) {
        if (date >= weeks[i].start && date <= weeks[i].end) {
            return weeks[i].id;
        }
    }
    return 1;
};

const InventoryDetailsContent = () => {
    const { inventoryid }: any = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const containerRef = useRef(null);

    // URL-safe base64 decoding function
    const decodeUrlSafe = (encoded: string): string => {
        if (!encoded) return "";
        try {
            let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
            const padding = 4 - (base64.length % 4);
            if (padding !== 4) {
                base64 += "=".repeat(padding);
            }
            return atob(base64);
        } catch {
            return "";
        }
    };

    // Get week info from query params (decoded)
    const weekStart = decodeUrlSafe(searchParams.get("ws") || "");
    const weekEnd = decodeUrlSafe(searchParams.get("we") || "");
    const storeName = decodeUrlSafe(searchParams.get("sn") || "");

    const [data, setData] = useState<TableRow[]>([]);
    const [fileSummary, setFileSummary] = useState<FileSummary | null>(null);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
    const [customToast, setCustomToast] = useState<ToastNotificationProps>({
        message: "",
        type: "",
    });

    // Build back URL with filter state preserved
    const getBackUrl = () => {
        return '/inventory';
    };

    // Table columns
    const columns: ColumnDef<TableRow>[] = [
        {
            accessorKey: "item_name",
            header: () => <div className="text-left">Item Name</div>,
            cell: (info) => {
                const itemName = info.getValue() as string;
                const truncated = itemName?.length > 25 ? `${itemName.slice(0, 25)}...` : itemName;
                return <span title={itemName}>{truncated}</span>;
            },
            size: 180,
        },
        {
            accessorKey: "inventory_product",
            header: () => <div className="text-left">Product Category</div>,
            cell: (info) => <span>{info.getValue() as string}</span>,
            size: 120,
        },
        {
            accessorKey: "quantity",
            header: () => <div className="flex justify-end mr-3">Quantity</div>,
            cell: (info) => (
                <span className="flex justify-end mr-3">
                    {Number(info.getValue()).toLocaleString()}
                </span>
            ),
            size: 100,
        },
        {
            accessorKey: "average_price",
            header: () => <div className="flex justify-end mr-3">Avg Price ($)</div>,
            cell: (info) => (
                <span className="flex justify-end mr-3">
                    ${Number(info.getValue()).toFixed(2)}
                </span>
            ),
            size: 110,
        },
        {
            accessorKey: "total",
            header: () => <div className="flex justify-end mr-3">Total ($)</div>,
            cell: (info) => (
                <span className="flex justify-end mr-3">
                    ${Number(info.getValue()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            ),
            size: 120,
        },
        {
            accessorKey: "percent",
            header: () => <div className="flex justify-end mr-3">Percent (%)</div>,
            cell: (info) => (
                <span className="flex justify-end mr-3">
                    {Number(info.getValue()).toFixed(2)}%
                </span>
            ),
            size: 100,
        },
        {
            accessorKey: "inv_size",
            header: () => <div className="text-center">Size</div>,
            cell: (info) => (
                <span className="flex justify-center">{info.getValue() as string}</span>
            ),
            size: 80,
        },
        {
            accessorKey: "inv_measure",
            header: () => <div className="text-left">Measure</div>,
            cell: (info) => (
                <span>{info.getValue() as string}</span>
            ),
            size: 100,
        },
    ];

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 100,
                pageIndex: 0,
            },
        },
    });

    // Fetch inventory items
    useEffect(() => {
        if (!inventoryid) return;

        // URL-safe base64 decoding: restore + and /, add padding back
        const decodeUrlSafeBase64 = (encoded: string): string => {
            // Replace URL-safe characters back to standard base64
            let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
            // Add padding if needed
            const padding = 4 - (base64.length % 4);
            if (padding !== 4) {
                base64 += "=".repeat(padding);
            }
            return atob(base64);
        };

        const decodedId = decodeUrlSafeBase64(inventoryid);

        const fetchData = async () => {
            setLoading(true);
            try {
                const response: any = await sendApiRequest({
                    mode: "getInventoryItems",
                    storeweekfileid: Number(decodedId),
                });

                if (response?.status === 200 && response?.data?.inventoryitems) {
                    const items = response.data.inventoryitems.map((item: InventoryItemData) => {
                        let avgPrice = parseFloat(item.inventoryproduct) || 0;
                        if (avgPrice === 0 && item.quantity !== 0) {
                            avgPrice = item.total / item.quantity;
                        }

                        return {
                            item_name: item.itemname || "",
                            quantity: item.quantity || 0,
                            average_price: avgPrice,
                            total: item.total || 0,
                            percent: item.percent || 0,
                            inventory_product: item.inventoryproduct || "",
                            inv_size: item.invsize || "",
                            inv_measure: item.invmeasure || "",
                        };
                    });
                    setData(items);
                    setTotalItems(items.length);

                    // Get file summary from first item if available
                    if (response.data.inventoryitems.length > 0) {
                        // Exclude items with 'summary' in item_name from calculations
                        const itemsForCalculation = items.filter((item: TableRow) =>
                            !item.item_name?.toLowerCase().includes("summary")
                        );
                        setFileSummary({
                            storename: storeName || "", // Use store name from URL
                            weekstart: "",
                            weekend: "",
                            totalamount: itemsForCalculation.reduce((sum: number, item: TableRow) => sum + item.total, 0),
                            totalqty: itemsForCalculation.reduce((sum: number, item: TableRow) => sum + item.quantity, 0),
                        });
                    }
                } else {
                    setCustomToast({
                        message: response?.message || "Failed to fetch inventory items.",
                        type: "error",
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setCustomToast({
                    message: "An error occurred while fetching inventory items.",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [inventoryid]);

    // Check scrollbar visibility
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
    }, [table]);

    return (
        <main
            className="max-h-[calc(100vh-80px)] overflow-auto px-6 below-md:px-3"
            style={{ scrollbarWidth: "thin" }}
        >
            <ToastNotification message={customToast.message} type={customToast.type} />
            {loading && <Loading />}

            {/* Header Section */}
            <div className="flex w-full items-start gap-4 mt-6 mb-6 below-md:mt-4 below-md:mb-4">
                <div
                    className="below-md:hidden flex items-start cursor-pointer pt-2"
                    onClick={() => router.push(getBackUrl())}
                >
                    <img src="/images/webbackicon.svg" alt="Back Arrow" className="w-7 h-7" />
                </div>

                <div className="flex gap-4 flex-1 below-md:w-[100%] below-md:flex-wrap">
                    {/* Store Name Card */}
                    <div className="shadow border bg-[#FFFFFF] rounded-lg p-4 flex-1 min-w-[200px] flex items-center justify-between">
                        <p className="text-[#636363] text-[12px]">Store Name</p>
                        <p className="text-[#636363] text-[15px] font-semibold">
                            {fileSummary?.storename || "-"}
                        </p>
                    </div>

                    {/* Week Number Card */}
                    <div className="shadow border bg-[#FFFFFF] rounded-lg p-4 flex-1 min-w-[200px] flex items-center justify-between">
                        <p className="text-[#636363] text-[15px] font-semibold">
                            Week: {String(getWeekNumber(weekStart)).padStart(2, '0')}
                        </p>
                        {weekStart && (
                            <p className="text-[#636363] text-[15px] font-semibold">
                                {(() => {
                                    const date = new Date(weekStart);
                                    const day = date.getDay();
                                    const sunday = new Date(date);
                                    sunday.setDate(date.getDate() - day);
                                    const saturday = new Date(sunday);
                                    saturday.setDate(sunday.getDate() + 6);
                                    return `${format(sunday, "MM/dd/yy")} - ${format(saturday, "MM/dd/yy")}`;
                                })()}
                            </p>
                        )}
                    </div>

                    {/* Total Quantity Card */}
                    <div className="shadow border bg-[#FFFFFF] rounded-lg p-4 flex-1 min-w-[200px] flex items-center justify-between">
                        <p className="text-[#636363] text-[12px]">Total Qty</p>
                        <p className="text-[#636363] text-[15px] font-semibold">{fileSummary?.totalqty?.toLocaleString() || 0}</p>
                    </div>

                    {/* Total Amount Card */}
                    <div className="shadow border bg-[#FFFFFF] rounded-lg p-4 flex-1 min-w-[200px] flex items-center justify-between">
                        <p className="text-[#636363] text-[12px]">Total Amount</p>
                        <p className="text-[#636363] text-[15px] font-semibold">
                            ${fileSummary?.totalamount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Back Button */}
            <div className="hidden below-md:flex mb-4">
                <button
                    onClick={() => router.push(getBackUrl())}
                    className="bg-[#636363] hover:bg-[#4a4a4a] text-white text-[13px] px-4 py-2 rounded-md flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Files
                </button>
            </div>

            {/* Table Content - Desktop */}
            <div className="shadow-sm border border-b border-[#E4E4EF] block below-md:hidden rounded-md">
                <div className="overflow-x-auto rounded-md">
                    <table className="w-full table-auto border-collapse text-[15px] text-white">
                        <thead className="bg-[#0F1044]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-2 text-start font-normal"
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
                        className="max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto"
                        style={{ scrollbarWidth: "thin" }}
                    >
                        <table className="w-full text-[14px] table-auto shadow rounded-md">
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 10 }).map((_, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#F3F3F6]"}>
                                            {columns.map((column, colIndex) => (
                                                <td key={colIndex} className="px-4 py-1.5" style={{ width: `${column.size}px` }}>
                                                    <Skeleton height={30} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : data && data.length > 0 ? (
                                    table.getRowModel().rows.map((row) => {
                                        const isSummaryRow = row.original.item_name?.toLowerCase().includes("summary");
                                        return (
                                            <tr
                                                key={row.id}
                                                className={
                                                    isSummaryRow
                                                        ? "bg-[#FEF3C7] font-semibold" // Highlight summary row with yellow background
                                                        : row.index % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-[#F3F3F6]"
                                                }
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className={`py-1.5 px-4 ${isSummaryRow ? "text-[#92400E] font-semibold" : "text-[#636363]"}`}
                                                        style={{ width: `${cell.column.getSize()}px` }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="py-10 text-center text-[#636363]">
                                            No inventory items found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination - Desktop */}
            {data && data.length > 0 && (
                <div className="mt-4 below-md:hidden">
                    <Pagination table={table} totalItems={totalItems} />
                </div>
            )}

            {/* Card Content for Mobile View */}
            <div className="hidden below-md:block">
                {data?.map((row, index) => {
                    const isSummaryRow = row?.item_name?.toLowerCase().includes("summary");
                    return (
                        <React.Fragment key={index}>
                            <div className="flex justify-between w-full mb-4">
                                <div className={`shadow border rounded-lg w-full gap-3 px-4 flex flex-col py-4 ${isSummaryRow ? "bg-[#FEF3C7] border-[#F59E0B]" : ""}`}>
                                    <div className="flex gap-4 px-1">
                                        <span className={`text-[16px] font-bold ${isSummaryRow ? "text-[#92400E]" : "text-black"}`}>{row?.item_name}</span>
                                    </div>
                                    <hr className="w-full h-[1px] my-2" color="lightgrey" />
                                    <div className="flex justify-between">
                                        <span className="text-[#636363] text-[12px]">Product Category</span>
                                        <span className="text-[#636363] text-[14px]">{row?.inventory_product}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#636363] text-[12px]">Quantity</span>
                                        <span className="text-[#636363] text-[14px]">{row?.quantity?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#636363] text-[12px]">Avg Price</span>
                                        <span className="text-[#636363] text-[14px]">${row?.average_price?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#636363] text-[12px]">Size</span>
                                        <span className="text-[#636363] text-[14px]">{row?.inv_size || "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#636363] text-[12px]">Measure</span>
                                        <span className="text-[#636363] text-[14px]">{row?.inv_measure || "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#636363] text-[12px]">Percent</span>
                                        <span className="text-[#636363] text-[14px]">{row?.percent?.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-[#636363] text-[14px] font-semibold">Total</span>
                                        <span className="text-[#636363] text-[14px] font-semibold">
                                            ${row?.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}

                {/* Pagination - Mobile */}
                {data && data.length > 0 && (
                    <div className="mt-4">
                        <Pagination table={table} totalItems={totalItems} />
                    </div>
                )}
            </div>
        </main>
    );
    const InventoryDetails = () => {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <InventoryDetailsContent />
            </Suspense>
        );
    };

    export default InventoryDetails;

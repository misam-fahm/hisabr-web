"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Dropdown from "@/Components/UI/Themes/DropDown";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, {
    ToastNotificationProps,
} from "@/Components/UI/ToastNotification/ToastNotification";
import Loading from "@/Components/UI/Themes/Loading";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import { useGlobalContext } from "@/Components/Header/header";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import Pagination from "@/Components/UI/Pagination/Pagination";
import Tooltip from "@/Components/UI/Toolstips/Tooltip";

interface InvoiceDetailRow {
    invoicedate: string;
    invoicenumber: string;
    sellername: string;
    itemcode: string;
    description: string;
    brand: string;
    category: string;
    quantity: number;
    unit: string;
    packsize: string;
    invtvalue: any;
    unitprice: number;
    tax: string;
    extendedprice: number;
    invoiceid: number;
}

const InvoiceDetails: FC = () => {
    const router = useRouter();
    const [data, setData] = useState<InvoiceDetailRow[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDateRangeOpen, setIsDateRangeOpen] = useState<boolean>(false);
    const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [customToast, setCustomToast] = useState<ToastNotificationProps>({
        message: "",
        type: "",
    });
    const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        storeOptions,
        dateRangeOptions,
        selectedDateRange,
        setSelectedDateRange,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        selectedStore,
        setSelectedStore,
    } = useGlobalContext();

    const columns: ColumnDef<InvoiceDetailRow>[] = [
        {
            accessorKey: "invoicedate",
            header: () => <div className="text-left px-1 text-[15px]">Date</div>,
            cell: (info) => <span className="px-1 text-[13px]">{info.getValue() as string}</span>,
            size: 80,
        },
        {
            accessorKey: "invoicenumber",
            header: () => <div className="text-left px-1 text-[15px]">Invoice</div>,
            cell: (info) => (
                <span
                    className="px-1 text-[13px] text-black font-medium cursor-pointer hover:underline"
                    onClick={() => {
                        const invoiceid = (info.row.original as InvoiceDetailRow).invoiceid;
                        const encodedId = btoa(invoiceid.toString())
                            .replace(/\+/g, "-")
                            .replace(/\//g, "_")
                            .replace(/=+$/, "");
                        router.push(`/invoices/${encodedId}`);
                    }}
                >
                    {info.getValue() as string}
                </span>
            ),
            size: 95,
        },
        {
            accessorKey: "sellername",
            header: () => <div className="text-left px-1 text-[15px]">Vendor</div>,
            cell: (info) => (
                <Tooltip text={info.getValue() as string} position="top">
                    <span className="truncate block px-1 text-[13px] max-w-[65px]">
                        {(info.getValue() as string)?.substring(0, 6)}
                    </span>
                </Tooltip>
            ),
            size: 70,
        },
        {
            accessorKey: "itemcode",
            header: () => <div className="text-left px-1 text-[15px]">Item</div>,
            cell: (info) => (
                <Tooltip text={info.getValue() as string} position="top">
                    <span className="truncate block px-1 text-[13px] max-w-[80px]">
                        {info.getValue() as string}
                    </span>
                </Tooltip>
            ),
            size: 85,
        },
        {
            accessorKey: "description",
            header: () => <div className="text-left px-1 text-[15px]">Description</div>,
            cell: (info) => (
                <Tooltip text={info.getValue() as string} position="top">
                    <span className="truncate block px-1 text-[13px] max-w-[150px]">
                        {info.getValue() as string}
                    </span>
                </Tooltip>
            ),
            size: 155,
        },
        {
            accessorKey: "brand",
            header: () => <div className="text-left px-1 text-[15px]">Brand</div>,
            cell: (info) => <span className="px-1 text-[13px]">{info.getValue() as string || "--"}</span>,
            size: 80,
        },
        {
            accessorKey: "category",
            header: () => <div className="text-left px-1 text-[15px]">Cat</div>,
            cell: (info) => <span className="px-1 text-[13px] uppercase">{(info.getValue() as string)?.substring(0, 3) || "--"}</span>,
            size: 70,
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-right px-1 text-[15px]">Qty</div>,
            cell: (info) => (
                <div className="text-right px-1 text-[13px]">{Number(info.getValue()).toLocaleString()}</div>
            ),
            size: 45,
        },
        {
            accessorKey: "unit",
            header: () => <div className="text-left px-1 text-[15px]">Unit</div>,
            cell: (info) => <span className="px-1 text-[13px]">{info.getValue() as string || "--"}</span>,
            size: 60,
        },
        {
            accessorKey: "packsize",
            header: () => <div className="text-left px-1 text-[15px]">Pack S.</div>,
            cell: (info) => <span className="px-1 text-[13px]">{info.getValue() as string || "--"}</span>,
            size: 70,
        },
        {
            accessorKey: "invtvalue",
            header: () => <div className="text-right px-1 text-[15px]">Invt Value</div>,
            cell: (info) => (
                <div className="text-right px-1 text-[13px]">
                    {info.getValue() ? Number(info.getValue()).toFixed(2) : "0.00"}
                </div>
            ),
            size: 85,
        },
        {
            accessorKey: "unitprice",
            header: () => <div className="text-right px-1 text-[15px]">Unit Price</div>,
            cell: (info) => (
                <div className="text-right px-1 text-[13px]">
                    ${Number(info.getValue()).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            ),
            size: 100,
        },
        {
            accessorKey: "tax",
            header: () => <div className="text-left px-1 text-[15px]">Tax</div>,
            cell: (info) => (
                <div className="text-left px-1 text-[13px]">
                    ${Number(info.getValue()).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            ),
            size: 80,
        },
        {
            accessorKey: "extendedprice",
            header: () => <div className="text-left px-3 text-[15px]">Total</div>,
            cell: (info) => (
                <div className="text-left px-3 font-medium text-[13px]">
                    ${Number(info.getValue()).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            ),
            size: 110,
        },
    ];

    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
        },
        manualPagination: true,
        pageCount: Math.ceil(totalItems / 10),
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
    });

    const { pageIndex, pageSize } = table.getState().pagination;

    const fetchData = async (search: string = globalFilter) => {
        if (!selectedStore) return;
        setLoading(true);
        try {
            const response: any = await sendApiRequest({
                mode: "getDqRevCenterData",
                sp: "GetInvoiceDetailsData",
                storeid: selectedStore?.id || 69,
                startdate: startDate && format(startDate, "yyyy-MM-dd"),
                enddate: endDate && format(endDate, "yyyy-MM-dd"),
                page: table.getState().pagination.pageIndex + 1,
                limit: table.getState().pagination.pageSize,
                search: search,
            });

            if (response?.status === 200) {
                const resultData = response?.data?.result || response?.data;
                setData(resultData?.invoicedetails || resultData?.invoices || []);

                const total = resultData?.total ?? response?.data?.total;
                if (total !== undefined) {
                    if (table.getState().pagination.pageIndex === 0) {
                        setTotalItems(Number(total) || 0);
                    }
                }
            } else {
                setCustomToast({
                    message: response?.message || "Failed to fetch invoice details.",
                    type: "error",
                });
                setData([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVerifiedUser && startDate && endDate && selectedStore) {
            if (table.getState().pagination.pageIndex !== 0) {
                table.setPageIndex(0);
            } else {
                fetchData();
            }
        }
    }, [startDate, endDate, selectedStore, globalFilter, isVerifiedUser]);

    useEffect(() => {
        if (isVerifiedUser && startDate && endDate && selectedStore) {
            fetchData();
        }
    }, [pageIndex, pageSize]);

    const verifyToken = async (token: string) => {
        try {
            const res: any = await sendApiRequest({ token }, `auth/verifyToken`);
            if (res?.status === 200) {
                setIsVerifiedUser(true);
            } else {
                router.replace("/login");
            }
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

    const clearSearch = () => {
        setGlobalFilter("");
        // Reset page index will trigger fetchData via effect
        if (table.getState().pagination.pageIndex !== 0) {
            table.setPageIndex(0);
        } else {
            fetchData("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            fetchData(globalFilter);
        }
    };

    if (!isMounted) return null;

    return (
        <main className="px-6 below-md:px-3 max-h-[calc(100vh-60px)] flex flex-col overflow-auto scrollbar-thin">
            <ToastNotification message={customToast.message} type={customToast.type} />
            {loading && data.length === 0 && <Loading />}

            <div className="z-20 bg-[#f7f8f9] pb-4 pt-4">
                <div className="flex flex-row flex-nowrap gap-3 w-full below-md:flex-col">
                    <div className="flex flex-row gap-3 w-full below-md:flex-col small-laptop:w-full">
                        <Dropdown
                            options={storeOptions}
                            selectedOption={selectedStore?.name || "Store"}
                            onSelect={(option: any) => {
                                setSelectedStore(option);
                                setIsStoreDropdownOpen(false);
                            }}
                            isOpen={isStoreDropdownOpen}
                            toggleOpen={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                            widthchange="flex-1 min-w-[180px] w-full"
                        />

                        <Dropdown
                            options={dateRangeOptions}
                            selectedOption={selectedDateRange?.name}
                            onSelect={(option: any) => {
                                setSelectedDateRange(option);
                                setIsDateRangeOpen(false);
                            }}
                            isOpen={isDateRangeOpen}
                            toggleOpen={() => setIsDateRangeOpen(!isDateRangeOpen)}
                            widthchange="flex-1 min-w-[180px] w-full"
                        />

                        <div className="flex-1 min-w-[300px] h-[35px] w-full">
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                                fetchData={() => {
                                    if (table.getState().pagination.pageIndex !== 0) {
                                        table.setPageIndex(0);
                                    } else {
                                        fetchData();
                                    }
                                }}
                            />
                        </div>

                        <div className="flex-1 min-w-[150px] h-[35px] w-full relative">
                            <input
                                type="text"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                onKeyDown={handleKeyDown}
                                ref={searchInputRef}
                                placeholder="Search by name or code..."
                                className="w-full rounded border border-gray-300 bg-white py-[10px] pr-7 pl-3 h-full text-[12px] placeholder:text-[#636363] focus:outline-none focus:ring-1 focus:ring-white"
                            />
                            {globalFilter && (
                                <div
                                    className="absolute inset-y-0 right-7 flex items-center cursor-pointer"
                                    onClick={clearSearch}
                                >
                                    <img className="w-4 h-4" src="/images/cancelicon.svg" alt="Clear" />
                                </div>
                            )}
                            <div
                                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                onClick={() => {
                                    if (table.getState().pagination.pageIndex !== 0) {
                                        table.setPageIndex(0);
                                    } else {
                                        fetchData(globalFilter);
                                    }
                                }}
                            >
                                <img src="/images/searchicon.svg" alt="Search" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Web View : Invoice Details Table */}
            <div className="overflow-x-auto relative shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md flex-grow flex flex-col overflow-hidden">
                <div className="overflow-hidden flex flex-col h-full rounded-md">
                    <table className="w-full border-collapse text-[14px] text-white table-fixed">
                        <thead className="bg-[#0F1044] sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="py-3 text-[#FFFFFF] font-normal text-[15px]"
                                            style={{ width: `${header.column.getSize()}px` }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                    </table>
                    <div
                        className="w-full relative overflow-y-auto scrollbar-thin flex-grow"
                        style={{ maxHeight: "calc(100vh - 340px)" }}
                    >
                        <table className="w-full border-collapse text-[14px] table-fixed">
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 15 }).map((_, index) => (
                                        <tr key={index} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                                            {columns.map((column, colIndex) => (
                                                <td key={colIndex} className="px-1 py-1.5" style={{ width: `${column.size}px` }}>
                                                    <Skeleton height={25} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="py-10">
                                            <NoDataFound />
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className={row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className="px-1 py-2 text-[#636363] text-[14px]"
                                                    style={{ width: `${cell.column.getSize()}px` }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="py-4">
                <Pagination table={table} totalItems={totalItems} />
            </div>
        </main>
    );
};

export default InvoiceDetails;

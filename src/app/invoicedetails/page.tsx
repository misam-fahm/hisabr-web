"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
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
    invoicedetailid: number;
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedInvoiceItem, setSelectedInvoiceItem] = useState<InvoiceDetailRow | null>(null);
    const [editFormData, setEditFormData] = useState({
        unit_price: 0,
        extended_price: 0,
        quantity: 0,
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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
            size: 75,
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
            size: 85,
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
            size: 65,
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
            size: 75,
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
            size: 130,
        },
        {
            accessorKey: "brand",
            header: () => <div className="text-left px-1 text-[15px]">Brand</div>,
            cell: (info) => <span className="px-1 text-[13px]">{info.getValue() as string || "--"}</span>,
            size: 70,
        },
        {
            accessorKey: "category",
            header: () => <div className="text-left px-1 text-[15px]">Cat</div>,
            cell: (info) => <span className="px-1 text-[13px] uppercase">{(info.getValue() as string)?.substring(0, 3) || "--"}</span>,
            size: 55,
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-right px-1 text-[15px]">Qty</div>,
            cell: (info) => {
                const row = info.row.original;
                const quantity = Number(info.getValue()) || 0;
                const unitPrice = Number(row.unitprice) || 0;
                const storedTotal = Number(row.extendedprice) || 0;

                // Calculate what qty should be from total / unit price
                let calculatedQty = quantity;
                let isMatch = true;

                if (unitPrice > 0) {
                    calculatedQty = Math.round(storedTotal / unitPrice);
                    // Check if stored qty matches calculated qty
                    isMatch = quantity === calculatedQty;
                }

                if (!isMatch) {
                    return (
                        <div className="text-right px-2 py-0.5 bg-red-50 rounded text-[13px]">
                            <span className="text-gray-400">{quantity.toLocaleString()}</span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span className="text-red-600 font-semibold">{calculatedQty.toLocaleString()}</span>
                        </div>
                    );
                }

                return (
                    <div className="text-right px-1 text-[13px]">
                        {quantity.toLocaleString()}
                    </div>
                );
            },
            size: 55,
        },
        {
            accessorKey: "unit",
            header: () => <div className="text-left px-1 text-[15px]">Unit</div>,
            cell: (info) => <span className="px-1 text-[13px]">{info.getValue() as string || "--"}</span>,
            size: 55,
        },
        {
            accessorKey: "packsize",
            header: () => <div className="text-left px-1 text-[15px]">Pack S.</div>,
            cell: (info) => <span className="px-1 text-[13px]">{info.getValue() as string || "--"}</span>,
            size: 65,
        },
        {
            accessorKey: "invtvalue",
            header: () => <div className="text-right px-1 text-[15px]">Invt Value</div>,
            cell: (info) => (
                <div className="text-right px-1 text-[13px]">
                    {info.getValue() ? Number(info.getValue()).toFixed(2) : "0.00"}
                </div>
            ),
            size: 75,
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
            size: 90,
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
            size: 70,
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
            size: 100,
        },
        {
            id: "actions",
            header: () => <div className="text-center px-1 text-[15px]">Edit</div>,
            cell: (info) => (
                <div className="text-center px-1">
                    <button
                        onClick={() => {
                            const row = info.row.original;
                            setSelectedInvoiceItem(row);
                            setEditFormData({
                                unit_price: row.unitprice,
                                extended_price: row.extendedprice,
                                quantity: row.quantity,
                            });
                            setIsEditModalOpen(true);
                        }}
                        className="inline-flex justify-center items-center p-1 rounded hover:bg-gray-100 transition-colors"
                        title="Edit Invoice Details"
                    >
                        <img
                            src="/images/editpencilicon.svg"
                            alt="Edit"
                            className="w-4 h-4"
                        />
                    </button>
                </div>
            ),
            size: 50,
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
                pageSize: 100,
                pageIndex: 0,
            },
        },
        manualPagination: true,
        pageCount: Math.ceil(totalItems / 100),
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

    const handleDeleteInvoiceItem = async () => {
        if (!selectedInvoiceItem) return;

        setIsUpdating(true);
        try {
            const response: any = await sendApiRequest({
                mode: "deleteitembyid",
                invoice_detail_id: selectedInvoiceItem.invoicedetailid,
            });

            if (response?.status === 200) {
                setCustomToast({
                    message: "Invoice item deleted successfully!",
                    type: "success",
                });
                setIsDeleteConfirmOpen(false);
                setIsEditModalOpen(false);
                // Refresh the data
                fetchData();
            } else {
                setCustomToast({
                    message: response?.message || "Failed to delete invoice item.",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error deleting invoice item:", error);
            setCustomToast({
                message: "An error occurred while deleting invoice item.",
                type: "error",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateInvoiceDetails = async () => {
        if (!selectedInvoiceItem) return;

        setIsUpdating(true);
        try {
            const response: any = await sendApiRequest({
                mode: "updateinvoicedetailsbyid",
                invoice_detail_id: selectedInvoiceItem.invoicedetailid,
                unit_price: editFormData.unit_price,
                extended_price: editFormData.extended_price,
                quantity: editFormData.quantity,
            });

            if (response?.status === 200) {
                setCustomToast({
                    message: "Invoice details updated successfully!",
                    type: "success",
                });
                setIsEditModalOpen(false);
                // Refresh the data
                fetchData();
            } else {
                setCustomToast({
                    message: response?.message || "Failed to update invoice details.",
                    type: "error",
                });
            }
        } catch (error) {
            console.error("Error updating invoice details:", error);
            setCustomToast({
                message: "An error occurred while updating invoice details.",
                type: "error",
            });
        } finally {
            setIsUpdating(false);
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

            {/* Edit Invoice Details Modal */}
            <Dialog
                open={isEditModalOpen}
                as="div"
                className="relative z-50"
                onClose={() => setIsEditModalOpen(false)}
            >
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-[400px] h-auto below-md:w-[94%] below-md:h-auto px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
                        <div className="relative">
                            <div className="flex justify-center">
                                <DialogTitle
                                    as="h3"
                                    className="text-[16px] font-bold leading-custom text-[#3D3D3D]"
                                >
                                    Edit Invoice Details
                                </DialogTitle>
                            </div>
                            <img
                                onClick={() => setIsEditModalOpen(false)}
                                src="/images/cancelicon.svg"
                                alt="Cancel"
                                className="absolute top-1.5 right-0 cursor-pointer"
                            />
                        </div>

                        <div className="flex flex-col mt-4 gap-3">
                            {/* Invoice Number (Read-only) */}
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Invoice Number
                                </label>
                                <input
                                    type="text"
                                    value={selectedInvoiceItem?.invoicenumber || ""}
                                    disabled
                                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-[#636363] cursor-not-allowed"
                                />
                            </div>

                            {/* Item Code (Read-only) */}
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Item Code
                                </label>
                                <input
                                    type="text"
                                    value={selectedInvoiceItem?.itemcode || ""}
                                    disabled
                                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-[#636363] cursor-not-allowed"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={editFormData.quantity}
                                    onChange={(e) => setEditFormData({ ...editFormData, quantity: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md text-[#636363] focus:outline-none focus:ring-1 focus:ring-[#168A6F]"
                                />
                            </div>

                            {/* Unit Price */}
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Unit Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editFormData.unit_price}
                                    onChange={(e) => setEditFormData({ ...editFormData, unit_price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md text-[#636363] focus:outline-none focus:ring-1 focus:ring-[#168A6F]"
                                />
                            </div>

                            {/* Extended Price */}
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Total Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editFormData.extended_price}
                                    onChange={(e) => setEditFormData({ ...editFormData, extended_price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md text-[#636363] focus:outline-none focus:ring-1 focus:ring-[#168A6F]"
                                />
                            </div>

                            {/* Original Values Display */}
                            {selectedInvoiceItem && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-medium text-gray-600">Original Values:</p>
                                        <button
                                            onClick={() => setIsDeleteConfirmOpen(true)}
                                            disabled={isUpdating}
                                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete Item"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                                        <div>
                                            <span className="font-medium">Qty:</span> {selectedInvoiceItem.quantity}
                                        </div>
                                        <div>
                                            <span className="font-medium">Unit:</span> ${Number(selectedInvoiceItem.unitprice).toFixed(2)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Total:</span> ${Number(selectedInvoiceItem.extendedprice).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col items-center mt-2">
                                <div className="flex justify-between gap-3 items-center w-full">
                                    <button
                                        type="button"
                                        className="px-4 py-2 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] flex-1 hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                                        onClick={() => setIsEditModalOpen(false)}
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUpdateInvoiceDetails}
                                        disabled={isUpdating}
                                        className="px-4 py-2 text-white md:text[13px] text-[14px] md:h-[35px] flex-1 bg-[#168A6F] hover:bg-[#11735C] rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isUpdating ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteConfirmOpen}
                as="div"
                className="relative z-50"
                onClose={() => setIsDeleteConfirmOpen(false)}
            >
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-[400px] h-auto below-md:w-[94%] below-md:h-auto px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
                        <div className="relative">
                            <div className="flex justify-center">
                                <DialogTitle
                                    as="h3"
                                    className="text-[16px] font-bold leading-custom text-[#3D3D3D]"
                                >
                                    Confirm Deletion
                                </DialogTitle>
                            </div>
                            <img
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                src="/images/cancelicon.svg"
                                alt="Cancel"
                                className="absolute top-1.5 right-0 cursor-pointer"
                            />
                        </div>

                        <div className="flex flex-col mt-4 gap-3">
                            {/* Warning Icon */}
                            <div className="flex justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>

                            {/* Warning Message */}
                            <div className="text-center">
                                <p className="text-sm text-gray-700 font-medium mb-2">
                                    Are you sure you want to delete this invoice item?
                                </p>
                                <p className="text-xs text-red-600 font-semibold">
                                    The invoice data will be deleted. It will affect your data and can't revert back.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col items-center mt-4">
                                <div className="flex justify-between gap-3 items-center w-full">
                                    <button
                                        type="button"
                                        className="px-4 py-2 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] flex-1 hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                                        onClick={() => setIsDeleteConfirmOpen(false)}
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteInvoiceItem}
                                        disabled={isUpdating}
                                        className="px-4 py-2 text-white md:text[13px] text-[14px] md:h-[35px] flex-1 bg-red-600 hover:bg-red-700 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isUpdating ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </main>
    );
};

export default InvoiceDetails;

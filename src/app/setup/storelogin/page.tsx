"use client";
import React, { FC, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";
import AddStore from "@/Components/Setup/StorePopup/AddStore";
import { sendApiRequest } from "@/utils/apiUtils";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";

interface TableRow {
  storeid: number;
  storename: string;
  firstname: string;
  lastname: string;
  emailid: string;
  owner: string;
  userisactive: number;
  user_id?: number; // Optional, as it might not be in the API response yet
}

interface JsonData {
  mode: string;
  storeid?: number;
  userid?: number;
  is_active?: string;
}

const Page: FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenAddStore, setOpenAddStore] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<TableRow | null>(null);

  const methods = useForm<any>();

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "store",
      header: () => <div className="text-left">Store Name</div>,
      cell: (info) => (
        <span>
          {info.row.original.storename?.length > 23
            ? info.row.original.storename.substring(0, 20) + "..."
            : info.row.original.storename}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "firstname",
      header: () => <div className="text-left">First Name</div>,
      cell: (info) => <span>{info.row.original.firstname || ""}</span>,
      size: 100,
    },
    {
      accessorKey: "lastname",
      header: () => <div className="text-left">Last Name</div>,
      cell: (info) => <span>{info.row.original.lastname || ""}</span>,
      size: 100,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-left">Email</div>,
      cell: (info) => <span>{info.row.original.emailid || ""}</span>,
      size: 200,
    },
    {
      accessorKey: "user",
      header: () => <div className="text-left">User</div>,
      cell: (info) => <span>{info.row.original.owner}</span>,
      size: 100,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: (info) => (
        <span>{Number(info.row.original.userisactive) === 1 ? "Active" : "Inactive"}</span>
      ),
      size: 100,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <button
            onClick={() => {
              setEditData(info.row.original);
              setIsEditOpen(true);
              methods.reset({
                ...info.row.original,
                isactive: Number(info.row.original.userisactive) === 1,
              });
            }}
          >
            <img
              src="/images/editpencilicon.svg"
              alt="Edit icon"
              className="w-4 h-4 below-md:w-5 below-md:h-5"
            />
          </button>
        </span>
      ),
      size: 50,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("UserId");
      const response: any = await sendApiRequest({
        mode: "getuserDetails",
        userid: userId,
        page: 1,
        limit: 1000,
      });
      if (response?.status === 200) {
        const stores = response.data?.stores || [];
        console.log("Fetched stores:", stores); // Log raw API response
        const mappedData = stores.map((store: any) => {
          const mappedStore = {
            storeid: store.storeid,
            storename: store.storename,
            firstname: store.firstname,
            lastname: store.lastname,
            emailid: store.emailid,
            owner: store.owner,
            userisactive: Number(store.isactive), // Correctly map isactive
            user_id: store.user_id, // Hopefully provided by API
          };
          if (!store.user_id) {
            console.warn(`No user_id for store ${store.storeid}`);
          }
          return mappedStore;
        });
        setData(mappedData);
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch data",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomToast({
        message: "Error fetching data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpenAddStore]);

  const [userType, setUserType] = useState<any>();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("UserType"));
    }
  }, []);

  const onSubmit = async (formData: any) => {
    if (!editData?.user_id) {
      setCustomToast({
        message: "User ID is missing. Cannot update status.",
        type: "error",
      });
      return;
    }

    const jsonData: JsonData = {
      mode: "updateUserStatus",
      storeid: editData.storeid,
      userid: editData.user_id,
      is_active: formData.isactive ? "1" : "0", // String to match stored procedure
    };

    try {
      console.log("Sending update request:", jsonData); // Log request payload
      const result: any = await sendApiRequest(jsonData);
      console.log("Update response:", result); // Log response
      if (result?.status === 200 && !result.data?.message?.includes("Error")) {
        setCustomToast({
          message: "User status updated successfully!",
          type: "success",
        });
        setTimeout(() => {
          setIsEditOpen(false);
          fetchData();
        }, 300);
      } else {
        setCustomToast({
          message:
            result?.data?.message || "Failed to update user status",
          type: "error",
        });
      }
    } catch (error) {
      setCustomToast({ message: "Error updating user status", type: "error" });
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3 below-md:py-4 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification message={customToast.message} type={customToast.type} />

      <div className="flex flex-row justify-end gap-2 below-md:hidden my-6">
        {userType === "A" && <AddStore setAddStore={setOpenAddStore} />}
      </div>

      {/* Mobile View */}
      <div className="block md:hidden" style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="border border-gray-200 p-5 bg-white rounded-lg mb-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[14px] text-[#334155]">
                {row.original.storename.length > 35
                  ? row.original.storename.slice(0, 35) + "..."
                  : row.original.storename}
              </span>
              <button
                onClick={() => {
                  setEditData(row.original);
                  setIsEditOpen(true);
                  methods.reset({ ...row.original, isactive: Number(row.original.userisactive) === 1 });
                }}
              >
                <img src="/images/editpencilicon.svg" alt="Edit" className="w-5 h-5" />
              </button>
            </div>
            <div className="border-b bg-gray-200 my-3"></div>
            <div className="text-[14px] mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">First Name</span>
              <span>{row.original.firstname || ""}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Last Name</span>
              <span>{row.original.lastname || ""}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Email</span>
              <span>{row.original.emailid || ""}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">User</span>
              <span>{row.original.owner}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Status</span>
              <span>{Number(row.original.userisactive) === 1 ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
        {userType === "A" && (
          <div className="block pl-24">
            <AddStore setAddStore={setOpenAddStore} />
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg hidden md:block">
        <table className="w-full border-collapse border-gray-200 table-fixed">
          <thead className="bg-[#0F1044] sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[15px]"
                    style={{ width: `${header.column.getSize()}px` }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-1.5">
                      <Skeleton height={30} />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
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
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} as="div" className="relative z-50" onClose={() => setIsEditOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] px-6 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <DialogTitle as="h3" className="text-[16px] font-bold text-[#3D3D3D] text-center">
                Edit User Status
              </DialogTitle>
              <img
                onClick={() => setIsEditOpen(false)}
                src="/images/cancelicon.svg"
                alt="Cancel"
                className="absolute top-1.5 right-0 cursor-pointer"
              />
            </div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col mt-2 gap-3">
                <InputField
                  type="text"
                  label="Store Name"
                  borderClassName="border border-gray-300"
                  labelBackgroundColor="bg-white"
                  textColor="text-[#636363]"
                  {...methods.register("storename", { required: "Store Name is required" })}
                  errors={methods.formState.errors.storename}
                  placeholder="Store Name"
                  variant="outline"
                  disabled
                />
                <InputField
                  type="text"
                  label="User"
                  borderClassName="border border-gray-300"
                  labelBackgroundColor="bg-white"
                  textColor="text-[#636363]"
                  {...methods.register("owner", { required: "User is required" })}
                  errors={methods.formState.errors.owner}
                  placeholder="User"
                  variant="outline"
                  disabled
                />
                <div className="flex items-center gap-2">
                  <label className="text-[#636363] mr-2">User Status</label>
                  <div className="relative inline-block w-12 h-6 align-middle select-none">
                    <input
                      type="checkbox"
                      id="isactive-toggle"
                      {...methods.register("isactive")}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <label
                      htmlFor="isactive-toggle"
                      className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                        methods.watch("isactive") ? "bg-green-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${
                          methods.watch("isactive") ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </label>
                  </div>
                  <span className="text-[#636363]">
                    {methods.watch("isactive") ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-[14px] text-[#636363]">
                  Clicking "Update" will toggle the user's active status for this store.
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-[14px] text-[#6F6F6F] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white text-[14px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md"
                  >
                    Update
                  </button>
                </div>
              </form>
            </FormProvider>
          </DialogPanel>
        </div>
      </Dialog>
    </main>
  );
};

export default Page;
"use client";
import React, { FC, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";

interface TableRow {
  Usersid: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  phonenumber: string | null;
  isactive: number;
  storeid: number | null;
  storename: string | null;
  storeCount?: number;
}

const Page: FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<{ message: string; type: string; toastId: number }>({
    message: "",
    type: "",
    toastId: 0,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TableRow | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    isactive: 1,
  });

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "storename",
      header: () => <div className="text-left">Store Name</div>,
      cell: (info) => {
        const storename = info.row.original.storename;
        return (
          <span>
            {storename && storename.length > 23
              ? storename.substring(0, 20) + "..."
              : storename || ""}
          </span>
        );
      },
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
      cell: (info) => <span>{info.row.original.email}</span>,
      size: 200,
    },
    {
      accessorKey: "phonenumber",
      header: () => <div className="text-left">Phone Number</div>,
      cell: (info) => <span>{info.row.original.phonenumber || ""}</span>,
      size: 120,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: (info) => (
        <span>{Number(info.row.original.isactive) === 1 ? "Active" : "Inactive"}</span>
      ),
      size: 100,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <button onClick={() => handleEditClick(info.row.original)}>
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
        mode: "getUsersWithStores",
        Usersid: userId,
        page: 1,
        limit: 1000,
      });
      if (response?.status === 200) {
        const users = response.data?.users || [];
        const userStoreCount: { [key: number]: number } = {};
        users.forEach((user: any) => {
          userStoreCount[user.Usersid] = (userStoreCount[user.Usersid] || 0) + 1;
        });

        const mappedData = users.map((user: any) => ({
          Usersid: user.Usersid,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phonenumber: user.phonenumber,
          isactive: Number(user.isactive),
          storeid: user.storeid,
          storename: user.storename,
          storeCount: userStoreCount[user.Usersid],
        }));
        setData(mappedData);
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch data",
          type: "error",
          toastId: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomToast({
        message: "Error fetching data",
        type: "error",
        toastId: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [userType, setUserType] = useState<any>();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("UserType"));
    }
  }, []);

  const handleEditClick = (user: TableRow) => {
    setSelectedUser(user);
    setFormData({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      phonenumber: user.phonenumber || "",
      isactive: user.isactive,
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => {
    setFormData((prev) => ({ ...prev, isactive: prev.isactive === 1 ? 0 : 1 }));
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !selectedUser.Usersid) {
      setCustomToast({
        message: "No user selected",
        type: "error",
        toastId: Date.now(),
      });
      return;
    }

    if (!formData.email) {
      setCustomToast({
        message: "Email is required",
        type: "error",
        toastId: Date.now(),
      });
      return;
    }

    const loggedInUserId = localStorage.getItem("UserId");

    const params = {
      mode: "updateUserDetails",
      Usersid: selectedUser.Usersid,
      firstname: formData.firstname || "",
      lastname: formData.lastname || "",
      email: formData.email,
      phonenumber: formData.phonenumber || "",
      isactive: formData.isactive,
    };

    try {
      const response = await sendApiRequest(params);
      if (response?.status === 200) {
        setData((prevData) =>
          prevData.map((user) =>
            user.Usersid === selectedUser.Usersid && user.storeid === selectedUser.storeid
              ? {
                  ...user,
                  firstname: formData.firstname,
                  lastname: formData.lastname,
                  email: formData.email,
                  phonenumber: formData.phonenumber,
                  isactive: formData.isactive,
                }
              : user
          )
        );

        const userStores = data
          .filter((user) => user.Usersid === selectedUser.Usersid)
          .map((user) => user.storename)
          .filter((name): name is string => name !== null);

        console.log("Triggering success toast");
        setCustomToast({
          message: "User updated successfully",
          type: "success",
          toastId: Date.now(),
        });

        if (selectedUser.storeCount && selectedUser.storeCount > 1) {
          setTimeout(() => {
            console.log("Triggering warning toast");
            setCustomToast({
              message: `Warning: User is associated with multiple stores: ${userStores.join(", ")}`,
              type: "warning",
              toastId: Date.now(),
            });
          }, 3000); // Show warning after success toast has time to display
        }

        if (selectedUser.Usersid.toString() === loggedInUserId) {
          console.log("Logged-in user updated, refreshing page.");
        }

        // Refresh the page after a short delay to allow toast to be seen
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Delay to ensure success toast is visible before refresh

        setIsEditModalOpen(false);
      } else {
        setCustomToast({
          message: response?.message || "Failed to update user",
          type: "error",
          toastId: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setCustomToast({
        message: "Error updating user",
        type: "error",
        toastId: Date.now(),
      });
    }
  };

  return (
    <main
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3 below-md:py-4 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification message={customToast.message} type={customToast.type} />

      {/* Mobile View */}
      <div className="block md:hidden" style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="border border-gray-200 p-5 bg-white rounded-lg mb-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[14px] text-[#334155]">
                {row.original.storename && row.original.storename.length > 35
                  ? row.original.storename.slice(0, 35) + "..."
                  : row.original.storename || ""}
              </span>
              <button onClick={() => handleEditClick(row.original)}>
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
              <span>
                {row.original.email.length > 25
                  ? row.original.email.substring(0, 25) + "..."
                  : row.original.email}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Phone</span>
              <span>{row.original.phonenumber || ""}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Status</span>
              <span>{Number(row.original.isactive) === 1 ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
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
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[400px] below-md:w-[94%]">
            <div className="relative mb-4">
              <h2 className="text-center text-[16px] font-bold text-[#3D3D3D]">
                Edit User
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-0 right-0"
              >
                <img
                  src="/images/cancelicon.svg"
                  alt="Cancel"
                  className="w-4 h-4"
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#636363] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#636363] focus:outline-none focus:ring-1 focus:ring-[#168A6F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#636363] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#636363] focus:outline-none focus:ring-1 focus:ring-[#168A6F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#636363] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#636363] focus:outline-none focus:ring-1 focus:ring-[#168A6F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#636363] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#636363] focus:outline-none focus:ring-1 focus:ring-[#168A6F]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#636363]">
                  Status
                </label>
                <button
                  onClick={handleToggleChange}
                  className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                    formData.isactive === 1 ? "bg-[#168A6F]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute h-4 w-4 bg-white rounded-full transition-transform ${
                      formData.isactive === 1 ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-[#636363]">
                  {formData.isactive === 1 ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-[14px] text-[#6F6F6F] bg-[#E4E4E4] hover:bg-[#C9C9C9] rounded-md flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 text-[14px] text-white bg-[#168A6F] hover:bg-[#11735C] rounded-md flex-1"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
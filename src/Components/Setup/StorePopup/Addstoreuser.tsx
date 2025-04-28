"use client";

import React, { FC, useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";

interface TableRow {
  storeid: number;
  storename: string;
  createdate: string;
  location: string;
  owner: string;
  county: string;
  royalty: string;
}

interface User {
  userid: number;
  email: string;
  firstname: string;
  lastname: string;
  islinked: number; // 1 if linked to store, 0 if not
}

interface AddStoreUserProps {
  initialData: TableRow;
  isOpenAddStore: boolean;
  setAddStore: (isOpen: boolean) => void;
}

const AddStoreUser: FC<AddStoreUserProps> = ({ initialData, isOpenAddStore, setAddStore }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // State for filtered users
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [loading, setLoading] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "..";
  };

  const openModal = () => {
    setIsOpen(true);
    fetchUsers();
  };

  const closeModal = () => {
    setIsOpen(false);
    setAddStore(false);
  };

  // Fetch users for the store
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getUsersByStore",
        storeid: initialData.storeid,
      });

      if (response?.status === 200 && response?.data?.users) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users); // Initialize filtered users
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch users",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setCustomToast({
        message: "Error fetching users",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on search query
    const filtered = users.filter((user) => {
      const fullName = `${user.firstname || ""} ${user.lastname || ""}`.toLowerCase().trim();
      const email = user.email.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });

    setFilteredUsers(filtered);
  };

  // Handle checkbox change
  const handleCheckboxChange = async (user: User) => {
    const isCurrentlyLinked = user.islinked === 1;
    const newLinkedStatus = !isCurrentlyLinked;

    try {
      if (newLinkedStatus) {
        // Insert store user
        const response: any = await sendApiRequest({
          mode: "insertStoreUser",
          user: user.userid,
          storeid: initialData.storeid,
        });

        if (response?.status === 200 && response?.data?.id) {
          setCustomToast({
            message: "User added to store successfully!",
            type: "success",
          });
          // Update local state
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.userid === user.userid ? { ...u, islinked: 1 } : u
            )
          );
          setFilteredUsers((prevFiltered) =>
            prevFiltered.map((u) =>
              u.userid === user.userid ? { ...u, islinked: 1 } : u
            )
          );
        } else {
          throw new Error(response?.message || "Failed to add user");
        }
      } else {
        // Delete store user
        const response: any = await sendApiRequest({
          mode: "deleteStoreUser",
          user: user.userid,
          storeid: initialData.storeid,
        });

        if (response?.status === 200 && response?.data?.success) {
          setCustomToast({
            message: "User removed from store successfully!",
            type: "success",
          });
          // Update local state
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.userid === user.userid ? { ...u, islinked: 0 } : u
            )
          );
          setFilteredUsers((prevFiltered) =>
            prevFiltered.map((u) =>
              u.userid === user.userid ? { ...u, islinked: 0 } : u
            )
          );
        } else {
          throw new Error(response?.message || "Failed to remove user");
        }
      }
    } catch (error) {
      console.error("Error updating store user:", error);
      setCustomToast({
        message: "Error updating store user",
        type: "error",
      });
    }
  };

  // Sync `isOpen` with `isOpenAddStore` prop
  useEffect(() => {
    setIsOpen(isOpenAddStore);
    if (isOpenAddStore) {
      fetchUsers();
    }
  }, [isOpenAddStore]);

  return (
    <>
      <ToastNotification message={customToast.message} type={customToast.type} />

      <div>
        <button onClick={openModal}>
          <img
            src="/images/users.svg"
            alt="Add user icon"
            className="flex justify-center items-center w-5 h-5 below-md:w-5 below-md:h-5"
          />
        </button>
      </div>

      {/* Dialog for the modal */}
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[500px] h-auto below-md:w-[94%] below-md:h-auto px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <div className="flex justify-center">
                <DialogTitle
                  as="h3"
                  className="text-[16px] font-bold leading-custom text-[#3D3D3D]"
                >
                  Store Allocation
                </DialogTitle>
              </div>
              <div className="flex justify-center">
                <h3 className="text-[12px] font-bold leading-custom text-[#3D3D3D]">
                  {initialData.storename + " - " + initialData.location}
                </h3>
              </div>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Cancel"
                className="absolute top-1.5 right-0 cursor-pointer"
              />
            </div>

            <div className="mt-4 ml-4 mr-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="text-center">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-[#636363]">
                  No users found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-[#0F1044] sticky text-[#FFFFFF] font-normal text-[15px]">
                    <tr>
                      <th className="text-left py-2 px-2"></th>
                      <th className="text-left py-2 px-2">Name</th>
                      <th className="text-left py-2 px-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => {
                      const fullName = user.firstname || user.lastname
                        ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
                        : "";
                      const truncatedName = truncateText(fullName, 15);
                      const truncatedEmail = truncateText(user.email, 20);

                      return (
                        <tr
                          key={user.userid}
                          className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                        >
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={user.islinked === 1}
                              onChange={() => handleCheckboxChange(user)}
                              className="h-4 w-4 text-[#168A6F] focus:ring-[#168A6F] border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-2 px-2 w-1/2">
  {!fullName ? (
    <span className="block text-lg">---</span>
  ) : fullName.length > 15 ? (
    <div className="group relative inline-block">
      {truncatedName}
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0 z-10">
        {fullName}
      </div>
    </div>
  ) : (
    truncatedName
  )}
</td>
<td className="py-2 px-2 w-1/2">
  {!user.email ? (
    <span className="block text-lg">---</span>
  ) : user.email.length > 20 ? (
    <div className="group relative inline-block">
      {truncatedEmail}
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-0 z-10">
        {user.email}
      </div>
    </div>
  ) : (
    truncatedEmail
  )}
</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddStoreUser;
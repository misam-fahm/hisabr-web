"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";

interface JsonData {
  mode: string;
  storename: string;
  location: string;
  owner: string;
  county: number | null;
  //royalty: number | null;
  storeid: number | null;
}

const EditStore = ({ initialData, setAddStore, isOpenAddStore }: any) => {
  const methods = useForm<any>({
    defaultValues: initialData, // Prepopulate form with existing data
  });

  //const [royalty, setRoyalty] = useState(initialData?.royalty);
  const [county, setCounty] = useState(initialData?.county);
  const [storeName, setStoreName] = useState(initialData?.storename);
  const [owner, setOwner] = useState(initialData?.owner);
  const [location, setLocation] = useState(initialData?.location);
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });


  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // const handleChange = (data: any) => {
  //   setRoyalty(data);
  //   methods.setValue("royalty", data);
  // };

  const handleChangeCounty = (data: any) => {
    setCounty(data);
    methods.setValue("county", data);
  };


  const handleChangesetStoreName = (data: any) => {
    setStoreName(data);
    methods.setValue("storeName", data);
  };

  const handleChangeUser = (data: any) => {
    setOwner(data);
    methods.setValue("owner", data);
  };


  const handleChangeLocation = (data: any) => {
    setLocation(data);
    methods.setValue("location", data);
  };


  const onSubmit = async (data: any) => {
    const jsonData: JsonData = {
      mode: "updateStore",
      storename: data?.storeName || "",
      location: data?.location || "",
      owner: data?.owner || "",
      county: data?.county || "",
     // royalty: data?.royalty || 0,
      storeid: initialData?.storeid
    };

    try {

      const result: any = await sendApiRequest(jsonData);
      if (!result || typeof result !== "object") {
        throw new Error("Invalid API response.");
      }

      const { status, data: responseData } = result;
      console.log("API Response:", result);

      setCustomToast({
        message: status === 200 ? "Item updated successfully!" : "Failed to add item.",
        type: status === 200 ? "success" : "error",
      });

      if (status === 200) {
        setCustomToast({
          message: status === 200 ? "Item updated successfully!" : "Failed to add item.",
          type: status === 200 ? "success" : "error",
        });
        setTimeout(() => {
          setAddStore(true);
          closeModal();
        }, 300);
      };
    } catch (error) {
      setCustomToast({ message: "Error adding item", type: "error" });
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>

      <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />

      <div>
        <button onClick={openModal}>
          <img
            src="/images/editpencilicon.svg"
            alt="Add icon"
            className="flex justify-center items-center  w-4 h-4 below-md:w-5 below-md:h-5"
          />
        </button>
      </div>

      {/* Dialog for the modal */}
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] h-auto below-md:w-[94%] below-md:h-auto px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <div className="flex justify-center">
                <DialogTitle
                  as="h3"
                  className="text-[16px]  font-bold leading-custom text-[#3D3D3D]"
                >
                  Edit Store
                </DialogTitle>
              </div>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Cancel"
                className="absolute top-1.5 right-0 cursor-pointer"
              />

            </div>


            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col mt-4 gap-4">
                  <div className="w-full flex">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Store Name"
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={storeName}
                      textColor="text-[#636363]"
                      {...methods?.register("storeName", {
                        required: "Store Name is required",
                      })}
                      errors={methods.formState.errors.storeName}
                      placeholder="Store Name"
                      variant="outline"
                      onChange={(e: any) =>
                        handleChangesetStoreName(e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Location"
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={location}
                      textColor="text-[#636363]"
                      {...methods?.register("location", {
                        required: "Location is required",
                      })}
                      errors={methods.formState.errors.location}
                      placeholder="Location"
                      variant="outline"
                      onChange={(e: any) =>
                        handleChangeLocation(e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Owner"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={owner}
                      textColor="text-gray-500"
                      {...methods?.register("owner", {
                        required: "Owner is required",
                      })}
                      errors={methods.formState.errors.owner}
                      placeholder="Owner"
                      variant="outline"
                      onChange={(e: any) => handleChangeUser(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="County"
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={county}
                      textColor="text-[#636363]"
                      {...methods?.register("county", {
                        required: "County is required",
                      })}
                      errors={methods.formState.errors.county}
                      placeholder="County"
                      variant="outline"
                      onChange={(e: any) => handleChangeCounty(e.target.value)}
                    />
                  </div>
                  {/* <div className="w-full flex mt-4">
                    <InputField
                      type="text"
                      label="Royalty"
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={royalty}
                      textColor="text-gray-500"
                      {...methods?.register("royalty", {
                        required: "Royalty is required",
                      })}
                      errors={methods.formState.errors.royalty}
                      placeholder="Royalty"
                      variant="outline"
                      onChange={(e: any) => handleChange(e.target.value)}
                    />
                  </div> */}

                  <div className="flex flex-col items-center py-4">
                    <div className="flex justify-between gap-3 items-center w-full">
                      <button
                        type="button"
                        className="px-4 py-2 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white md:text[13px] text-[14px] md:h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md "
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default EditStore;

"use client";
import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
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
  royalty: number | null;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}


const AddStore = ({ setAddStore }: any) => {
  const methods = useForm();
  const [royalty, setRoyalty] = useState("");
  const [county, setCounty] = useState("");
  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [owner, setOwner] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<CustomToast>({
    toastMessage: "",
    toastType: "",
  });

  const handleChange = (data: any) => {
    setRoyalty(data);
    methods.setValue("royalty", data);
  };

  const handleChangeCounty = (data: any) => {
    setCounty(data);
    methods.setValue("county", data);
  };

  const handleChangesetStoreName = (data: any) => {
    setStoreName(data);
    methods.setValue("storeName", data);
  }
  const handleChangeUser = (data: any) => {
    setOwner(data);
    methods.setValue("owner", data);
  };

  const handleChangeLocation = (data: any) => {
    setLocation(data);
    methods.setValue("location", data);
  };




  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false),
      setRoyalty(""),
      setCounty(""),
      setStoreName(""),
      setOwner("")

  };

  const onSubmit = async (data: any) => {
    setCustomToast({ toastMessage: "", toastType: "" });
    const jsonData: JsonData = {
      mode: "insertstore",
      storename: data?.storeName || "",
      location: data?.location || "",
      owner: data?.owner || "",
      county: data?.county || "",
      royalty: data?.royalty || 0,
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      if (!result || typeof result !== "object") {
        throw new Error("Invalid API response.");
      }

      const { status, data: responseData } = result;
      setTimeout(() => {
        setCustomToast({
          toastMessage: status === 200 ? "Item added successfully!" : "Failed to add item.",
          toastType: status === 200 ? "success" : "error",
        });
      }, 0);

      if (status === 200) {
        closeModal();
        setAddStore(true)
      }
    } catch (error: any) {
      setTimeout(() => {
        setCustomToast({
          toastMessage: error?.message,
          toastType: "error",
        });
      }, 0);
    }
  };


  return (
    <>
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <div className="hidden below-md:block justify-end fixed bottom-5 right-5">
        <button
          onClick={openModal}
          className="focus:outline-none flex items-center justify-center bg-[#168A6F]  w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/webaddicon.svg"
            alt=" Add Store"
            className="w-[18px] h-[18px]"
          />
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
        >
          <img className="" src="/images/webaddicon.svg" alt="" />
          Add Store
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
                  Add Store
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
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={owner}
                      textColor="text-[#636363]"
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
                      errors={methods.formState.errors.royalty}
                      placeholder="County"
                      variant="outline"
                      onChange={(e: any) => handleChangeCounty(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    <InputField
                      type="text"
                      label="Royalty"
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={royalty}
                      textColor="text-[#636363]"
                      {...methods?.register("royalty", {
                        required: "Royalty is required",
                      })}
                      errors={methods.formState.errors.royalty}
                      placeholder="Royalty"
                      variant="outline"
                      onChange={(e: any) => handleChange(e.target.value)}
                    />
                  </div>

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
                        Save
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

export default AddStore;

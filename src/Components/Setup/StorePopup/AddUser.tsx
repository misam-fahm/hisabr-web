"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";
import Dropdown from "@/Components/UI/Themes/DropDown";

interface JsonData {
  mode: string;
  storeid: number | null;
  email: string;
  usertype: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneno: string;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}

interface AddUserProps {
  setAddStore: (value: boolean) => void;
  onUserAdded: () => void; // Callback to notify parent of successful user addition
}

const AddUser = ({ setAddStore, onUserAdded }: AddUserProps) => {
  const methods = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<CustomToast>({
    toastMessage: "",
    toastType: "",
  });
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch stores for the dropdown
  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const stores = response?.data?.stores || [];
        const formattedStores = stores.map((store: any) => ({
          name: `${store.name} - ${store.location || "Unknown Location"}`,
          id: store.id,
        }));
        setStores(formattedStores);
        if (formattedStores.length > 0) {
          setSelectedStore(formattedStores[0]);
          methods.setValue("storeid", formattedStores[0].id);
        }
      } else {
        setCustomToast({
          toastMessage: response?.message || "Failed to fetch stores",
          toastType: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      setCustomToast({
        toastMessage: "Error fetching stores",
        toastType: "error",
      });
    }
  };

  useEffect(() => {
    getUserStore();
  }, []);

  const handleChangeEmail = (data: any) => {
    setEmail(data);
    methods.setValue("email", data);
  };

  const handleChangeFirstname = (data: any) => {
    setFirstname(data);
    methods.setValue("firstname", data);
  };

  const handleChangeLastname = (data: any) => {
    setLastname(data);
    methods.setValue("lastname", data);
  };

  const handleChangePassword = (data: any) => {
    setPassword(data);
    methods.setValue("password", data);
  };

  const handleChangeConfirmPassword = (data: any) => {
    setConfirmPassword(data);
    methods.setValue("confirmPassword", data);
  };

  const handleChangePhoneno = (data: any) => {
    setPhoneno(data);
    methods.setValue("phoneno", data);
  };

  const openModal = () => {
    setIsOpen(true);
    // Clear all input fields when opening the modal
    setEmail("");
    setFirstname("");
    setLastname("");
    setPassword("");
    setConfirmPassword("");
    setPhoneno("");
    setSelectedStore(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    methods.reset();
  };

  const closeModal = () => {
    setIsOpen(false);
    setEmail("");
    setFirstname("");
    setLastname("");
    setPassword("");
    setConfirmPassword("");
    setPhoneno("");
    setSelectedStore(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    methods.reset();
    setAddStore(false);
  };

  const onSubmit = async (data: any) => {
    setCustomToast({ toastMessage: "", toastType: "" });

    // Verify password and confirm password match
    if (data.password !== data.confirmPassword) {
      setCustomToast({
        toastMessage: "Passwords do not match",
        toastType: "error",
      });
      return;
    }

    const jsonData: JsonData = {
      mode: "insertUser",
      storeid: data?.storeid || null,
      email: data?.email || "",
      usertype: "U",
      password: data?.password || "",
      firstname: data?.firstname || "",
      lastname: data?.lastname || "",
      phoneno: data?.phoneno || "",
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      if (!result || typeof result !== "object") {
        throw new Error("Invalid API response.");
      }

      const { status } = result;
      setCustomToast({
        toastMessage: status === 200 ? "User added successfully!" : "Failed to add user.",
        toastType: status === 200 ? "success" : "error",
      });

      if (status === 200) {
        closeModal();
        setAddStore(true);
        onUserAdded(); // Notify parent to refresh data
      }
    } catch (error: any) {
      setCustomToast({
        toastMessage: error?.message || "Failed to add user",
        toastType: "error",
      });
    }
  };

  return (
    <>
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <div className="hidden below-md:block justify-end fixed bottom-16 right-5">
        <button
          onClick={openModal}
          className="focus:outline-none flex items-center justify-center bg-[#168A6F] w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/webaddicon.svg"
            alt="Add User"
            className="w-[18px] h-[18px]"
          />
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center"
        >
          <img className="" src="/images/webaddicon.svg" alt="" />
          Add User
        </button>
      </div>
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
                  className="text-[16px] font-bold leading-custom text-[#3D3D3D]"
                >
                  Add User
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
                <div className="flex flex-col mt-2 gap-3">
                  <div className="w-full flex">
                    <InputField
                      type="text"
                      label="First Name"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={firstname}
                      textColor="text-[#636363]"
                      {...methods.register("firstname", {
                        required: "First Name is required",
                      })}
                      errors={methods.formState.errors.firstname}
                      placeholder="First Name"
                      variant="outline"
                      onChange={(e: any) => handleChangeFirstname(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex">
                    <InputField
                      type="text"
                      label="Last Name"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={lastname}
                      textColor="text-[#636363]"
                      {...methods.register("lastname", {
                        required: "Last Name is required",
                      })}
                      errors={methods.formState.errors.lastname}
                      placeholder="Last Name"
                      variant="outline"
                      onChange={(e: any) => handleChangeLastname(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex">
                    <InputField
                      type="email"
                      label="Email"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={email}
                      textColor="text-[#636363]"
                      autoComplete="off"
                      {...methods.register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email address",
                        },
                      })}
                      errors={methods.formState.errors.email}
                      placeholder="Email"
                      variant="outline"
                      onChange={(e: any) => handleChangeEmail(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex">
                    <Controller
                      name="storeid"
                      control={methods.control}
                      rules={{ required: "Store is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <div className="w-full">
                          <Dropdown
                            options={stores}
                            selectedOption={selectedStore?.name || "Select Store"}
                            onSelect={(option: any) => {
                              setSelectedStore(option);
                              field.onChange(option.id);
                              setIsStoreDropdownOpen(false);
                            }}
                            isOpen={isStoreDropdownOpen}
                            toggleOpen={() => setIsStoreDropdownOpen((prev) => !prev)}
                            widthchange="w-full"
                          />
                          {error && (
                            <p className="text-red-500 text-xs mt-1">{error.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <div className="w-full flex relative">
                    <InputField
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={password}
                      textColor="text-[#636363]"
                      autoComplete="new-password"
                      {...methods.register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      errors={methods.formState.errors.password}
                      placeholder="Password"
                      variant="outline"
                      onChange={(e: any) => handleChangePassword(e.target.value)}
                    />
                    <img
                      src={showPassword ? "/images/cleye-user.svg" : "/images/eye-user.svg"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="cursor-pointer h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2"
                      alt="Toggle Password Visibility"
                    />
                  </div>
                  <div className="w-full flex relative">
  <InputField
    type="password"
    label="Confirm Password"
    borderClassName="border border-gray-300"
    labelBackgroundColor="bg-white"
    value={confirmPassword}
    textColor="text-[#636363]"
    {...methods.register("confirmPassword", {
      required: "Confirm Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    })}
    errors={methods.formState.errors.confirmPassword}
    placeholder="Confirm Password"
    variant="outline"
    onChange={(e: any) => handleChangeConfirmPassword(e.target.value)}
  />
</div>
                  <div className="w-full flex">
                    <InputField
                      type="tel"
                      label="Phone Number"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={phoneno}
                      textColor="text-[#636363]"
                      {...methods.register("phoneno", {
                        required: "Phone Number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Phone number must be 10 to 15 digits",
                        },
                      })}
                      errors={methods.formState.errors.phoneno}
                      placeholder="Phone Number"
                      variant="outline"
                      onChange={(e: any) => handleChangePhoneno(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center">
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
                        className="px-4 py-2 text-white md:text-[13px] text-[14px] md:h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md"
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

export default AddUser;
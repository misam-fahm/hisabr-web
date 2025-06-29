"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { InputField } from "@/Components/UI/Themes/InputField";
import Dropdown from "@/Components/UI/Themes/DropDown";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";

interface JsonData {
  mode: string;
  insurance: number;
  propertytax: number;
  rentmortgage: number;
  payroll: any;
  laborsalary: number;
  nuco2: number;
  trash: number;
  internet: number;
  par: number;
  royalty: number;
  waterbill: number;
  gasbill: number;
  repair: number;
  storeid: number;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}

const Page = () => {
  const router = useRouter();
  const methods = useForm();
  const { watch, setValue, clearErrors } = methods;

  //const selectedStore = watch("store");
  const [storeId, setStoreId] = useState(null); // No default storeId initially
  const [data, setData] = useState<any>();
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [toastKey, setToastKey] = useState(0);
  const [payrolltax, setPayrollTax] = useState(data?.payroll_tax || "");
  const [labouroperatsalary, setLabourOperatSalary] = useState(data?.labor_operat_salary_exp || "");
  const [rentMortgage, setRentMortgage] = useState(data?.rent_mortgage_exp || "");
  const [insurance, setInsurance] = useState(data?.insurance_exp || "");
  const [propertytax, setPropertyTax] = useState(data?.property_tax_exp || "");
  const [trash, setTrash] = useState(data?.trash || "");
  const [nucO2, setNUCO2] = useState(data?.nuco2 || "");
  const [internet, setInternet] = useState(data?.internet_exp || "");
  const [waterbill, setWaterBill] = useState(data?.water_bill_exp || "");
  const [gasbill, setGasBill] = useState(data?.gas_bill_exp || "");
  const [par, setPAR] = useState(data?.par || "");
  const [royalty, setRoyalty] = useState(data?.royalty || "");
  const [repair, setRepair] = useState(data?.repair_exp || "");
  const [loading, setLoading] = useState(true);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<any>({
    toastMessage: "",
    toastType: "",
  });


  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setCustomToast({
      toastMessage: message,
      toastType: "error",
    });
  };

  const handlePayrollTax = (data: any) => {

    setPayrollTax(data); // Update local state
    methods.setValue("payrolltax", parseFloat(data).toFixed(2), { shouldValidate: true });
  };


  const handleChangesetLabourSalary = (data: any) => {
    setLabourOperatSalary(data); // Update local state
    methods.setValue("laborsalary", data); // Update form state in react-hook-form
  };

  const handleChangesetRentMortgage = (data: any) => {
    setRentMortgage(data); // Update local state
    methods.setValue("rent", data); // Update form state in react-hook-form
  };

  const handleChangesetInsurance = (data: any) => {
    setInsurance(data); // Update local state
    methods.setValue("insurance", data); // Update form state in react-hook-form
  };

  const handleChangesetPropertyTax = (data: any) => {
    setPropertyTax(data); // Update local state
    methods.setValue("payrolltax", data); // Update form state in react-hook-form
  };

  const handleChangesetTrash = (data: any) => {
    setTrash(data); // Update local state
    methods.setValue("trash", data); // Update form state in react-hook-form
  };

  const handleChangeNUCO2 = (data: any) => {
    setNUCO2(data); // Update local state
    methods.setValue("nucO2", data); // Update form state in react-hook-form
  };

  const handleChangesetInternet = (data: any) => {
    setInternet(data); // Update local state
    methods.setValue("internet", data); // Update form state in react-hook-form
  };

  const handleChangewaterbill = (data: any) => {
    setWaterBill(data); // Update local state
    methods.setValue("waterbill", data); // Update form state in react-hook-form
  };

  const handleChangesetGasBill = (data: any) => {
    setGasBill(data); // Update local state
    methods.setValue("waterbill", data); // Update form state in react-hook-form
  };

  const handleChangePAR = (data: any) => {
    setPAR(data); // Update local state
    methods.setValue("par", data); // Update form state in react-hook-form
  };
  const handleChangeRoyalty = (data: any) => {
    setRoyalty(data); // Update local state
    methods.setValue("royalty", parseFloat(data).toFixed(2), { shouldValidate: true }); // Update form state in react-hook-form
  };

  const handleChangeRepair = (data: any) => {
    setRepair(data); // Update local state
    methods.setValue("repair", data); // Update form state in react-hook-form
  };

 const getUserStore = async () => {
  try {
    const response = await sendApiRequest({ mode: "getUserStore" });
    if (response?.status === 200) {
      const stores = response?.data?.stores || [];

      // Format store data as required
      const formattedStores = stores.map((store: any) => ({
        storeno: store?.name,
        name: `${store?.name} - ${store?.location || "Unknown Location"}`,
        id: store?.id,
      }));

      setStore(formattedStores);

      if (formattedStores.length > 0) {
        setSelectedOption(formattedStores[0]);
      }
    } else {
      handleError(response?.message);
    }
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};


  const verifyToken = async (token: string) => {
    try {
      const res: any = await sendApiRequest({
        token: token
      }, `auth/verifyToken`);
      res?.status === 200
        ? setIsVerifiedUser(true)
        : router.replace('/login');
    } catch (error) {
      router.replace('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      verifyToken(token);
    }
  }, []);

  useEffect(() => {
    if (isVerifiedUser) {
      getUserStore();
    }
  }, [isVerifiedUser]);
  
  const fetchData = async (storeId) => {
    if (!storeId) return; // Don't fetch data if storeId is not set
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getStoreConfig",
        storeid: storeId || 69,
        // storeid: methods.watch("storeId") || 69,
      });
      if (response?.status === 200) {
        const storeData = response?.data?.store[0] || {};
        console.log("au",storeData.id)
        setData(storeData);
        setPropertyTax((storeData.property_tax_exp ?? 0).toString());
        setLabourOperatSalary((storeData.labor_operat_salary_exp ?? 0).toString());
        setRentMortgage((storeData.rent_mortgage_exp ?? 0).toString());
        setPayrollTax(parseFloat(storeData.payroll_tax ?? 0).toFixed(2))
        setInsurance((storeData.insurance_exp ?? 0).toString());
        setTrash((storeData.trash ?? 0).toString());
        setNUCO2((storeData.nuco2 ?? 0).toString());
        setInternet((storeData.internet_exp ?? 0).toString());
        setWaterBill((storeData.water_bill_exp ?? 0).toString());
        setGasBill((storeData.gas_bill_exp ?? 0).toString());
        setPAR((storeData.par ?? 0).toString());
        setRoyalty(parseFloat(storeData.royalty ?? 0).toFixed(2));
        setRepair((storeData.repair_exp ?? 0).toString());
         setValue("store", storeId ? storeId : 69);
      } else {
        setCustomToast({
          ...customToast,
          toastMessage: response?.message,
          toastType: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    methods.setValue("store",selectedOption?.id ? selectedOption?.id : 69)
    fetchData(selectedOption?.id ? selectedOption?.id : 69); // Fetch data when storeId changes
  }, [selectedOption]);

  
  

  const onSubmit = async (data: any) => {
    try {
      const jsonData: JsonData = {
        mode: "updateStoreConfig",
        insurance: Number(insurance),
        propertytax: Number(propertytax),
        rentmortgage: Number(rentMortgage),
        payroll: parseFloat(payrolltax) || 0,
        laborsalary: Number(labouroperatsalary),
        nuco2: Number(nucO2),
        trash: Number(trash),
        internet: Number(internet),
        par: Number(par),
        royalty: parseFloat(royalty) || 0,
        waterbill: Number(waterbill),
        gasbill: Number(gasbill),
        repair: Number(repair),
        storeid: Number(data.store),
      };
  
      const result: any = await sendApiRequest(jsonData);
      const { status } = result;
  
      // Force re-render using unique key (timestamp)
      setToastKey(Date.now());
  
      setCustomToast({
        key: toastKey, // Unique key to force re-render
        toastMessage: status === 200 ? "Configuration Updated successfully!" : "Failed to Update Configuration",
        toastType: status === 200 ? "success" : "error",
      });
  
      if (status === 200) {
        fetchData(data.store);
        setData(result?.data || {});
        setInsurance(result?.data?.insurance || "");
        setPropertyTax(result?.data?.propertytax || "");
        setRentMortgage(result?.data?.rentMortgage || "");
        setPayrollTax(result?.data?.payrolltax || "");
        setLabourOperatSalary(result?.data?.labouroperatsalary || "");
        setNUCO2(result?.data?.nucO2 || "");
        setTrash(result?.data?.trash || "");
        setInternet(result?.data?.internet || "");
        setPAR(result?.data?.par || "");
        setRoyalty(result?.data?.royalty || "");
        setWaterBill(result?.data?.waterbill || "");
        setGasBill(result?.data?.gasbill || "");
        setRepair(result?.data?.repair || "");
      } else {
        console.error("API Error:", result);
        setCustomToast({
          key: toastKey, 
          toastMessage: result?.message || "Failed to update configuration.",
          toastType: "error",
        });
      }
    } catch (error: any) {
      console.error("Catch Error:", error);
      setCustomToast({
        key: toastKey,
        toastMessage: error?.message || "Something went wrong.",
        toastType: "error",
      });
    }
  };
  

  console.log(methods?.formState?.errors && JSON.stringify(
    Object.fromEntries(
      Object.entries(methods?.formState?.errors).map(([key, val]:any) => [key, val.message])
    )
  ));


  return (
    isVerifiedUser && <main
      className="max-h-[calc(100vh-50px)] below-lg:px-4 below-md:px-2 overflow-auto "
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full flex flex-col overflow-auto p-2 below-md:p-3"
        >
          {/* Desktop View */}
          <div className="bg-white px-8 below-md:px-5 py-4 rounded-lg shadow-lg">
            <p className="text-[12px] font-normal mt-1 below-md:mt-0 text-[#5E6366]">
              Streamline and configure operational expenses for accurate
              tracking
            </p>
            <div className="below-lg:flex pt-7 below-md:pt-6">
              <p className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366]">
                Select Store:
              </p>
              <Dropdown
                options={store}
                selectedOption={selectedOption?.name || "Store"}
                onSelect={(selectedOption: any) => {
                  setSelectedOption({
                    name: selectedOption.name,
                    id: selectedOption.id,
                  });
                  setIsStoreDropdownOpen(false);
                }}
                isOpen={isStoreDropdownOpen}
                toggleOpen={toggleStoreDropdown}
                widthchange="w-[25%] below-md:mt-4"
                {...methods.register("store", {
                  required: "Store Selection is required",
                })}
                errors={methods.formState.errors.store}
              />
            </div>
            <div className="below-lg:flex pt-7 below-md:pt-4">
              <p className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366]">
                Yearly Expenses:
              </p>
              <div className="below-lg:w-[25%] below-lg:mr-5 below-md:pt-4">
                <InputField
                  type="text"
                  label="Insurance"
                  borderClassName="border border-gray-300"
                  labelBackgroundColor="bg-white"
                  value={insurance}
                  textColor="text-[#636363]"
                  {...methods?.register("insurance", {
                    maxLength: 10, // Limit to 10 characters
                    pattern: /^[0-9]*$/, // Only numbers allowed
                  })}
                  errors={methods.formState.errors.insurance}
                  variant="outline"
                  onChange={(e) =>
                    handleChangesetInsurance(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                />
              </div>
              <div className="w-[25%] below-md:w-full below-md:pt-4">
                <InputField
                  type="text"
                  label="Property Tax"
                  borderClassName="border border-gray-300"
                  labelBackgroundColor="bg-white"
                  value={propertytax}
                  textColor="text-[#636363]"
                  placeholder="Property Tax"
                  {...methods?.register("propertytax", {
                    maxLength: 10, // Limit to 10 characters
                    pattern: /^[0-9]*$/, // Only numbers allowed
                  })}
                  errors={methods.formState.errors.propertytax}
                  variant="outline"
                  onChange={(e) =>
                    handleChangesetPropertyTax(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                />
              </div>
            </div>
            <div>
              <div className="below-lg:flex pt-7 below-md:pt-4">
                <p className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366]">
                  Monthly Expenses:
                </p>
                <div className="below-lg:w-[25%] below-lg:mr-5 below-md:pt-4">
                  <InputField
                    type="text"
                    label="Rent/Mortgage"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={rentMortgage}
                    textColor="text-[#636363]"
                    placeholder="Rent/Mortgage"
                    {...methods?.register("rentMortgage", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.rentMortgage}
                    variant="outline"
                    onChange={(e) =>
                      handleChangesetRentMortgage(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
                <div className="below-lg:w-[25%] below-md:w-full below-md:pt-4">

                <InputField
                    type="text"
                    label="Payroll Tax (%)"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={payrolltax}
                    textColor="text-[#636363]"
                    placeholder="Payroll Tax (%)"
                    {...methods?.register("payrolltax", {
                      maxLength: 5,
                      pattern: /^[0-9]*\.?[0-9]*$/,
                    })}
                    errors={methods.formState.errors.payrolltax}
                    variant="outline"
                    onChange={(e) =>
                      handlePayrollTax(
                        e.target.value          //.replace(/\D/g, "")
                          .replace(/[^0-9.]/g, "")
                        //.slice(0, 3)
                      )
                    }
                  />

                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Operator/Labour Salary"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={labouroperatsalary}
                    textColor="text-[#636363]"
                    placeholder="Labour Salary"
                    {...methods?.register("laboursalary", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.laboursalary}
                    variant="outline"
                    onChange={(e) =>
                      handleChangesetLabourSalary(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
              </div>
              <div className="below-lg:flex below-lg:mt-8">
                <div className="below-lg:w-[25%]  below-lg:ml-[16%] below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="NUCO2"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={nucO2}
                    textColor="text-[#636363]"
                    placeholder="NUCO2"
                    {...methods?.register("nucO2", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.nucO2}
                    variant="outline"
                    onChange={(e) =>
                      handleChangeNUCO2(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Trash"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={trash}
                    textColor="text-[#636363]"
                    placeholder="Trash"
                    {...methods?.register("trash", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.trash}
                    variant="outline"
                    onChange={(e) =>
                      handleChangesetTrash(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />

                </div>
                <div className="below-lg:w-[25%] below-lg:ml-5 below-md:pt-4">
                  <InputField
                    type="text"
                    label="Internet"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={internet}
                    textColor="text-[#636363]"
                    placeholder="Internet"
                    {...methods?.register("internet", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.internet}
                    variant="outline"
                    onChange={(e) =>
                      handleChangesetInternet(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
              </div>
              <div className=" flex below-lg:flex below-lg:mt-8 below-md:flex-col">
                <div className="below-lg:w-[25%]  below-lg:ml-[16%] below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="PAR"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={par}
                    textColor="text-[#636363]"
                    placeholder="PAR"
                    {...methods?.register("par", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.par}
                    variant="outline"
                    onChange={(e) =>
                      handleChangePAR(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
                <div className="below-lg:w-[25%] below-lg:ml-5  below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Royalty (%)"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={royalty}
                    textColor="text-[#636363]"
                    placeholder="Royalty"
                    {...methods?.register("royalty", {
                      maxLength: 5,
                      pattern: /^[0-9]*\.?[0-9]*$/,
                    })}
                    errors={methods.formState.errors.royalty}
                    variant="outline"
                    onChange={(e) =>
                      handleChangeRoyalty(
                        e.target.value          //.replace(/\D/g, "")
                          .replace(/[^0-9.]/g, "")
                        //.slice(0, 3)
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="below-lg:flex below-lg:pt-7 below-md:pt-4">
                <div className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366] below-lg:flex below-lg:flex-col below-lg:items-center relative below-lg:right-4">
                  <p className="below-lg:hidden">Other Expenses(Monthly):</p>
                  <p className="below-md:hidden">Other Expenses</p>
                  <p className="below-md:hidden">(Monthly):</p>
                </div>
                <div className="below-lg:w-[25%] below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Water Bill"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={waterbill}
                    textColor="text-[#636363]"
                    placeholder="Water Bill"
                    {...methods?.register("waterbill", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.waterbill}
                    variant="outline"
                    onChange={(e) =>
                      handleChangewaterbill(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Gas Bill"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={gasbill}
                    textColor="text-[#636363]"
                    placeholder="Gas Bill"
                    {...methods?.register("gasbill", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.gasbill}
                    variant="outline"
                    onChange={(e) =>
                      handleChangesetGasBill(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4 ">
                  <InputField
                    type="text"
                    label="Repair"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={repair}
                    textColor="text-[#636363]"
                    placeholder="Repair"
                    {...methods?.register("repair", {
                      maxLength: 10, // Limit to 10 characters
                      pattern: /^[0-9]*$/, // Only numbers allowed
                    })}
                    errors={methods.formState.errors.repair}
                    variant="outline"
                    onChange={(e) =>
                      handleChangeRepair(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                  />
                </div>
              </div>
              <div className="below-lg:flex below-lg:justify-end below-lg:mr-10 below-md:pt-4 below-lg:my-4">
                <button className="bg-[#168A6F] hover:bg-[#11735C] text-[13px]  font-medium text-white rounded-md  h-[35px] w-[118px]">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </main>
  );
};

export default Page;

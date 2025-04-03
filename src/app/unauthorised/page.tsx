// src/app/unauthorised/page.tsx
import { FC } from "react";
import Link from "next/link";

const Unauthorised: FC = () => {
  return (
    <main
      className="max-h-[calc(100vh-60px)] flex items-center justify-center overflow-auto"
      style={{
        scrollbarWidth: "thin",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <div className="flex flex-row below-md:flex-col-reverse below-md:ml-7 below-md:items-start justify-center items-center text-center">
        <div className="below-md:flex below-md:justify-center below-md:flex-col below-md:items-center below-md:mt-7">
          <img className="w-[50%]" src="/images/error.svg" />
          <Link href="/">
            <p className="below-lg:hidden text-[18px] tablet:hidden flex mt-7 items-center justify-center gap-2 cursor-pointer border-2 border-[#D32F2F] rounded-full h-[43px] w-[219px]">
              <img src="/images/404arrow.svg" alt="Back Arrow" />
              <span>Back To Home</span>
            </p>
          </Link>
        </div>

        <div className="flex flex-col items-center below-md:items-start">
          <p className="text-[#D32F2F] font-semibold text-[160px] below-md:text-[100px] tablet:text[100px]">
            403
          </p>
          <p className="text-[#D32F2F] -mt-7 font-medium text-[28px] below-md:text-[22px] tablet:text-[22px]">
            Access Denied
          </p>
          <p className="text-[#6C6C6C] font-normal text-[18px] below-md:text-[14px] tablet:text-[14px]">
            You do not have permission to access this page.
          </p>
          <Link href="/sales-kpi">
            <p className="below-md:hidden flex mt-7 items-center justify-center gap-2 cursor-pointer border-2 border-[#D32F2F] rounded-full h-[43px] w-[219px] text-[18px]">
              <img src="/images/404arrow.svg" alt="Back Arrow" />
              <span>Back To Home</span>
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Unauthorised;
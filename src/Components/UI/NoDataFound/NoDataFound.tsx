import React from 'react'

interface NoDataFoundProps {
  message?: string; // Optional custom message
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div className="max-w-sm w-full flex flex-col items-center">
        <img
          src="/images/nodatafound.svg"
          alt="No Data"
          className="w-32 h-32 mb-4 opacity-50"
        />
        <h3 className="text-[20px] font-medium text-[#636363]">No Data Found</h3>
        <p className="text-[14px] text-[#636363] text-center font-medium mt-1">
          {message || "Try adjusting your search or filter to find what you’re looking for."}
        </p>
      </div>

    </div>
  )
}

export default NoDataFound

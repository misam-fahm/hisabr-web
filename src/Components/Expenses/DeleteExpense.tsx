"use client";

import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const DeleteExpense = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    
  
  return (
    <>
      <div>
        <Button onClick={openModal}>
          <img
            src="/images/DeleteIcon.svg"
            className="flex justify-center text-left mr-10"
            width={30}
            height={30}
          />
        </Button>
      </div>
       {/* Dialog for the modal */}
        <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
             <DialogPanel className="w-[410px] h-[518px] below-md:w-[94%] below-md:h-[450px] px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
             <div className='flex items-center justify-between mb-5 mr-1'>
                <DialogTitle as="h3" className="text-[16px]  font-medium leading-4 text-[#5E6366]">
                    Delete Item    
               </DialogTitle>
               

                </div>
             </DialogPanel>
        </div>
        </Dialog>
    </>

   
  )
}

export default DeleteExpense

"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import Images from "../ui/Common/Image";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md">
      <div className="flex justify-end items-center p-2 w-full">
        <Images
          className="w-12 h-12 mr-4 rounded-full"
          src="/images/admin.png"
          alt="Admin"
        />
        <div className="flex flex-col below-md:hidden">
          <p className="text-[14px] font-semibold text-right">Saheel</p>
          <p className="text-[12px] font-medium">Admin</p>
        </div>

        <div
          className="ml-8 mr-4 cursor-pointer below-md:hidden"
          ref={dropdownRef}
        >
          <p
            onClick={handleToggle}
            className="w-10 h-10 flex items-center justify-center"
          >
            <img src="/images/More.svg" alt="Menu Icon" />
          </p>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-5 mr-2 pl-4 w-52 bg-white shadow-lg rounded-lg">
              <ul className="py-2">
                <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]">
                  <Images
                    src="/images/profile.svg"
                    className="inline-block mr-2"
                  />
                  My Profile
                </li>
                <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-[13px]">
                  <img
                    src="/images/logout2.svg"
                    className="inline-block mr-2"
                  />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Navbar;

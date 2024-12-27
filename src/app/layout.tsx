// app/layout.tsx
"use client";

import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/Components/drawer/navbar";
import Drawer from "@/Components/drawer/Drawer";
import { usePathname } from "next/navigation";
import { ToastContainer } from 'react-toastify';

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Admin Dashboard with Next.js",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname:any = usePathname();

  // Define routes where Navbar and Drawer should not be displayed
  const hideSidebarRoutes = ["/login", "/register" , "/forgotpassword"];

  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <html lang="en">
       <body className="w-full" >
        <div className="flex w-full ">
       
        {!shouldHideSidebar && <div className="w-auto" ><Drawer children={undefined} /></div> }
        <div  className="flex w-full flex-col">
        {!shouldHideSidebar && <div ><Navbar /></div> }
        <main  >{children}</main>
        <ToastContainer/>
        </div>
        </div>
      </body>
      
    </html>
  );
}




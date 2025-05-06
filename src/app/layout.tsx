"use client";

import "./globals.css";
import type { Metadata } from "next";
import Header from "@/Components/Header/header";
import Navbar from "@/Components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Admin Dashboard with Next.js",
// };

export default function RootLayout({   
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: any = usePathname();

  // Define routes where Navbar and Drawer should not be displayed
  const hideSidebarRoutes = ["/login", "/register", "/forgotpassword", "/resetpassword", "/changepassword"];

  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className="w-full">
        <div className="flex w-full ">
          {!shouldHideSidebar && (
            <div className="w-auto">
              <Navbar children={undefined} />
            </div>
          )}
          <div className="flex w-full flex-col">
            {!shouldHideSidebar && (
              <div>
                <Header />
              </div>
            )}
            <main>{children}</main>
            <ToastContainer />
          </div>
        </div>
      </body>
    </html>
  );
}

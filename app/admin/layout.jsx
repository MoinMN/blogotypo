"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Nav from "@components/Nav";
import Footer from "@components/Footer";
import Sidebar from "./_components/Sidebar";
import useIsTWA from "@lib/useIsTWA";

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const isTWA = useIsTWA();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const storedState = localStorage.getItem("sidebarOpen");
    if (storedState) {
      setIsSidebarOpen(JSON.parse(storedState));
    }
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    // Add a resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close sidebar on navigation for small screens
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [setIsSidebarOpen, isSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0d0d1a]">
      <Nav
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Sidebar with transition */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 h-screen w-48 md:w-64 shadow-lg bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out z-40`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow text-gray-100">
        <div className={`${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} min-h-fit md:p-6 max-md:p-3 transition-all duration-300 ease-in-out`}>
          {children}
        </div>
      </div>


      {/* Footer  */}
      {!isTWA &&
        <div className={`${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} mt-auto transition-all duration-300 ease-in-out`}>
          <Footer />
        </div>
      }
    </div>
  );
};

export default AdminLayout;

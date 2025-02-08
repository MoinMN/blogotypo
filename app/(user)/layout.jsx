"use client";

import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Sidebar from "./_components/Sidebar";
import Footer from "@components/Footer";

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load sidebar state from localStorage only after hydration
  useEffect(() => {
    setIsHydrated(true);
    const storedState = localStorage.getItem("sidebarOpen");
    setIsSidebarOpen(storedState !== null ? JSON.parse(storedState) : true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSidebarOpen !== null) {
      localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  // Prevent rendering until hydration is complete
  if (!isHydrated || isSidebarOpen === null) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Nav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Sidebar with transition */}
      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 h-screen bg-theme_5 w-48 md:w-64 shadow-lg transition-all duration-300 ease-in-out z-40`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <div
          className={`${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"} min-h-fit md:p-6 max-md:p-3 transition-all duration-300 ease-in-out`}
        >
          {children}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"} mt-auto transition-all duration-300 ease-in-out`}
      >
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;

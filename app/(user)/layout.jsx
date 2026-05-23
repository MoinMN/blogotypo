"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import Sidebar from "./_components/Sidebar";
import Footer from "@components/Footer";

const UserLayout = ({ children }) => {
  const sidebarRef = useRef(null);
  const navRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const storedState = localStorage.getItem("sidebarOpen");
    if (storedState !== null) {
      setIsSidebarOpen(JSON.parse(storedState));
    }
  }, []);

  const setSidebarAsPerDevice = () => {
    setIsSidebarOpen(window.innerWidth >= 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", setSidebarAsPerDevice);
    return () => window.removeEventListener("resize", setSidebarAsPerDevice);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isHydrated || !isSidebarOpen) return;
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current?.contains(e.target) ||
        navRef.current?.contains(e.target)
      )
        return;
      setSidebarAsPerDevice();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isHydrated, isSidebarOpen]);

  if (!isHydrated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0d0d1a]">

      {/* Navbar */}
      <Nav
        ref={navRef}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={setSidebarAsPerDevice}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed left-0 top-0 h-screen w-52 md:w-64
          shadow-xl dark:shadow-[4px_0_40px_rgba(0,0,0,0.4)]
          transition-all duration-300 ease-in-out z-40
        `}
      >
        <Sidebar setSidebarAsPerDevice={setSidebarAsPerDevice} />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-grow">
        <div
          className={`
            ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}
            p-3 md:p-6
            transition-all duration-300 ease-in-out
          `}
        >
          {children}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`
          ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}
          mt-auto transition-all duration-300 ease-in-out
        `}
      >
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
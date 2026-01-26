"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import Sidebar from "./_components/Sidebar";
import Footer from "@components/Footer";

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const sidebarRef = useRef(null);
  const navRef = useRef(null);


  // Load sidebar state from localStorage only after hydration
  useEffect(() => {
    setIsHydrated(true);
    const storedState = localStorage.getItem("sidebarOpen");
    setIsSidebarOpen(storedState !== null ? JSON.parse(storedState) : true);
  }, []);

  const setSidebarAsPerDevice = () => {
    if (window.innerWidth >= 1024) setIsSidebarOpen(true);
    else setIsSidebarOpen(false);
  };

  useEffect(() => {

    window.addEventListener("resize", setSidebarAsPerDevice);
    setSidebarAsPerDevice(); // Call once on mount

    return () => window.removeEventListener("resize", setSidebarAsPerDevice);
  }, []);

  useEffect(() => {
    if (isSidebarOpen !== null) {
      localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isHydrated) return;

    const handleClickOutside = (e) => {
      if (!isSidebarOpen) return;

      const clickedInsideSidebar =
        sidebarRef.current?.contains(e.target);
      const clickedInsideNav =
        navRef.current?.contains(e.target);

      if (!clickedInsideSidebar && !clickedInsideNav) {
        setSidebarAsPerDevice();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isHydrated]);


  // Prevent rendering until hydration is complete
  if (!isHydrated || isSidebarOpen === null) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Nav
        ref={navRef}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Sidebar with transition */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 h-screen bg-theme_5 w-48 md:w-64 shadow-lg transition-all duration-300 ease-in-out z-40`}
      >
        <Sidebar setSidebarAsPerDevice={setSidebarAsPerDevice} />
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

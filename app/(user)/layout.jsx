"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "../../components/Nav";
import Sidebar from "./_components/Sidebar";
import Footer from "@components/Footer";

const UserLayout = ({ children }) => {
  const sidebarRef = useRef(null);
  const navRef = useRef(null);

  // ✅ decide initial state safely
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    // ✅ read localStorage AFTER hydration
    const storedState = localStorage.getItem("sidebarOpen");
    if (storedState !== null) {
      setIsSidebarOpen(JSON.parse(storedState));
    }
  }, []);

  const setSidebarAsPerDevice = () => {
    setIsSidebarOpen(window.innerWidth >= 1024);
  };

  // ✅ resize only reacts, not initializes
  useEffect(() => {
    window.addEventListener("resize", setSidebarAsPerDevice);
    return () =>
      window.removeEventListener("resize", setSidebarAsPerDevice);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sidebarOpen",
      JSON.stringify(isSidebarOpen)
    );
  }, [isSidebarOpen]);

  // click outside
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isHydrated, isSidebarOpen]);

  // ✅ block render until hydration
  if (!isHydrated) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Nav
        ref={navRef}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div
        ref={sidebarRef}
        className={`${isSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
          } fixed left-0 top-0 h-screen bg-theme_5 w-48 md:w-64 shadow-lg transition-all duration-300 ease-in-out z-40`}
      >
        <Sidebar setSidebarAsPerDevice={setSidebarAsPerDevice} />
      </div>

      <div className="flex flex-col flex-grow">
        <div
          className={`${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
            } md:p-6 max-md:p-3 transition-all duration-300 ease-in-out`}
        >
          {children}
        </div>
      </div>

      <div
        className={`${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
          } mt-auto transition-all duration-300 ease-in-out`}
      >
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
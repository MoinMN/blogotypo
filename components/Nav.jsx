"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import SkeletonBox from "@components/Skeletons/Skeleton";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@context/ThemeContext";

const Nav = forwardRef(({ isSidebarOpen, setIsSidebarOpen }, ref) => {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();

  const router = useRouter();
  const isAdmin = usePathname().split("/").includes("admin");

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleEscapePress = (e) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };
    document.addEventListener("keydown", handleEscapePress);
    return () => document.removeEventListener("keydown", handleEscapePress);
  }, []);

  return (
    <nav
      ref={ref}
      className="
        bg-gray-50 dark:bg-[#0a0a14]
        border-b border-gray-200 dark:border-gray-100/[0.06]
        text-gray-900 dark:text-gray-100
        flex justify-between items-center
        px-4 md:px-8
        shadow-sm dark:shadow-[0_1px_20px_rgba(0,0,0,0.5)]
        z-50 top-0 sticky
      "
    >
      {/* Left */}
      <div className="flex items-center max-md:gap-4 md:gap-6 max-md:py-3.5 md:py-4">

        {/* Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex flex-col gap-[5px] cursor-pointer group p-1 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <span className="block h-[1.5px] w-6 bg-gray-400 dark:bg-gray-100/40 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400 transition-all duration-200 rounded-full" />
          <span className={`block h-[1.5px] bg-gray-400 dark:bg-gray-100/40 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400 transition-all duration-200 rounded-full ${isSidebarOpen ? "w-4" : "w-5"}`} />
          <span className={`block h-[1.5px] bg-gray-400 dark:bg-gray-100/40 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400 transition-all duration-200 rounded-full ${isSidebarOpen ? "w-2" : "w-4"}`} />
        </button>

        {/* Logo */}
        <Link
          href={`${session?.user?.role === "admin" ? "/admin" : ""}/dashboard`}
          style={{ textDecoration: "none" }}
          className="outline-none"
        >
          <span className="playwrite_in_font text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Blogotypo
          </span>
        </Link>

        {/* Admin pill */}
        {isAdmin && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-widest uppercase text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-2.5 py-1 rounded-full">
            <i className="fa-solid fa-shield-halved text-[8px]" />
            Admin
          </span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* 🌙 Theme Toggle Desktop */}
        <button
          onClick={toggleTheme}
          className="
            hidden md:flex
            items-center justify-center
            w-10 h-10 rounded-xl
            border border-gray-200 dark:border-gray-100/[0.08]
            bg-gray-100 dark:bg-[#111827]
            text-gray-500 dark:text-gray-100/60
            hover:text-indigo-600 dark:hover:text-indigo-300
            hover:bg-indigo-50 dark:hover:bg-indigo-500/10
            transition-all duration-200
          "
        >
          <i
            className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"
              } text-sm`}
          />
        </button>

        <div
          className="py-3.5 md:py-4 relative"
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          {status === "loading" ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <SkeletonBox width={100} height={16} />
              </div>

              <SkeletonBox width={36} height={36} circle={true} />
            </div>
          ) : session?.user ? (
            <button
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="hidden sm:block text-sm font-medium text-gray-500 dark:text-gray-100/50 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 montserrat_alternates_font">
                Hey, {session?.user.name}!
              </span>

              <div className="relative flex-shrink-0">
                <img
                  src={session?.user.image}
                  alt="Profile"
                  className="
              rounded-full w-9 h-9 md:w-10 md:h-10
              object-cover
              ring-2 ring-gray-200 dark:ring-gray-100/10
              group-hover:ring-indigo-400 dark:group-hover:ring-indigo-500/60
              transition-all duration-200
            "
                />

                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-gray-50 dark:border-[#0a0a14]" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => router.push("/user/login")}
              className="
          flex items-center gap-2
          max-md:px-3 md:px-5
          max-md:py-1 md:py-2
          bg-indigo-600 hover:bg-indigo-500
          text-gray-100 text-sm font-semibold
          rounded-xl transition-all duration-200
          shadow-sm shadow-indigo-200
          dark:shadow-[0_0_20px_rgba(99,91,255,0.3)]
        "
            >
              <i className="fa-solid fa-arrow-right-to-bracket text-xs" />
              Log In
            </button>
          )}

          {/* Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.07] rounded-2xl shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-40 md:w-48 p-2 z-50 overflow-hidden">

              {/* User Info */}
              <div className="max-md:px-2 md:px-3 max-md:py-0.5 md:py-2.5 mb-1 border-b border-gray-100 dark:border-gray-100/[0.06]">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {session?.user?.name}
                </p>

                <p className="text-[10px] text-gray-400 dark:text-gray-100/30 truncate">
                  {session?.user?.email}
                </p>
              </div>

              {/* Profile */}
              <Link
                href={`${session?.user?.role === "admin" ? "/admin" : ""}/profile`}
                style={{ textDecoration: "none" }}
              >
                <div className="flex items-center gap-2.5 max-md:px-2 md:px-3 py-2 text-sm text-gray-600 dark:text-gray-100/60 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl cursor-pointer transition-all duration-150 mt-0.5">
                  <i className="fa-solid fa-user text-xs w-3.5 text-center" />
                  Profile
                </div>
              </Link>

              {/* 🌙 Theme Toggle Mobile Only */}
              <button
                onClick={toggleTheme}
                className="md:hidden w-full flex items-center justify-between gap-2.5 max-md:px-2 md:px-3 py-2 text-sm text-gray-600 dark:text-gray-100/60 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all duration-150 mt-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <i
                    className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"
                      } text-xs w-3.5 text-center`}
                  />

                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </div>
              </button>

              {/* Divider */}
              <div className="my-1 border-t border-gray-100 dark:border-gray-100/[0.06]" />

              {/* Sign Out */}
              <button
                onClick={() => signOut({ callbackUrl: "/user/login" })}
                className="w-full flex items-center gap-2.5 max-md:px-2 md:px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-150 mt-0.5"
              >
                <i className="fa-solid fa-right-from-bracket text-xs w-3.5 text-center" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

export default Nav;
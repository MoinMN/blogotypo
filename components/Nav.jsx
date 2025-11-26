"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import SkeletonBox from "@components/Skeletons/Skeleton";
import { usePathname, useRouter } from "next/navigation";

const Nav = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = usePathname().split("/").includes("admin");

  // for show pop up
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
      className={`${
        isAdmin ? "bg-purple-400" : "bg-theme_4"
      } text-theme_1 flex justify-between items-center max-md:px-1 md:px-4 w-full shadow-md z-50 top-0 sticky`}
    >
      <div className="md:mx-6 max-md:mx-3 flex justify-center items-center max-md:gap-6 md:gap-14 max-md:py-3 md:py-6">
        <span
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex flex-col max-md:gap-1 md:gap-1.5 cursor-pointer"
        >
          <span className="border-2 w-6 md:w-8 rounded-full" />
          <span className="border-2 w-6 md:w-8 rounded-full" />
          <span className="border-2 w-6 md:w-8 rounded-full" />
        </span>

        <Link
          href={`${session?.user?.role === "admin" ? "/admin" : ""}/dashboard`}
          className="text-theme_1 no-underline outline-none focus:outline-none"
        >
          <h3 className="text-2xl md:text-5xl playwrite_in_font font-semibold">
            Blogotypo
          </h3>
        </Link>
      </div>

      <div
        className="max-md:px-6 max-md:py-3 md:py-6 md:px-12"
        onMouseLeave={() => setIsProfileOpen(false)}
      >
        <div className="flex items-center justify-center gap-3 cursor-pointer">
          {status === "loading" ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <SkeletonBox width={120} height={20} />
              </div>
              <SkeletonBox width={40} height={40} circle={true} />
            </div>
          ) : session?.user ? (
            <div
              className="flex items-center justify-center gap-3 cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="hidden sm:block text-base md:text-lg font-semibold montserrat_alternates_font">
                Hey, {session?.user.name}!
              </span>
              <img
                src={session?.user.image}
                alt="Profile Image"
                className="rounded-full border-2 shadow-lg w-10 h-10 md:w-14 md:h-14"
              />
            </div>
          ) : (
            <>
              <button
                onClick={() => router.push("/user/register")}
                className="bg-slate-50 hover:bg-slate-300 text-blue-500 md:px-6 max-md:px-3 md:py-1.5 max-md:py-1 shadow-md rounded-md transition-all duration-200 ease-in-out"
              >
                Sign Up
              </button>
              <button
                onClick={() => router.push("/user/login")}
                className="bg-blue-700 hover:bg-blue-900 md:px-6 max-md:px-3 md:py-1.5 max-md:py-1 shadow-md rounded-md transition-all duration-200 ease-in-out"
              >
                Log In
              </button>
            </>
          )}
        </div>

        {isProfileOpen && (
          <div className="absolute right-4 top-16 md:top-20 mt-1 bg-white flex flex-col gap-2 shadow-md rounded-lg w-36 md:w-44 md:p-4 max-md:p-2 z-30">
            <Link
              href={`${
                session?.user?.role === "admin" ? "/admin" : ""
              }/profile`}
              className="no-underline"
            >
              <span className="w-full flex gap-2 justify-start items-center text-center py-2 pl-4 text-sm md:text-base text-black rounded-lg hover:bg-gray-200 cursor-pointer">
                <i className="fa-solid fa-user" />
                Profile
              </span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/user/login" })}
              className="w-full flex gap-2 justify-start items-center text-center py-2 pl-4 text-sm md:text-base text-white rounded-lg bg-red-500 hover:bg-red-700"
            >
              <i className="fa-solid fa-right-from-bracket" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;

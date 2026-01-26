"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="bg-[#7673ff] sticky top-0 z-50 flex justify-around items-center md:py-6 max-md:py-4 text-white text-sm md:text-base lg:text-lg shadow-lg">
      {/* left */}
      <div className="">
        <h3 className="playwrite_in_font font-semibold text-xl md:text-3xl">
          Blogotypo
        </h3>
      </div>
      {/* center */}
      <div className="font-medium hidden md:block">
        <ul className="flex gap-8">
          <li className="cursor-pointer" onClick={() => scrollToSection("home")}>Home</li>
          <li className="cursor-pointer" onClick={() => scrollToSection("about")}>About Us</li>
          <li className="cursor-pointer" onClick={() => scrollToSection("features")}>Features</li>
          <li className="cursor-pointer" onClick={() => scrollToSection("explore")}>Explore</li>
          <li className="cursor-pointer" onClick={() => scrollToSection("why-blogotypo")}>Why Blogotypo?</li>
        </ul>
      </div>
      {/* right */}
      <div className="flex flex-wrap gap-4 md:gap-6">
        {status === "loading" ? (
          <div className="flex gap-3">
            <div className="animate-pulse bg-gray-300 md:w-28 max-md:w-20 md:h-9 max-md:h-8 rounded-md" />
            <div className="animate-pulse bg-gray-300 md:w-28 max-md:w-20 md:h-9 max-md:h-8 rounded-md" />
          </div>
        ) : session && session?.user ? (
          <>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-500 hover:bg-red-700 md:px-6 max-md:px-3 md:py-1.5 max-md:py-1 shadow-md rounded-md transition-all duration-200 ease-in-out"
            >
              Log Out
            </button>

            <button
              onClick={() =>
                router.push(
                  session?.user?.role === "user"
                    ? "/dashboard"
                    : "/admin/dashboard"
                )
              }
              className="bg-purple-700 hover:bg-purple-900 md:px-6 max-md:px-3 md:py-1.5 max-md:py-1 shadow-md rounded-md transition-all duration-200 ease-in-out"
            >
              Dashboard
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/user/register")}
              className="bg-white hover:bg-gray-200 text-purple-500 md:px-6 max-md:px-3 md:py-1.5 max-md:py-1 shadow-md rounded-md transition-all duration-200 ease-in-out"
            >
              Sign Up
            </button>

            <button
              onClick={() => router.push("/user/login")}
              className="bg-purple-700 hover:bg-purple-900 md:px-6 max-md:px-3 md:py-1.5 max-md:py-1 shadow-md rounded-md transition-all duration-200 ease-in-out"
            >
              Log In
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

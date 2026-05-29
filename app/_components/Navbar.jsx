"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@context/ThemeContext";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Features", id: "features" },
    { label: "Explore", id: "explore" },
    { label: "Why Us", id: "why-blogotypo" },
  ];

  return (
    <nav
      className={`
        sticky top-0 z-50 transition-all duration-300
        bg-gray-50 dark:bg-[#0a0a14]
        border-b border-gray-100 dark:border-gray-100/5
        ${scrolled
          ? "backdrop-blur-xl bg-gray-50/50 dark:bg-[#0a0a14]/50 shadow-md dark:shadow-[0_2px_30px_rgba(99,91,255,0.15)] will-change-[backdrop-filter]"
          : ""
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <button onClick={() => scrollToSection("home")} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-indigo-400/40 group-hover:ring-indigo-500 transition-all duration-300">
            <Image src="/assets/images/favicon.jpg" width={32} height={32} alt="Blogotypo" className="w-full h-full object-cover" />
          </div>
          <span className="playwrite_in_font text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
            Blogotypo
          </span>
        </button>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center justify-center gap-1">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-md hover:bg-gray-100 dark:hover:bg-gray-50/5 transition-all duration-200"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right: Theme toggle + Auth */}
        <div className="hidden md:flex items-center gap-3">

          {status === "loading" ? (
            <>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-50/10 w-24 h-9 rounded-lg" />
              <div className="animate-pulse bg-gray-200 dark:bg-gray-50/10 w-24 h-9 rounded-lg" />
            </>
          ) : session?.user ? (
            <>
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-100/10 text-gray-500 dark:text-gray-400 transition-all duration-200"
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`} />
              </button>
              <button
                onClick={() => router.push(session.user.role === "user" ? "/dashboard" : "/admin/dashboard")}
                className="px-4 py-2 text-sm font-semibold text-gray-100 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all duration-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-100/10 text-gray-500 dark:text-gray-400 transition-all duration-200"
              >
                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`} />
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-100/10 hover:border-gray-400 dark:hover:border-gray-100/30 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all duration-200"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-4 py-2 text-sm font-semibold text-gray-100 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all duration-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-100/10 text-gray-500 dark:text-gray-400 transition-all duration-200"
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-sm`} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-50/5 transition-colors"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-50 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-50 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-50 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-96 border-t border-gray-100 dark:border-gray-100/10" : "max-h-0"}`}>
        <div className="px-4 py-4 flex flex-col gap-1 bg-gray-50 dark:bg-[#0a0a14]">
          {navLinks.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="text-left px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-50/5 rounded-lg transition-all duration-200"
            >
              {label}
            </button>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-100/10 mt-2 pt-3 flex flex-col gap-2">
            {status !== "loading" && (
              session?.user ? (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); router.push(session.user.role === "user" ? "/dashboard" : "/admin/dashboard"); }}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-100 bg-indigo-600 rounded-lg"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2.5 text-sm font-semibold text-red-500 border border-red-200 dark:border-red-500/30 rounded-lg"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); router.push("/login"); }}
                    className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-100/10 rounded-lg"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); router.push("/register"); }}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-100 bg-indigo-600 rounded-lg"
                  >
                    Sign Up
                  </button>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
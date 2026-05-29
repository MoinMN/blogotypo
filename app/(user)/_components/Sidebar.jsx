"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ setSidebarAsPerDevice }) => {
  const pathname = usePathname();

  const lists = [
    { name: "Home", icon: "fa-solid fa-house", path: "/dashboard" },
    { name: "Search", icon: "fa-solid fa-magnifying-glass", path: "/blog/search" },
    { name: "Category", icon: "fa-solid fa-list", path: "/blog/category" },
    { name: "My Blogs", icon: "fa-solid fa-book-open", path: "/my-blogs" },
    { name: "Publish Blog", icon: "fa-solid fa-pen-nib", path: "/publish-blog" },
    { name: "Help & Support", icon: "fa-solid fa-address-book", path: "/contact" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <aside className="flex flex-col h-full bg-gray-50 dark:bg-[#0a0a14] border-r border-gray-200 dark:border-gray-100/[0.06] overflow-hidden">

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-grow mt-20 overflow-y-auto">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-100/20 px-3 mb-2">
          Menu
        </p>

        {lists.map((nav, index) => {
          const active = isActive(nav.path);
          return (
            <Link
              key={index}
              onClick={setSidebarAsPerDevice}
              href={nav.path}
              style={{ textDecoration: "none" }}
              className={`
                relative overflow-hidden
                flex items-center gap-3
                px-3 py-2.5 rounded-xl
                text-sm font-medium
                border
                transition-all duration-300 ease-out
                group
                  ${active
                      ? `
                      bg-indigo-50
                      dark:bg-indigo-500/[0.10]
                      text-indigo-600
                      dark:text-indigo-300
                      border-indigo-200
                      dark:border-indigo-500/20
                      shadow-sm
                      dark:shadow-indigo-500/5
                    `:`
                      text-gray-500
                      dark:text-gray-400
                      bg-transparent
                      hover:bg-gray-100
                      dark:hover:bg-gray-100/[0.04]
                      hover:text-gray-900
                      dark:hover:text-gray-100
                      border-transparent
                      dark:border-gray-100/[0.03]
                      hover:border-gray-200
                      dark:hover:border-gray-100/[0.06]
                    `
                  }
                `}
            >

              {/* Active glow */}
              {active && (
                <div className="
                  absolute inset-0
                  bg-gradient-to-r
                  from-indigo-500/[0.04]
                  to-transparent
                  dark:from-indigo-400/[0.06]
                  pointer-events-none
                " />
              )}

              {/* Icon container */}
              <div
                className={`
                relative z-10
                w-8 h-8 rounded-lg
                flex items-center justify-center
                flex-shrink-0
                transition-all duration-300

                ${active
                    ? `
                    bg-indigo-100
                    dark:bg-indigo-500/15

                    shadow-sm
                    dark:shadow-indigo-500/10
                  `
                    : `
                    bg-gray-100
                    dark:bg-gray-100/[0.04]

                    group-hover:bg-gray-200
                    dark:group-hover:bg-gray-100/[0.08]
                  `
                  }
              `}
              >
                <i
                  className={`
                    ${nav.icon}
                    text-[12px]
                    transition-colors duration-300

                      ${active
                      ? `
                        text-indigo-500
                        dark:text-indigo-400
                      `
                      : `
                        text-gray-400
                        dark:text-gray-500

                        group-hover:text-gray-700
                        dark:group-hover:text-gray-300
                      `
                    }
                `}
                />
              </div>

              {/* Nav text */}
              <span className="relative z-10 flex-1 tracking-[0.01em]">
                {nav.name}
              </span>

              {/* Active indicator */}
              {active && (
                <span className="
                  relative z-10
                  w-1.5 h-1.5 rounded-full
                  bg-indigo-500 dark:bg-indigo-400
                  shadow-[0_0_10px_rgba(99,102,241,0.8)]
                  flex-shrink-0
                " />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom accent */}
      <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-100/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-px bg-indigo-400 dark:bg-indigo-500/60" />
          <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-100/20">
            Blogotypo © 2026
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
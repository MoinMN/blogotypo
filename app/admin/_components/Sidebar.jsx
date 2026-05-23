"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const lists = [
    {
      name: "Home",
      icon: "fa-solid fa-house",
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: "fa-solid fa-users",
      path: "/admin/users",
    },
    {
      name: "Blogs",
      icon: "fa-solid fa-blog",
      path: "/admin/blogs",
    },
    {
      name: "Contact",
      icon: "fa-solid fa-address-card",
      path: "/admin/contacts",
    },
  ];

  return (
    <aside
      className="
        h-full flex flex-col
        bg-gray-50 dark:bg-[#0f172a]
        border-r border-gray-200 dark:border-gray-100/[0.06]
        max-md:px-3 md:px-4
        max-md:py-4 md:py-5
      "
    >

      {/* Navigation */}
      <div className="flex flex-col gap-1.5 mt-20">
        {lists.map((nav, index) => {
          const active = pathname === nav.path;

          return (
            <Link
              key={index}
              href={nav.path}
              className={`
                no-underline
                flex items-center gap-3
                rounded-2xl
                px-3 py-2.5
                transition-all duration-200
                border
                group
                ${active
                  ? `
                      bg-indigo-50 dark:bg-indigo-500/[0.12]
                      border-indigo-200 dark:border-indigo-500/20
                      text-indigo-600 dark:text-indigo-300
                      shadow-sm
                    `
                  : `
                      bg-transparent
                      border-transparent
                      text-gray-500 dark:text-gray-100/45
                      hover:bg-gray-100 dark:hover:bg-gray-100/[0.04]
                      hover:text-gray-900 dark:hover:text-gray-100
                    `
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  w-9 h-9 rounded-xl
                  flex items-center justify-center
                  transition-all duration-200
                  flex-shrink-0
                  ${active
                    ? `
                        bg-indigo-100 dark:bg-indigo-500/20
                        text-indigo-600 dark:text-indigo-300
                      `
                    : `
                        bg-gray-100 dark:bg-gray-100/[0.04]
                        text-gray-400 dark:text-gray-100/30
                        group-hover:bg-gray-200 dark:group-hover:bg-gray-100/[0.08]
                        group-hover:text-gray-700 dark:group-hover:text-gray-100/70
                      `
                  }
                `}
              >
                <i className={`${nav.icon} text-sm`} />
              </div>

              {/* Name */}
              <span className="text-sm md:text-[15px] font-medium flex-1">
                {nav.name}
              </span>

              {/* Active Dot */}
              {active && (
                <span
                  className="
                    w-1.5 h-1.5 rounded-full
                    bg-indigo-500 dark:bg-indigo-400
                    flex-shrink-0
                  "
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div
        className="
          mt-auto
          pt-4
          text-[11px]
          text-center
          text-gray-400 dark:text-gray-100/25
        "
      >
        Blogotypo Admin v2.0
      </div>
    </aside>
  );
};

export default Sidebar;
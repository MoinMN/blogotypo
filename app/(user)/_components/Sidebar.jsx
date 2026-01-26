import Link from "next/link";

// user sidebar
const Sidebar = ({ setSidebarAsPerDevice }) => {
  const lists = [
    { name: "Home", icon: "fa-solid fa-house", path: "/dashboard" },
    { name: "Search", icon: "fa-solid fa-magnifying-glass", path: "/blog/search" },
    { name: "Category", icon: "fa-solid fa-list", path: "/blog/category" },
    { name: "My Blogs", icon: "fa-solid fa-book-open", path: "/my-blogs" },
    { name: "Publish Blog", icon: "fa-solid fa-pen-nib", path: "/publish-blog" },
    { name: "Help & Support", icon: "fa-solid fa-address-book", path: "/contact" },
  ];

  return (
    <aside className="py-2 text-base md:text-lg text-theme_1 flex flex-col h-full">
      <Link onClick={setSidebarAsPerDevice} href="/dashboard" className="text-theme_1 no-underline text-center">
        <h3 className="text-2xl md:text-4xl playwrite_in_font font-semibold max-md:mb-12 md:mb-20">
          Blogotypo
        </h3>
      </Link>
      <div className="flex flex-col flex-grow gap-8 md:my-4 max-md:ml-6 md:ml-10">

        {lists.map((nav, index) => (
          <Link onClick={setSidebarAsPerDevice} key={index} href={nav.path} className="no-underline text-theme_1">
            <li className="flex items-center max-md:gap-3 md:gap-4">
              <i className={`${nav.icon} text-xl md:text-2xl`} />
              {nav.name}
            </li>
          </Link>
        ))}

      </div>
      {/* 
      <div className="mt-auto max-md:ml-6 md:ml-10 mb-16 md:mb-6">
        <Link onClick={setSidebarAsPerDevice} href="/contact" className="no-underline list-none text-theme_1">
          <li className="flex items-center max-md:gap-3 md:gap-4">
            <i className="fa-solid fa-address-book text-xl md:text-2xl" />
            Contact Us
          </li>
        </Link>
      </div> */}
    </aside>
  );
};

export default Sidebar;

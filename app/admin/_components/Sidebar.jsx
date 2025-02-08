import Link from "next/link";

const Sidebar = () => {
  const lists = [
    { name: "Home", icon: "fa-solid fa-house", path: "/admin/dashboard" },
    { name: "Users", icon: "fa-solid fa-users", path: "/admin/users" },
    { name: "Blogs", icon: "fa-solid fa-blog", path: "/admin/blogs" },
    { name: "Contact", icon: "fa-solid fa-address-card", path: "/admin/contacts" },
  ];

  return (
    <aside className="py-2 text-base md:text-lg text-theme_1 flex flex-col h-full">
      <Link href="/dashboard" className="text-theme_1 no-underline text-center">
        <h3 className="text-2xl md:text-4xl playwrite_in_font font-semibold max-md:mb-12 md:mb-20">
          Blogotypo
        </h3>
      </Link>
      <div className="flex flex-col flex-grow gap-8 md:my-4 max-md:ml-6 md:ml-10">

        {lists.map((nav, index) => (
          <Link key={index} href={nav.path} className="no-underline text-theme_1">
            <li className="flex items-center max-md:gap-3 md:gap-4">
              <i className={`${nav.icon} text-xl md:text-2xl`} />
              {nav.name}
            </li>
          </Link>
        ))}

      </div>
    </aside>
  );
};

export default Sidebar;

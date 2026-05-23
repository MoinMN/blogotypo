import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  const isAdmin = pathname.split('/').includes('admin');

  const companyLinks = [
    { label: "Term & Conditions", href: "/docs/term-and-conditions" },
    { label: "Privacy Policy", href: "/docs/privacy-policy" },
    { label: "License", href: "/docs/license" },
  ];

  const helpLinks = [
    { label: "FAQ", href: "/docs/faq" },
    { label: "Contact Us", href: "/contact" },
  ];

  const socialLinks = [
    { icon: "fa-brands fa-square-facebook", href: "https://www.facebook.com/profile.php?id=61572440573847", color: "hover:text-blue-500" },
    { icon: "fab fa-twitter", href: "https://x.com/MoinMN5", color: "hover:text-sky-400" },
    { icon: "fab fa-instagram", href: "https://www.instagram.com/im_moin45", color: "hover:text-pink-500" },
    { icon: "fa-brands fa-linkedin", href: "https://www.linkedin.com/in/moinnaik", color: "hover:text-blue-600" },
    { icon: "fa-brands fa-square-github", href: "https://www.github.com/MoinMN", color: "hover:text-gray-900 dark:hover:text-gray-100" },
  ];

  return (
    <footer className={`${isAdmin
      ? "bg-gray-100 dark:bg-[#0d0d1a]"
      : "bg-gray-100 dark:bg-[#070710]"
      } border-t border-gray-200 dark:border-gray-100/5 text-gray-500`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-16">

        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-6 mb-8 md:mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <Image src="/assets/icons/favicon.ico" width={36} height={36} alt="Blogotypo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 playwrite_in_font" style={{ fontFamily: "'Playfair Display', serif" }}>
                Blogotypo
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              A free, modern blogging platform for writers, thinkers, and creators. Available on web and Android.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-6 md:gap-8">
            {/* Company */}
            <div>
              <h5 className="text-gray-900 dark:text-gray-100 text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">Company</h5>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {companyLinks.map(({ label, href }) => (
                  <li key={label} className="p-0 m-0">
                    <Link href={href} target="_blank" style={{ textDecoration: 'none' }} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-xs md:text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h5 className="text-gray-900 dark:text-gray-100 text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">Help</h5>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {helpLinks.map(({ label, href }) => (
                  <li key={label} className="p-0 m-0">
                    <Link href={href} style={{ textDecoration: 'none' }} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-xs md:text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Developer */}
            <div>
              <h5 className="text-gray-900 dark:text-gray-100 text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">Developer</h5>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {[
                  { label: "Portfolio", href: "https://www.moinnaik.in/" },
                  { label: "LinkedIn", href: "https://linkedin.com/in/moinnaik" },
                  { label: "GitHub", href: "https://github.com/MoinMN" },
                ].map(({ label, href }) => (
                  <li key={label} className="p-0 m-0">
                    <Link href={href} target="_blank" style={{ textDecoration: 'none' }} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-xs md:text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-gray-200 dark:border-gray-100/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} Blogotypo. Developed & maintained by{" "}
            <Link href="https://linkedin.com/in/moinnaik" target="_blank" style={{ textDecoration: 'none' }} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-gray-100 font-semibold transition-colors duration-200">
              Moin MN
            </Link>.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon, href, color }) => (
              <Link key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className={`text-gray-400 ${color} text-lg transition-colors duration-200`}>
                <i className={icon} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
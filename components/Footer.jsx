import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  const isAdmin = pathname.split('/').includes('admin');

  return (
    <footer className={`${isAdmin ? 'bg-purple-200' : 'bg-theme_2'} bottom-0 md:px-4 md:py-8 max-md:px-2 max-md:py-4 text-gray-600 shadow-xl`}>

      <div className="flex max-sm:justify-center sm:justify-between items-center flex-wrap gap-3 mb-3">
        <div className="flex gap-4 items-center">
          <Image
            src='/assets/icons/favicon.ico'
            width={60}
            height={60}
            alt="Blogotypo"
            className="rounded-2xl shadow-md"
          />
          <h3 className="text-2xl md:text-3xl text-white playwrite_in_font font-semibold select-none">
            Blogotypo
          </h3>
        </div>

        <div className="montserrat_alternates_font text-center font-semibold text-sm md:text-base">
          <span className="">
            Developed & Maintain By{` `}
            <Link
              href="https://linkedin.com/in/moinnaik"
              target="_blank"
              className="cursor-pointer text-gray-600 no-underline">
              <span className="font-extrabold hover:text-blue-700 transition-all duration-300 ease-in-out">
                Moin MN
              </span>
            </Link>
          </span>
        </div>
      </div>

      <hr className="border border-gray-300" />

      <div className="flex justify-evenly gap-3 flex-wrap mt-3">
        {/* company section  */}
        <div className="flex flex-col gap-1">
          <h5 className="font-semibold text-sm md:text-base">
            Company
          </h5>
          <ul className="text-xs md:text-sm flex flex-col gap-2 pl-0 list-none">
            <li className="">
              <Link href='/docs/term-and-conditions' target="_blank" className="text-gray-600 no-underline">
                Term & Conditions
              </Link>
            </li>
            <li className="">
              <Link href='/docs/privacy-policy' target="_blank" className="text-gray-600 no-underline">
                Privacy Policy
              </Link>
            </li>
            <li className="">
              <Link href='/docs/license' target="_blank" className="text-gray-600 no-underline">
                License
              </Link>
            </li>
          </ul>
        </div>

        {/* help section  */}
        <div className="flex flex-col gap-1">
          <h5 className="font-semibold text-sm md:text-base">
            Help
          </h5>
          <ul className="text-xs md:text-sm flex flex-col gap-2 pl-0 list-none">
            <li className="">
              <Link href='/docs/faq' target="_blank" className="text-gray-600 no-underline">
                FAQ
              </Link>
            </li>
            <li className="">
              <Link href='/contact' className="text-gray-600 no-underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>


        {/* links section  */}
        <div className="">
          <h5 className="font-semibold text-sm md:text-base">
            Get Touch!
          </h5>

          <div className="flex space-x-2 md:space-x-4 text-xl md:text-3xl">
            <Link href="https://www.facebook.com/profile.php?id=61572440573847" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-square-facebook text-blue-600 hover:text-blue-800" />
            </Link>
            <Link href="https://x.com/MoinMN5" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter text-blue-400 hover:text-blue-600" />
            </Link>
            <Link href="https://www.instagram.com/im_moin45" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram text-pink-500 hover:text-pink-700" />
            </Link>
            <Link href="https://www.linkedin.com/in/moinnaik" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin text-blue-700 hover:text-blue-800" />
            </Link>
            <Link href="https://www.github.com/MoinMN" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-square-github text-gray-900 hover:text-gray-700" />
            </Link>
          </div>
        </div>

      </div>

    </footer>
  )
}

export default Footer

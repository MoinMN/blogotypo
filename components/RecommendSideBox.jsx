import Link from "next/link";
import { formatDateForBlog } from "./FormatDate";
import { usePathname } from "next/navigation";


const RecommendSideBox = ({ header, blogs }) => {
  return (
    <>
      <div className="border border-black rounded-md md:p-2 max-md:p-1 shadow-md">
        <h3
          className="text-lg md:text-2xl montserrat_alternates_font font-semibold border-b border-black md:mb-3 max-md:mb-2 flex items-center gap-2"
          onMouseOver={(e) => {
            e.currentTarget.getElementsByTagName('i')[0].classList.add("fa-shake");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.getElementsByTagName('i')[0].classList.remove("fa-shake");
          }}
        >
          <i className="fa-solid fa-link" />
          {header}
        </h3>
        <div className="flex flex-col gap-2 md:gap-4">
          {blogs?.map((blog, index) => (
            <Link
              href={'/blog' + `/${blog?.slug}`}
              key={index}
              className="grid grid-cols-3 gap-2 md:gap-3 no-underline text-black transition-all duration-300 ease-in-out"
              onMouseEnter={(e) => {
                const paragraph = e.currentTarget.getElementsByTagName("p")[0];
                if (paragraph) {
                  paragraph.style.textDecoration = "underline";
                  paragraph.style.color = 'blue';
                }
              }}
              onMouseLeave={(e) => {
                const paragraph = e.currentTarget.getElementsByTagName("p")[0];
                if (paragraph) {
                  paragraph.style.textDecoration = "none";
                  paragraph.style.color = 'black';
                }
              }}
            >
              <img
                src={blog.thumbnail_image}
                alt="Thumbnail Image"
                className="h-full w-full rounded-md shadow-md col-span-1"
              />
              <div className="flex flex-col justify-around text-sm md:text-base col-span-2 transition-all duration-300 ease-in-out">
                <p className="font-semibold ">
                  {blog.title.length > 60 ? `${blog.title.substring(0, 60)}...` : blog.title}
                </p>
                <span className="italic font-extralight text-gray-500">
                  {formatDateForBlog(blog.date)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default RecommendSideBox

import BackButton from "@components/BackButton";
import { H1Header } from "@components/Header";
import CategoryBox from "./_components/CategoryBox";
import { createMetadata } from "@lib/metadataClient";
import categories from "./_components/ListAllCategories";

export const metadata = createMetadata({
  title: "Browse Blog Categories - Blogotypo",
  description:
    "Explore all blog categories on Blogotypo including technology, business, lifestyle, sports, entertainment, education, health, finance, and more.",
  slug: "/blog/category",
});

const CategoryPages = () => {


  return (
    <div className="max-w-7xl mx-auto max-md:px-3 md:px-6 max-md:py-5 md:py-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 max-md:mb-5 md:mb-8">
        <div className="flex items-center gap-3">
          <BackButton />

          <div>
            <div className="flex items-center gap-2 max-md:mb-1 md:mb-1.5">
              <div className="w-6 h-px bg-indigo-500" />
              <span className="text-indigo-500 dark:text-indigo-400 max-md:text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em]">
                Explore
              </span>
            </div>

            <H1Header>
              Categories
            </H1Header>
          </div>
        </div>
      </div>

      {/* ── Categories Grid ── */}
      <div
        className="
          grid 
          grid-cols-2 
          md:grid-cols-4 
          lg:grid-cols-5
          max-md:gap-3 
          md:gap-5
        "
      >
        {categories.map((category, index) => (
          <CategoryBox category={category} key={index} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPages;
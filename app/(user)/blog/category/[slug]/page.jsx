import { createMetadata } from "@lib/metadataServer";
import CategoryPage from "../_components/CategoryPage";
import categories from "../_components/ListAllCategories";
const ITEMS_PER_PAGE = 10;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const categoryName = slug
    ?.split("-")
    ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");

  if (!categoryName) {
    return createMetadata({
      title: "Blogotypo",
      description: "Create your own blogs now!",
    });
  }

  return createMetadata({
    title: `${categoryName} Blogs - Blogotypo`,
    description:
      `Explore the latest ${categoryName} blogs, trending articles, expert insights, and engaging content on Blogotypo.`,
    slug: `/blog/category/${slug}`,
    image: categories.find((item) => item.name === categoryName)?.image || "",
    type: "article",
  });
}

const CategorySlugPage = ({ params }) => <CategoryPage ITEMS_PER_PAGE={ITEMS_PER_PAGE} />;

export default CategorySlugPage;
import { createMetadata } from "@lib/metadataClient";
import SearchPage from "./_components/SearchPage";

const ITEMS_PER_PAGE = 10;

const SEARCH_FROM_OPTIONS = [
  { value: "all", label: "All Fields" },
  { value: "title", label: "Title" },
  { value: "category", label: "Category" },
  { value: "content", label: "Content" },
  { value: "author", label: "Author" },
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export const metadata = createMetadata({
  title: "Search Blogs & Articles - Blogotypo",
  description:
    "Search blogs on Blogotypo by title, category, author, or content using advanced filters to quickly discover trending and relevant articles.",
  slug: "/blog/search",
});

const SearchBlogs = () =>
  <SearchPage
    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
    SEARCH_FROM_OPTIONS={SEARCH_FROM_OPTIONS}
    SORT_OPTIONS={SORT_OPTIONS}
    DATE_OPTIONS={DATE_OPTIONS}
  />

export default SearchBlogs;
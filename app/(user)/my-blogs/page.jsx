import { createMetadata } from "@lib/metadataClient";
import MyBlogsPage from "./MyBlogsPage";

export const metadata = createMetadata({
  title: "My Blogs - Blogotypo",
  description:
    "View, manage, edit, and organize all your published and draft blogs from your personal Blogotypo dashboard.",
  slug: "/my-blogs",
  robots: { index: false, follow: false },
});

const MyBlogs = () => <MyBlogsPage />;

export default MyBlogs;
import { createMetadata } from "@lib/metadataClient";
import AdminBlogsPage from "./AdminBlogsPage";

export const metadata = createMetadata({
  title: "Admin Blog Management - Blogotypo",
  description:
    "Manage, review, monitor, and delete blogs from the Blogotypo admin dashboard with advanced content moderation controls.",
  slug: "/admin/blogs",
  robots: { index: false, follow: false },
});

const AdminBlogs = () => <AdminBlogsPage />;

export default AdminBlogs;
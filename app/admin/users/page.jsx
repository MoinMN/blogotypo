import "bootstrap/dist/css/bootstrap.min.css";
import AdminUserPage from "./AdminUserPage";
import { createMetadata } from "@lib/metadataClient";

export const metadata = createMetadata({
  title: "Admin User Management - Blogotypo",
  description:
    "View, manage, verify, and moderate user accounts from the Blogotypo admin dashboard with advanced user control features.",
  slug: "/admin/users",
  robots: { index: false, follow: false },
});

const AdminUsers = () => <AdminUserPage />;

export default AdminUsers;
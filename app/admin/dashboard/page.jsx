import { createMetadata } from "@lib/metadataClient";
import AdminDashboardPage from "./_components/AdminDashboardPage";

export const metadata = createMetadata({
  title: "Admin Dashboard - Blogotypo",
  description:
    "Access analytics, monitor platform activity, track user growth, and view blog statistics from the Blogotypo admin dashboard.",
  slug: "/admin/dashboard",
  robots: { index: false, follow: false },
});

const AdminDashboard = () => <AdminDashboardPage />;

export default AdminDashboard;
import "bootstrap/dist/css/bootstrap.min.css";
import { createMetadata } from "@lib/metadataClient";
import AdminContactPage from "./AdminContactPage";

export const metadata = createMetadata({
  title: "Admin Contact Management - Blogotypo",
  description:
    "View, manage, and respond to user contact requests, feedback, and support inquiries from the Blogotypo admin dashboard.",
  slug: "/admin/contacts",
  robots: { index: false, follow: false },
});

const AdminContacts = () => <AdminContactPage />;

export default AdminContacts;
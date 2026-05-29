import Profile from "@app/(user)/profile/page";

export const metadata = createMetadata({
  title: "Admin Profile Settings - Blogotypo",
  description:
    "Manage admin account settings, profile information, security preferences, and authentication details on Blogotypo.",
  slug: "/admin/profile",
  robots: { index: false, follow: false },
});

const AdminProfile = () => <Profile />;

export default AdminProfile

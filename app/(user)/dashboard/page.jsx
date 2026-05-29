import "bootstrap/dist/css/bootstrap.min.css";
import { createMetadata } from "@lib/metadataClient";
import DashboardPage from "./DashboardPage";

export const metadata = createMetadata({
  title: "User Dashboard - Blogotypo",
  description:
    "Manage your blogs, track content activity, create new posts, and access your personalized blogging dashboard on Blogotypo.",
  slug: "/dashboard",
});

const UserDashboard = () => <DashboardPage />;

export default UserDashboard;
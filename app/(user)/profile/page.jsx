import { createMetadata } from "@lib/metadataServer";
import getServerSessionData from "@lib/getServerSessionData";
import ProfilePage from "./ProfilePage";

export const generateMetadata = async () => {
  const session = await getServerSessionData();

  const username = session?.user?.name || "User";

  return createMetadata({
    title: `${username} Profile - Blogotypo`,
    description:
      `Manage ${username}'s Blogotypo profile settings, account details, password, and personalized blogging preferences.`,
    slug: `/profile`,
    image: session?.user?.image,
    type: "profile",
    robots: { index: false, follow: false },
  });
}

const Profile = () => <ProfilePage />;

export default Profile;
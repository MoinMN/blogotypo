import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

const getServerSessionData = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export default getServerSessionData;
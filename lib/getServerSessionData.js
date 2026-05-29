import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const getServerSessionData = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export default getServerSessionData;
import { getServerSession } from "next-auth";
// import { handler } from "@/app/api/auth/[...nextauth]/route";
import User from "@models/user";
import connectMongoDB from "@utils/database";


export async function GET(req) {
  await connectMongoDB();

  // Get session details
  const session = await getServerSession(req);

  try {
    const user = await User.findOne({ email: session?.user.email });
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return user data
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

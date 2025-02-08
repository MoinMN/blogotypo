import User from '@models/user';
import connectMongoDB from '@utils/database';
import { unlink } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';
import path from 'path';

export async function POST(req) {
  try {
    await connectMongoDB();

    const data = await req.formData();
    const file = data.get('file');

    const session = await getServerSession(req);

    if (!file) {
      return new Response(JSON.stringify(
        { msg: "File not found!" },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      ));
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response('User Not Found!', { status: 404 });
    }

    // Default profile image
    const defaultProfileImage = process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/profiles/default/default_avatar.jpg";

    // If user has an existing profile image, and it's not the default one, unlink it
    if (user.image && user.image !== defaultProfileImage) {
      const previousImagePath = path.join("public", user.image.replace(process.env.NEXT_PUBLIC_NEXTAUTH_URL, ""));
      try {
        await unlink(previousImagePath);
      } catch (unlinkError) {
        console.error("Error deleting old profile image:", unlinkError);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename using timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();       // Extract file extension
    const uniqueFileName = `profile_${timestamp}.${fileExt}`;

    // Define the path to save the file
    const profilePath = `public/profiles/${uniqueFileName}`;
    await writeFile(profilePath, buffer);

    user.image = process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/profiles/" + uniqueFileName;

    await user.save();

    return new Response(
      JSON.stringify({
        msg: "Profile Image Updated!",
        image: user.image,
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }));
  } catch (error) {
    console.log('Error handling file upload:', error);
    return new Response(JSON.stringify(
      { msg: "Internal Server Error" },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    ));
  }
}

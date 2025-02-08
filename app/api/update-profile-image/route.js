import User from '@models/user';
import connectMongoDB from '@utils/database';
import cloudinary from '@utils/cloudinary';
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

    // If the user has an existing profile image (not the default one), delete it from Cloudinary
    if (user.image && user.image !== defaultProfileImage) {
      try {
        const publicId = user.image.split('/').pop().split('.')[0]; // Extract public ID
        await cloudinary.v2.uploader.destroy(`profile_pictures/${publicId}`);
      } catch (unlinkError) {
        console.error("Error deleting old Cloudinary profile image:", unlinkError);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload new profile image to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${buffer.toString('base64')}`, {
      folder: 'profile_pictures',
    });

    // Update user's profile image URL
    user.image = uploadResponse.secure_url;

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

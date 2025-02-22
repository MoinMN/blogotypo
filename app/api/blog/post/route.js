
import Blog from '@models/blog';
import User from '@models/user';
import connectMongoDB from '@utils/database';
import cloudinary from '@utils/cloudinary';
import { getServerSession } from 'next-auth';
import requestGoogleIndexing from '@app/api/googleIndexing';

export async function POST(req) {
  try {
    await connectMongoDB();

    // reterive data
    const formData = await req.formData();

    // format data
    const { title, content, categories } = JSON.parse(formData.get("blogData"));
    const file = formData.get("thumbnail_image");

    if (!title || !content || categories.length === 0 || !file) {
      return new Response("Data Not Found in Backend!", { status: 404 })
    }

    // get session info
    const session = await getServerSession(req);

    if (!session || !session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Convert image file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload Image to Cloudinary
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "blog_thumbnails", // Cloudinary folder
      resource_type: "image"
    });

    if (!cloudinaryResponse.secure_url) {
      return new Response("Failed to upload image!", { status: 500 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return new Response("User not found!", { status: 401 })

    const blogExist = await Blog.findOne({ title: title.trim() });
    if (blogExist) return new Response("Title already exist, kindly change title!", { status: 400 })

    const blog = await Blog.create({
      creator: user._id,
      title: title.replace('-', '_').trim(),
      categories: categories,
      content: content.trim(),
      thumbnail_image: cloudinaryResponse.secure_url,
    });

    if (!blog) return new Response("Failed to save blog data!", { status: 400 });

    // trigger google indexing
    await requestGoogleIndexing(process.env.NEXT_PUBLIC_NEXTAUTH_URL + "/" + encodeURIComponent(title.split(' ').join('-')));

    return new Response("Blog Created Successfully!", { status: 201 });
  } catch (error) {
    console.log('Error while posting ', error);
    return new Response("Internal Server Error!", { status: 500 });
  }
}
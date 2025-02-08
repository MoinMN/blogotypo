
import Blog from '@models/blog';
import User from '@models/user';
import connectMongoDB from '@utils/database';
import { writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';

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

    // upload thumbnail image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename using timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop(); // Extract file extension
    const uniqueFileName = `thumbnail_${timestamp}.${fileExt}`;

    // Define the path to save the file
    const path = `public/thumbnail_images/${uniqueFileName}`;
    await writeFile(path, buffer);

    const user = await User.findOne({ email: session.user.email });
    if (!user) return new Response("User not found!", { status: 401 })

    const blogExist = await Blog.findOne({ title: title.trim() });
    if (blogExist) return new Response("Title already exist, kindly change title!", { status: 400 })

    const blog = await Blog.create({
      creator: user._id,
      title: title.replace('-', '_').trim(),
      categories: categories,
      content: content.trim(),
      thumbnail_image: 'thumbnail_images/' + uniqueFileName,
    });

    if (!blog) return new Response("Failed to save blog data!", { status: 400 });

    return new Response("Blog Created Successfully!", { status: 201 });
  } catch (error) {
    console.log('Error while posting ', error);
    return new Response("Internal Server Error!", { status: 500 });
  }
}
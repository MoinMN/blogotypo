import Blog from '@models/blog';
import User from '@models/user';
import connectMongoDB from '@utils/database';
import cloudinary from '@utils/cloudinary';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  try {
    await connectMongoDB();

    // reterive data
    const formData = await req.formData();

    // format data
    const { title, content, categories, _id } = JSON.parse(formData.get("blogData"));
    const file = formData.get("thumbnail_image");

    if (!title || !content || categories.length === 0 || !file) {
      return new Response("Data Not Found in Backend!", { status: 404 })
    }

    // get session info
    const session = await getServerSession(req);

    if (!session || !session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return new Response("User not found!", { status: 401 })

    const blog = await Blog.findById(_id);
    if (!blog) return new Response("Blog not found!", { status: 401 })

    // check whether image was change or its prevs
    if (file instanceof File) {
      // upload thumbnail image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload new image to Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${buffer.toString('base64')}`, {
        folder: 'blog_thumbnails',
      });

      // Delete the previous image from Cloudinary (if exists)
      if (blog.thumbnail_image) {
        const publicId = blog.thumbnail_image.split('/').pop().split('.')[0]; // Extract public ID
        try {
          await cloudinary.v2.uploader.destroy(`blog_thumbnails/${publicId}`);
        } catch (err) {
          console.error("Error deleting Cloudinary image:", err);
        }
      }

      // Update new image URL
      blog.thumbnail_image = uploadResponse.secure_url;
    }

    blog.title = title.trim();
    blog.categories = categories;
    blog.content = content.trim();

    await blog.save();

    return new Response("Blog Updated Successfully!", { status: 200 });
  } catch (error) {
    console.log('Error while updating ', error);
    return new Response("Internal Server Error!", { status: 500 });
  }
}
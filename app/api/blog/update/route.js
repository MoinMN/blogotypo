import Blog from '@models/blog';
import User from '@models/user';
import connectMongoDB from '@utils/database';
import { unlink } from 'fs/promises';
import { writeFile } from 'fs/promises';
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

      // Generate a unique filename using timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop(); // Extract file extension
      const uniqueFileName = `thumbnail_${timestamp}.${fileExt}`;

      // Define the path to save the file
      const path = `public/thumbnail_images/${uniqueFileName}`;
      await writeFile(path, buffer);

      // Extract the thumbnail image filename for delete prev image
      if (blog.thumbnail_image) {
        const filename = blog.thumbnail_image.split("/").pop(); // Extract filename from URL
        const filePath = `public/thumbnail_images/${filename}`;

        try {
          await unlink(filePath); // Delete the file
        } catch (err) {
          console.error("Error deleting file:", err); // Handle file not found error
        }
      }

      // update new image url
      blog.thumbnail_image = process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/thumbnail_images/' + uniqueFileName;
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
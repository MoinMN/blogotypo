import 'bootstrap/dist/css/bootstrap.min.css';
import { createMetadata } from '@lib/metadataClient';
import PublishBlogPage from './PublishBlogPage';

export const metadata = createMetadata({
  title: "Publish a New Blog - Blogotypo",
  description:
    "Create, write, and publish your blog on Blogotypo to share ideas, stories, knowledge, and insights with readers worldwide.",
  slug: "/publish-blog",
});

const PublishBlog = () => <PublishBlogPage />;

export default PublishBlog

import 'bootstrap/dist/css/bootstrap.min.css';
import { createMetadata } from '@lib/metadataClient';
import LoginPage from './LoginPage';

export const metadata = createMetadata({
  title: "Login to Your Account - Blogotypo",
  description: "Securely log in to your Blogotypo account to write blogs, manage posts, explore articles, and connect with the blogging community.",
  slug: "/login",
});

const Login = () => <LoginPage />;

export default Login

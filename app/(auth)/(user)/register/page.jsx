import { createMetadata } from '@lib/metadataClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './RegisterPage';

export const metadata = createMetadata({
  title: "Create Your Account - Blogotypo",
  description: "Sign up on Blogotypo to start creating blogs, share your ideas, explore trending articles, and join a growing blogging community.",
  slug: "/register",
});

const Register = () => <RegisterPage />;

export default Register;
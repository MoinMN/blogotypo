import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './LoginPage';
import { createMetadata } from '@lib/metadataClient';

export const metadata = createMetadata({
  title: "Admin Dashboard Login - Blogotypo",
  description: "Secure admin login portal for managing Blogotypo platform content, users, blogs, reports, and administrative settings.",
  robots: { index: false, follow: false },
});

const AdminLogin = () => <LoginPage />;

export default AdminLogin

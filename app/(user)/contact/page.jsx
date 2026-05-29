import "bootstrap/dist/css/bootstrap.min.css";
import { createMetadata } from "@lib/metadataClient";
import ContactPage from "./ContactPage";

export const metadata = createMetadata({
  title: "Contact Us - Blogotypo",
  description:
    "Get in touch with the Blogotypo team for support, feedback, business inquiries, account assistance, or any questions related to the platform.",
  slug: "/contact",
});

const ContactUs = () => <ContactPage />;

export default ContactUs;
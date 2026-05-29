import { createMetadata } from "@lib/metadataClient";
import FAQPage from "./FAQPage";

export const metadata = createMetadata({
  title: "Frequently Asked Questions - Blogotypo",
  description:
    "Find answers to common questions about Blogotypo including accounts, blogging, publishing, privacy, features, and platform support.",
  slug: "/docs/faq",
});

const FAQ = () => <FAQPage />;

export default FAQ;

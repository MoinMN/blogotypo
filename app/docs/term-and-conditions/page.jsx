import { createMetadata } from "@lib/metadataClient";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Terms and Conditions - Blogotypo",
  description:
    "Read the Blogotypo terms and conditions covering platform usage, user responsibilities, content policies, and legal agreements.",
  slug: "/docs/term-and-conditions",
});

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl md:text-3xl font-bold text-center montserrat_alternates_font mb-6">Terms and Conditions</h1>

      <div className="space-y-6 text-sm md:text-base text-gray-800">
        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">1. Introduction</h2>
          <p>
            Welcome to <strong>Blogotypo</strong>, a blogging platform where users can create, publish, and manage blogs.
            By accessing or using the services provided by Blogotypo, you agree to comply with these terms and conditions.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">2. Data We Collect</h2>
          <p>
            We collect the following data when you use our services:
          </p>
          <ul className="list-disc ml-6">
            <li>Name</li>
            <li>Email Address</li>
            <li>Profile Information</li>
            <li>Account Creation Date</li>
            <li>Authentication Provider (Google, GitHub, or Credentials)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">3. Data Security</h2>
          <p>
            Your password is encrypted for your security, and as such, developers do not have access to your account or password.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">4. Data Retention</h2>
          <p>
            Your data may be stored for an indefinite period of time. We may retain and use your data for development and analytical purposes to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">5. Your Rights</h2>
          <p>
            You have the right to request the deletion of your account and all associated data. To request this, please reach out to us via the <strong><Link href="/contact" className="text-blue-600">Contact Us</Link></strong> page.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">6. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Any changes will be reflected on this page, and we encourage you to review these terms periodically.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">7. Contact Us</h2>
          <p>
            If you have any questions regarding these terms and conditions or our privacy policy, feel free to contact us through the <strong><Link href="/contact" className="text-blue-600">Contact Us</Link></strong> page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;

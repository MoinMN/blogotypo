"use client";

import useMetadata from "@hooks/metadata";
import Link from "next/link";


const PrivacyPolicy = () => {
  // set title for page
  useMetadata('Privacy Policy - Blogotypo', 'Privacy Policy of blogotypo. If more information needed please contact us');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-6 montserrat_alternates_font">Privacy Policy</h1>

      <div className="space-y-6 text-sm md:text-base text-gray-800">
        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">1. Introduction</h2>
          <p>
            At <strong>Blogotypo</strong>, we value your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, store, and protect your data when you use our services.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">2. Information We Collect</h2>
          <p>
            When you use our services, we collect the following types of information:
          </p>
          <ul className="list-disc ml-6">
            <li><strong>Name:</strong> The name you provide during registration.</li>
            <li><strong>Email Address:</strong> The email you use to sign up or communicate with us.</li>
            <li><strong>Profile Information:</strong> Information you provide to complete your user profile.</li>
            <li><strong>Account Creation Date:</strong> The date when your account was created.</li>
            <li><strong>Authentication Provider:</strong> The provider you use to authenticate your account (Google, GitHub, or Credentials).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">3. How We Use Your Data</h2>
          <p>
            The data we collect is used for the following purposes:
          </p>
          <ul className="list-disc ml-6">
            <li>To provide and maintain our services.</li>
            <li>To communicate with you about your account, blog posts, or any service updates.</li>
            <li>To improve our platform and ensure a better user experience.</li>
            <li>To keep your account secure and to prevent unauthorized access.</li>
            <li>To provide analytics and development insights for improving our services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">4. Data Security</h2>
          <p>
            We take your data security seriously. Your password is encrypted and stored securely, meaning developers do not have access to your account credentials. However, please be aware that no method of online transmission or electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">5. Data Retention</h2>
          <p>
            We retain your data for as long as necessary to fulfill the purposes outlined in this Privacy Policy. Your data may be retained for development, analysis, and improvement of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">6. Your Rights</h2>
          <p>
            You have the right to request access to or deletion of your data. If you wish to request the deletion of your account and all associated data, you can do so by contacting us through the <strong><Link href="/contact" className="text-blue-600">Contact Us</Link></strong> page.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">7. Sharing Your Data</h2>
          <p>
            We do not share your personal data with third parties unless it is necessary to fulfill the purposes of our service or required by law. We may share aggregated, non-personally identifiable data for analytical or development purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically to stay informed about how we are protecting your data.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us through the <strong><Link href="/contact" className="text-blue-600">Contact Us</Link></strong> page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

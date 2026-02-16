"use client";

import useMetadata from "@hooks/metadata";
import Link from "next/link";

const ChildSafety = () => {
  // set title for page
  useMetadata(
    "Child Safety Standards - Blogotypo",
    "Blogotypo Child Safety Standards and policies against child sexual abuse and exploitation."
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-6 montserrat_alternates_font">
        Child Safety Standards
      </h1>

      <div className="space-y-6 text-sm md:text-base text-gray-800">

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">
            1. Our Commitment
          </h2>
          <p>
            <strong>Blogotypo</strong> is committed to maintaining a safe and respectful environment for all users. We have zero tolerance for child sexual abuse and exploitation (CSAE) or child sexual abuse material (CSAM).
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">
            2. Prohibited Content
          </h2>
          <p>
            Users are strictly prohibited from posting, sharing, or promoting:
          </p>
          <ul className="list-disc ml-6">
            <li>Any form of child sexual abuse material (CSAM).</li>
            <li>Content that exploits or endangers minors.</li>
            <li>Sexual content involving individuals under the age of 18.</li>
            <li>Links to external platforms containing exploitative material.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">
            3. Reporting Mechanism
          </h2>
          <p>
            If you encounter content that violates our child safety standards, you may report it immediately through our platform. Users can also contact us directly via the{" "}
            <strong>
              <Link href="/contact" className="text-blue-600">
                Contact Us
              </Link>
            </strong>{" "}
            page.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">
            4. Content Moderation & Enforcement
          </h2>
          <p>
            Reported content is reviewed promptly. Accounts found to be involved in child exploitation will be permanently suspended. We reserve the right to remove any content that violates our policies without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">
            5. Cooperation with Authorities
          </h2>
          <p>
            Blogotypo complies with all applicable child safety laws and regulations. Where required, we cooperate with regional and national law enforcement authorities in cases involving child exploitation or abuse.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">
            6. Contact Information
          </h2>
          <p>
            For child safety concerns or urgent reports, please contact us at:
          </p>
          <p className="font-semibold">
            pixelmint.mail@gmail.com
          </p>
        </section>

      </div>
    </div>
  );
};

export default ChildSafety;

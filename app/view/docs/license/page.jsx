"use client";

import useMetadata from "@hooks/metadata";
import Link from "next/link";


const License = () => {
  // set title for page
  useMetadata(`LICENSE - Blogotypo`, `License of blogotypo if any question arise then please contact developer`);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-6 montserrat_alternates_font">License</h1>

      <div className="space-y-6 text-sm md:text-base text-gray-800">
        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">1. Overview</h2>
          <p>
            This project, <strong>Blogotypo</strong>, is released under the terms of the Non-Commercial Use License.
            By using or modifying this project, you agree to comply with the terms outlined in this License.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">2. Allowed Use</h2>
          <p>
            You are free to use this project for personal, educational, and non-commercial purposes.
            You may also modify and distribute the project under the following conditions:
          </p>
          <ul className="list-disc ml-6">
            <li>Alterations are allowed, but proper credit must be provided to the original developer (Blogotypo).</li>
            <li>All modifications must be distributed under the same license with the same attribution requirements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">3. Restrictions</h2>
          <p>
            The following restrictions apply to this project:
          </p>
          <ul className="list-disc ml-6">
            <li>This project or any modified versions of it may not be used for any commercial purposes.</li>
            <li>You may not sell, license, or otherwise distribute this project or its modifications for profit.</li>
            <li>You may not use the project or its modifications in any way that could harm or disparage the original developer.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">4. Required Credits</h2>
          <p>
            When making alterations to this project or using it in your own projects, you must provide appropriate credit to the original developer.
            The attribution should include the following notice in all relevant places:
          </p>
          <pre className="bg-gray-100 p-4 font-mono select-all rounded-md shadow-md overflow-x-auto">
            "Blogotypo is developed by Moin MN. All rights reserved. For more information, visit:
            <Link href="https://www.linkedin.com/in/moinnaik" target="_blank" className="text-blue-600">
              https://www.linkedin.com/in/moinnaik
            </Link>"
          </pre>
          <p>
            This credit must appear in the documentation or other materials accompanying any derivative works or modifications.
            Additionally, you must include a link to the original developer's LinkedIn profile as part of the attribution.
          </p>
        </section>


        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">5. Liability</h2>
          <p>
            This project is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability,
            fitness for a particular purpose, and non-infringement. In no event shall the author or copyright holder be liable for any claim, damages, or other
            liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the project or the use or other dealings
            in the project.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">6. Modifications and Contributions</h2>
          <p>
            Contributions to this project are welcome. However, please ensure that all modifications comply with the terms of this License.
            Any modifications made and distributed must also retain this license and include the proper attribution to the original developer.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">7. Termination</h2>
          <p>
            The rights granted under this License will terminate automatically if you fail to comply with any of the terms. Upon termination, you must stop
            using the project and delete all copies of the project and its modifications.
          </p>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold montserrat_alternates_font">8. Contact Information</h2>
          <p>
            If you have any questions about this License or need further clarification, feel free to contact the original developer through the
            <strong><a href="/contact" className="text-blue-600"> Contact Us</a></strong> page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default License;

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useMetadata from "@hooks/metadata";

const FAQPage = () => {
  // set title for page
  useMetadata(`FAQ - Blogotypo`, `Frequently asked question from blogotpo. If more information needed please contact us`);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the current question
    } else {
      setActiveIndex(index); // Open the clicked question
    }
  };

  const faqs = [
    {
      question: "What is Blogotypo?",
      answer: "Blogotypo is a blogging platform that allows users to create, manage, and publish blogs. You can also connect with others and share your ideas through the platform.",
    },
    {
      question: "How do I sign up for Blogotypo?",
      answer: "You can sign up for Blogotypo using your Google or GitHub account. Simply click on the sign-up button and follow the instructions to get started.",
    },
    {
      question: "How can I delete my account or data?",
      answer: "To delete your account or data, please visit the 'Contact Us' page and send us a request. We’ll process your request and delete your data as per the policy.",
    },
    {
      question: "Is my password secure?",
      answer: "Yes, your password is encrypted using the latest encryption methods. We prioritize user security, and the developers do not have access to your account password.",
    },
    {
      question: "Can I use Blogotypo for commercial purposes?",
      answer: "No, Blogotypo is not for commercial use. You can use it for personal or non-commercial projects, but you are not allowed to sell or monetize the platform.",
    },
    {
      question: "Can I contribute to Blogotypo?",
      answer: "Yes, Blogotypo is open for contributions. If you would like to contribute to the project, please check the project’s repository for guidelines and make sure to provide proper credits.",
    },
    {
      question: "How long is my data stored?",
      answer: "Your data is stored for a long time, unless you choose to delete it. It may be used for development purposes, including improvements to the platform.",
    },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-center montserrat_alternates_font mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300 pb-4">
              <button
                onClick={() => toggleAnswer(index)}
                className="w-full text-left text-lg font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {faq.question}
              </button>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  height: activeIndex === index ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-gray-700"
              >
                {faq.answer}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQPage;

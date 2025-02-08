"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const LoginPopup = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 15000); // 15 seconds
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 min-h-screen flex justify-center items-center bg-black/20 bg-opacity-10"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white p-6 rounded-lg shadow-lg relative w-80 md:w-96 text-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              &times;
            </button>

            {/* Heading */}
            <h2 className="text-lg font-semibold montserrat_alternates_font text-purple-700">
              Join Blogotypo Today!
            </h2>

            {/* Message */}
            <p className="text-gray-700 mt-2 text-sm">
              Unlock exclusive features, connect with a community of writers, and grow your audience.
              Start your blogging journey today! 🚀
            </p>

            {/* Buttons */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => router.push('/user/register')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => router.push('/user/login')}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition"
              >
                Log In
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default LoginPopup

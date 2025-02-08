"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HomeLoading = () => {
  const greetings = [
    "Hello", "مرحبًا", "안녕하세요", "Hola", "Bonjour", "Ciao",
    "Olá", "Привет", "你好", "こんにちは", "नमस्ते", "Γεια σας",
    "Hallo", "שלום", "Hei", "Hej", "Selam", "สวัสดี", "Jambo",
    "Mabuhay", "Aloha", "Cześć", "Dzień dobry", "Szia", "Tere",
    "Bok", "Salut", "Sveiki", "Labas"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-purple-400 min-h-screen w-full flex justify-center items-center"
      // initial={{ opacity: 0, y: 100 }}
      // animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.ul
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <li className="font-semibold montserrat_alternates_font text-4xl md:text-5xl text-white list-disc">
          {greetings[index]}
        </li>
      </motion.ul>
    </motion.div>
  );
};

export default HomeLoading;

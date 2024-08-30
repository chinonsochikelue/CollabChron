"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

function Photo({ user }) {
  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { delay: 2, duration: 0.4, ease: "easeIn" },
        }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 2.4, duration: 0.4, ease: "easeInOut" },
          }}
          className="w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] rounded-full overflow-hidden"
        >
          <Image
            src={user.image}
            priority
            width={800}
            height={800}
            alt={user?.name}
            className="object-cover w-full h-full"
          />
        </motion.div>

        <motion.svg
          className="absolute inset-0 w-full h-full"
          fill="transparent"
          viewBox="0 0 506 506"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="255"
            cy="255"
            r="258" // Increased radius
            stroke="red"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: "24 10 0 0" }}
            animate={{
              strokeDasharray: ["15 120 25 25", "16 25 92 72", "4 250 22 22"],
              rotate: [0, 360],
            }}
            transition={{
              repeatType: "reverse",
              duration: 20,
              repeat: Infinity,
            }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

export default Photo;

"use client";
import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";



// export const metadata = {
//     title: "Contact Us",
//     description: "Get in touch with us for any questions, feedback, or inquiries. We're here to assist you with your needs.",
//     keywords: "contact, customer service, support, inquiries, feedback",
//     author: "CollabChron",
//     viewport: "width=device-width, initial-scale=1.0",
//     robots: "index, follow",
//     canonical: "http://localhost:3000/contact",
//   };

const info = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    desc: "(+234) 907 480 2816",
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    desc: "chinonsochikelue556@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    desc: "No.3 Ikebuaso Street Awada Obosi, Anambra State, Nigeria",
  },
];

function page() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 2.4,
          delay: 0.4,
          ease: "easeIn",
        },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <div className="xl:w-[54%] order-2 xl:order-none">
            <form
              action=""
              method="post"
              className="flex flex-col gap-6 p-10 rounded-xl"
            >
              <h3 className="text-4xl">Get in Touch</h3>
              <p>
                We&apos;d love to hear from you! Whether you have a question,
                feedback, or just want to say hello, our team is here to help.
                Please fill out the form below, and we&apos;ll get back to you as
                soon as possible.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="firstname"
                  placeholder="First Name"
                  className="
    w-full 
    px-4 
    py-5 
    text-gray-900 
    placeholder-gray-400 
    border 
    border-gray-300 
    rounded-md 
    focus:outline-none 
    focus:ring-2 
    text-base
    font-light
    focus:ring-blue-500 
    focus:border-blue-300 
    dark:bg-gray-800 
    dark:border-gray-700 
    dark:text-gray-100 
    dark:placeholder-gray-500 
    dark:focus:ring-blue-500 
    dark:focus:border-blue-500
    disabled:bg-gray-100 
    disabled:text-gray-500 
    disabled:border-gray-200 
    disabled:cursor-not-allowed
    dark:disabled:bg-gray-700 
    dark:disabled:text-gray-400 
    dark:disabled:border-gray-600
  "
                />
                <input
                  type="lastname"
                  placeholder="Last Name"
                  className="
   w-full 
   px-4 
   py-5 
   text-gray-900 
   placeholder-gray-400 
   border 
   border-gray-300 
   rounded-md 
   focus:outline-none 
   focus:ring-2 
   text-base
   font-light
   focus:ring-blue-500 
   focus:border-blue-300 
   dark:bg-gray-800 
   dark:border-gray-700 
   dark:text-gray-100 
   dark:placeholder-gray-500 
   dark:focus:ring-blue-500 
   dark:focus:border-blue-500
   disabled:bg-gray-100 
   disabled:text-gray-500 
   disabled:border-gray-200 
   disabled:cursor-not-allowed
   dark:disabled:bg-gray-700 
   dark:disabled:text-gray-400 
   dark:disabled:border-gray-600
 "
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="
    w-full 
    px-4 
    py-5 
    text-gray-900 
    placeholder-gray-400 
    border 
    border-gray-300 
    rounded-md 
    focus:outline-none 
    focus:ring-2 
    text-base
    font-light
    focus:ring-blue-500 
    focus:border-blue-300 
    dark:bg-gray-800 
    dark:border-gray-700 
    dark:text-gray-100 
    dark:placeholder-gray-500 
    dark:focus:ring-blue-500 
    dark:focus:border-blue-500
    disabled:bg-gray-100 
    disabled:text-gray-500 
    disabled:border-gray-200 
    disabled:cursor-not-allowed
    dark:disabled:bg-gray-700 
    dark:disabled:text-gray-400 
    dark:disabled:border-gray-600
  "
                />
                <input
                  type="phone"
                  placeholder="Phone Number"
                  className="
    w-full 
    px-4 
    py-5 
    text-gray-900 
    placeholder-gray-400 
    border 
    border-gray-300 
    rounded-md 
    focus:outline-none 
    focus:ring-2 
    text-base
    font-light
    focus:ring-blue-500 
    focus:border-blue-300 
    dark:bg-gray-800 
    dark:border-gray-700 
    dark:text-gray-100 
    dark:placeholder-gray-500 
    dark:focus:ring-blue-500 
    dark:focus:border-blue-500
    disabled:bg-gray-100 
    disabled:text-gray-500 
    disabled:border-gray-200 
    disabled:cursor-not-allowed
    dark:disabled:bg-gray-700 
    dark:disabled:text-gray-400 
    dark:disabled:border-gray-600
  "
                />
              </div>

              <textarea
                className="
    w-full 
    h-[200px]
    min-h-[98px] 
    px-4 
    py-5
    text-base
    text-gray-900 
    placeholder-gray-400 
    border 
    border-gray-300 
    rounded-md 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-blue-500 
    dark:bg-gray-800 
    dark:border-gray-700 
    dark:text-gray-100 
    dark:placeholder-gray-500 
    dark:focus:ring-blue-500 
    dark:focus:border-blue-500 
    resize-none
    disabled:bg-gray-100 
    disabled:text-gray-500 
    disabled:border-gray-200 
    disabled:cursor-not-allowed
    dark:disabled:bg-gray-700 
    dark:disabled:text-gray-400 
    dark:disabled:border-gray-600
  "
                placeholder="Type your message here"
              />
              <button
                className="
    px-4 
    py-3
    text-sm 
    font-medium 
    text-white 
    bg-blue-600 
    rounded-md 
    hover:bg-blue-700 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:ring-offset-2 
    dark:bg-blue-500 
    dark:hover:bg-blue-600 
    dark:focus:ring-blue-400 
    max-w-40 
    disabled:bg-gray-400 
    disabled:cursor-not-allowed 
    disabled:opacity-50
  "
                size="md"
              >
                Send message
              </button>
            </form>
          </div>

          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => {
                return (
                  <li key={index} className="flex items-center gap-6">
                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] rounded-md flex items-center justify-center bg-[#f0f0f04b]">
                      <div className="text-[28px]">{item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <p>{item.title}</p>
                      <h3 className="text-xl">{item.desc}</h3>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default page;

"use client";

import React from "react";
import { useTheme } from "next-themes";
import SunIcon from "@/assets/svgs/sunicon.svg";
import MoonIcon from "@/assets/svgs/moonicon.svg";
import Image from "next/image";

const Button = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <button
      onClick={() => currentTheme === "dark" ? setTheme('light') : setTheme("dark")}
      className='transition-all duration-100 text-white px-8 py-2 text-2xl md:text-4xl rounded-lg bottom-32'
    >
      {currentTheme === "dark" ? (
       <Image
          src={SunIcon}
          alt="Sun Icon"
          className="hover:scale-125 transition-all ease duration-200 fill-current text-yellow-500 dark:text-yellow-400"
       />
      ) : (
        <Image
          src={MoonIcon}
          alt="Moon Icon"
         className="hover:scale-125 transition-all ease duration-200 fill-current text-gray-800 dark:text-gray-300"
       />
      )}
    </button>
  );
};

export default Button;

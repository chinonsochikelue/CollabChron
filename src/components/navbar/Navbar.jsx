"use client";
import React, { useState } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import GithubIcon from "../../assets/svgs/github.svg";
import FacebookIcon from "../../assets/svgs/facebook.svg";
import LinkedinIcon from "../../assets/svgs/linkedin.svg";
import TwitterIcon from "../../assets/svgs/twitter.svg";
import Logo from "./Logo";
import Button from "@/providers/ThemeToggle";
import Menu from "./Menu";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  return (
    <header className="top-0 w-full shadow-sm z-20">
      <nav className="flex flex-row md:flex-row w-full items-center justify-between gap-2 md:gap-0 px-5 md:gap-1">
        <div className="flex flex-row w-full py-5 items-center justify-between gap-2 md:gap-0 px-5">
          <div className="flex gap-2 text-[20px] md:hidden lg:flex order-2 xl:order-1">
            <a
              href="https://github.com/chinonsochikelue"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block h-7 w-7 mr-4"
            >
              <Image
                src={GithubIcon}
                alt="GithubIcon"
                className="hover:scale-125 transition-all ease duration-200"
              />
            </a>

            <a
              href="https://www.facebook.com/Chinonso.Dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block h-7 w-7 mr-4"
            >
              <Image
                src={FacebookIcon}
                alt="FacebookIcon"
                className="hover:scale-125 transition-all ease duration-200"
              />
            </a>

            <a
              href="https://twitter.com/Chinonso_Chikel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block h-7 w-7 mr-4"
            >
              <Image
                src={TwitterIcon}
                alt="TwitterIcon"
                className="hover:scale-125 transition-all ease duration-200"
              />
            </a>

            <a href="/" className="inline-block h-7 w-7 mr-4">
              <Image
                src={LinkedinIcon}
                alt="LinkedinIcon"
                className="hover:scale-125 transition-all ease duration-200"
              />
            </a>
          </div>
          <div className="hidden sm:block xl:order-2">
  <Logo />
</div>


          <div className="hidden md:flex gap-8 items-center order-3 xl:order-3">
            <Button />
            <Link href="/" className={styles.link}>
              Home
            </Link>
            <Link href="/contact" className={styles.link}>
              Contact
            </Link>
            <Link href="/about" className={styles.link}>
              About
            </Link>
            <AuthLinks />
          </div>
        </div>
        <div className="xl:hidden md:hidden 2xl:hidden" onClick={() => setMenu(!menu)}>
          {menu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </div>
      </nav>
      <Menu menu={menu} setMenu={setMenu} />
    </header>
  );
};

export default Navbar;

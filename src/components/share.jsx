"use client";
import { Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsInstagram, BsThreads, BsTwitterX, BsWhatsapp } from "react-icons/bs";
import { FaFacebookF, FaReddit, FaTelegram } from "react-icons/fa";

function Share({ title, desc, link }) {
  const [isMobile, setIsMobile] = useState(false);
  const hashtags = ["#collabcron", `#link`]; // Customize your hashtags if needed
  const maxDescLength = 200; // Maximum length of description

  // Truncate the description to the defined length
  const truncatedDesc = desc.length > maxDescLength 
    ? `${desc.substring(0, maxDescLength)}...`
    : desc;

  const copyUrl = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied successfully");
  };

  const checkWindowSize = () => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  };

  useEffect(() => {
    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  return (
    <div className="flex items-center justify-center gap-5 md:gap-8 relative z-[1]">
      <span className="rounded-full p-1 text-xl cursor-pointer" onClick={copyUrl}>
        <Copy />
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(truncatedDesc)}&url=${encodeURIComponent(link)}&hashtags=${encodeURIComponent(hashtags.join(","))}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full p-1 cursor-pointer bg-black text-white"
      >
        <BsTwitterX />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full p-1 cursor-pointer bg-[#1877F2] text-white"
      >
        <FaFacebookF />
      </a>
      <a
        href={`https://www.threads.net/share?text=${encodeURIComponent(truncatedDesc)}&url=${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full p-1 cursor-pointer bg-black text-white"
      >
        <BsThreads />
      </a>
      {isMobile ? (
        <a
          href={`whatsapp://send?text=${encodeURIComponent(title + ": " + link)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-1 cursor-pointer bg-[#26D366] text-white"
        >
          <BsWhatsapp />
        </a>
      ) : (
        <a
          href={`https://web.whatsapp.com/send?text=${encodeURIComponent(title + ": " + link)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-1 cursor-pointer bg-[#26D366] text-white"
        >
          <BsWhatsapp />
        </a>
      )}
      <a
        href={`https://www.reddit.com/submit?url=${encodeURIComponent(link)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full p-1 cursor-pointer bg-[#FF4500] text-white"
      >
        <FaReddit />
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(truncatedDesc)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full p-1 cursor-pointer bg-[#32A8DD] text-white"
      >
        <FaTelegram />
      </a>
      <a
        href={`https://www.instagram.com/?url=${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "linear-gradient(45deg, #833AB4, #FD1D1D, #FCB045)",
        }}
        className="rounded-full p-1 cursor-pointer text-white"
      >
        <BsInstagram />
      </a>
    </div>
  );
}

export default Share;
  

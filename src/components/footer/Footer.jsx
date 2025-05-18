import React from "react";
import Link from 'next/link';

function Footer() {
  return (
    <div className='flex flex-col md:flex-row w-full py-8 items-center justify-between text-[14px] text-gray-700 dark:text-gray-200 container'>
      <p>© 2025 Collaboration Chronology. All rights reserved.</p>
      <dir className='flex gap-5'>
        <Link href='/contact'>Contact</Link>
        <Link href='/terms'  target='_blank'>Terms of Service</Link>
        <Link href='/privacy' target='_blank'>
          Privacy Policy
        </Link>
        <Link href='cookies' target='_blank'>
          Cookies Policy
        </Link>
      </dir>
    </div>
  );
};

export default Footer;
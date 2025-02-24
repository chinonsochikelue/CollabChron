"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const AuthLinks = ({ setMenu }) => {
  const [open, setOpen] = useState(false);

  const { status, data: session } = useSession();
  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className="cursor-pointer" onClick={() => setMenu(false)}>
          Login
        </Link>
      ) : (
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center">

            <Image
              src={session?.user?.image}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <p className="ml-2">
              {session?.user?.name.length > 10
                ? session?.user?.name.slice(0, 10) + "..."
                : session?.user?.name}
            </p>

          </div>
          <Link href="/write" className="cursor-pointer" onClick={() => setMenu(false)}>
            Write
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthLinks;

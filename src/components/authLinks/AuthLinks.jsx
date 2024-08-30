"use client";
import Link from "next/link";
import styles from "./authLinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);

  const { status, data: session } = useSession();

  return (
    <>
      {status === "unauthenticated" ? (
        <Link href="/login" className="cursor-pointer">
          Login
        </Link>
      ) : (
        <>
          <Link href="/write" className="cursor-pointer">
            Write
          </Link>
          {session?.user?.image ? (
            <div className="flex flex-row text-base items-center gap-2">
            <Image
              src={session.user.image}
              alt={session?.user?.name + " Profile"}
              className="cursor-pointer w-10 h-10 rounded-full"
              width={600}
              height={600}
              onClick={signOut}
            />
            <h2>{session?.user?.name}</h2>
            </div>
          ) : (
            <span className={styles.link} onClick={signOut}>
              Logout
            </span>
          )}
        </>
      )}
    </>
  );
};

export default AuthLinks;

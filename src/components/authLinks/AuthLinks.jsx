"use client";
import Link from "next/link";
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
          <div className="flex items-center justify-between order-1 xl:order-2 md:order-2">

            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="profile"
                width={40}
                height={40}
                property="true"
                className="rounded-full md:ml-5"
              />
            )}

            <p className="ml-2">
              {session?.user?.name.length > 10
                ? session?.user?.name.slice(0, 10) + "..."
                : session?.user?.name}
            </p>

          </div>
          <div className="order-2 xl:order-1 md:order-1 gap-20">
            <Link href="/write" className="cursor-pointer" onClick={() => setMenu(false)}>
              Write
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthLinks;

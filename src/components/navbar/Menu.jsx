"use client"
import { AnimatePresence, motion } from "framer-motion"
import Button from "@/providers/ThemeToggle"
import AuthLinks from "../authLinks/AuthLinks"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function Menu({ menu, setMenu }) {
  const { status, data: session } = useSession()
  const menus = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Contact",
      link: "/contact",
    },
    {
      title: "About",
      link: "/about",
    },
  ]

  // Add Developer link if user is authenticated
  if (status === "authenticated") {
    menus.push({
      title: "Developer",
      link: "/developer",
    })
  }

  console.log("STATIS", status ? "authenticated" : "unauthenticated")
  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="top-full w-full shadow sm:hidden bg-slate-200 dark:bg-[#020a16] rounded-md"
        >
          <ul className="flex flex-col text-start m-4">
            {menus.map((item, i) => (
              <Link
                href={item.link}
                className={`${item?.active ? "text-blue-600" : "text-gray-600"} py-4 transition hover:text-blue-500 `}
                key={i}
                onClick={() => setMenu(false)} // Close the menu on click
              >
                {item.title}
              </Link>
            ))}
            <AuthLinks setMenu={setMenu} />
            <div className="flex justify-between items-center">
              {status === "authenticated" ? (
                <button
                  setMenu={setMenu}
                  onClick={() => {
                    signOut()
                    setMenu(false)
                  }}
                >
                  Logout
                </button>
              ) : null}

              <Button setMenu={setMenu} />
            </div>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

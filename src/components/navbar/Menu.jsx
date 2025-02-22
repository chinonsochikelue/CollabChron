import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/providers/ThemeToggle";
import AuthLinks from "../authLinks/AuthLinks";
import Link from "next/link";

export default function Menu({ menu }) {
const menus = [
{
title: "Home",
link:  "/",
},
{
title: "Contact",
link:  "/contact",
},
{
title: "About",
link:  "/about",
},
];
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
        {menus &&  
          menus.map((item, i) => (  
            <Link href={item.link}  
              className={`${  
                item?.active ? "text-blue-600" : "text-gray-600"  
              } py-4 transition hover:text-blue-500 `}  
              key={i}  
            >  
              {item?.title}  
            </Link>  
          ))}  
          <AuthLinks />  
          <div className="flex justify-end">  
        <Button />  
        </div>  
      </ul>  
    </motion.div>  
  )}  
</AnimatePresence>

);
}

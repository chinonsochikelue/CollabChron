// "use client";

// import React from "react";
// import { useTheme } from "next-themes";
// import SunIcon from "@/assets/svgs/sunicon.svg";
// import MoonIcon from "@/assets/svgs/moonicon.svg";
// import Image from "next/image";

// const Button = ({ setMenu }) => {
//   const { systemTheme, theme, setTheme } = useTheme();
//   const currentTheme = theme === 'system' ? systemTheme : theme;



//   const handleClick = () => {
//     if (currentTheme === "dark") {
//       setTheme('light');
//     } else {
//       setTheme('dark');
//     }
//     setMenu(false); // Close the menu
//   };
//   return (
//     <button
//       onClick={handleClick}
//       className='transition-all duration-100 text-white px-8 py-2 text-2xl md:text-4xl rounded-lg bottom-32'
//     >
//       {currentTheme === "dark" ? (
//         <Image
//           src={SunIcon}
//           alt="Sun Icon"
//           className="hover:scale-125 transition-all ease duration-200 fill-current text-yellow-500 dark:text-yellow-400"
//         />
//       ) : (
//         <Image
//           src={MoonIcon}
//           alt="Moon Icon"
//           className="hover:scale-125 transition-all ease duration-200 fill-current text-gray-800 dark:text-gray-300"
//         />
//       )}
//     </button>
//   );
// };

// export default Button;



"use client"

import * as React from "react"
import MoonIcon from "@/assets/svgs/moonicon.svg"
import SunIcon from "@/assets/svgs/sunicon.svg"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full" size="icon">
          <Image
            src={resolvedTheme === "dark" ? SunIcon : MoonIcon}
            alt="Toggle Theme Icon"
            className="hover:scale-125 transition-all ease duration-200"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

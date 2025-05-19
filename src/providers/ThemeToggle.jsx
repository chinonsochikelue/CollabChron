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

  // Fix: Track client mount
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full" size="icon">
          {/* Only render icon after component mounts */}
          {mounted && (
            <Image
              src={resolvedTheme === "dark" ? SunIcon : MoonIcon}
              alt="Toggle Theme Icon"
              className="hover:scale-125 transition-all ease duration-200"
            />
          )}
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

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Book,
  Code,
  Key,
  Bell,
  Activity,
  Clock,
  FileText,
  PlaySquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

export default function ApiDocsLayout({ children }) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState({
    resources: true,
    tools: true,
  })

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <SidebarProvider className="w-full max-w-screen overflow-x-hidden">
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="p-2">
              <Link href="/developer/docs" className="flex items-center gap-2 px-2 py-1.5">
                <Book className="h-5 w-5" />
                <span className="text-lg font-semibold">API Documentation</span>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/developer/docs"}>
                      <Link href="/developer/docs">
                        <FileText className="h-4 w-4" />
                        <span>Introduction</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/developer/docs/playground"}>
                      <Link href="/developer/docs/playground">
                        <PlaySquare className="h-4 w-4" />
                        <span>API Playground</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/developer/docs/webhooks"}>
                      <Link href="/developer/docs/webhooks">
                        <Bell className="h-4 w-4" />
                        <span>Webhooks</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/developer/docs/status"}>
                      <Link href="/developer/docs/status">
                        <Activity className="h-4 w-4" />
                        <span>API Status</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/developer/docs/changelog"}>
                      <Link href="/developer/docs/changelog">
                        <Clock className="h-4 w-4" />
                        <span>Changelog</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel
                onClick={() => toggleSection("resources")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Resources</span>
                {openSections.resources ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </SidebarGroupLabel>
              {openSections.resources && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/developer/docs#posts">
                          <Code className="h-4 w-4" />
                          <span>Posts API</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/developer/docs#users">
                          <Code className="h-4 w-4" />
                          <span>Users API</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/developer/docs#stats">
                          <Code className="h-4 w-4" />
                          <span>Stats API</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel
                onClick={() => toggleSection("tools")}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Developer Tools</span>
                {openSections.tools ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </SidebarGroupLabel>
              {openSections.tools && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/developer">
                          <Key className="h-4 w-4" />
                          <span>API Keys</span>
                          <ExternalLink className="ml-auto h-3 w-3" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/developer/docs#sdks">
                          <Code className="h-4 w-4" />
                          <span>Code Examples</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 text-sm">Need Help?</h4>
                <p className="text-xs text-blue-600 dark:text-blue-200 mt-1">
                  Contact our support team for assistance with the API.
                </p>
                <a
                  href="/contact"
                  className="text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline mt-2 inline-block"
                >
                  Contact Support →
                </a>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-2">
            <SidebarTrigger />
            <div className="flex items-center gap-4 mr-3">
              <Link
                href="/developer"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
              >
                <Key className="h-4 w-4" />
                <span>Developer Dashboard</span>
              </Link>
            </div>
          </div>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

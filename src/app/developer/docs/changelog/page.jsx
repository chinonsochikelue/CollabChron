"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, Tag, ArrowRight } from "lucide-react"

export default function ApiChangelog() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      setLoading(false)
    }
  }, [status, router])

  const changelogEntries = [
    {
      version: "v1.2.0",
      date: "2025-05-15",
      title: "Added Rate Limiting and Improved Error Handling",
      description:
        "This release adds rate limiting to all API endpoints and improves error handling with more detailed error messages.",
      changes: [
        {
          type: "feature",
          description: "Added rate limiting to all API endpoints (100 requests per hour per API key)",
        },
        {
          type: "improvement",
          description: "Enhanced error responses with more detailed error messages and consistent format",
        },
        {
          type: "improvement",
          description: "Added rate limit headers to all API responses",
        },
        {
          type: "docs",
          description: "Updated documentation with rate limiting information and best practices",
        },
      ],
    },
    {
      version: "v1.1.0",
      date: "2025-04-10",
      title: "New Endpoints and Performance Improvements",
      description:
        "This release adds new endpoints for retrieving user statistics and improves the performance of existing endpoints.",
      changes: [
        {
          type: "feature",
          description: "Added new endpoint: GET /api/v1/users/stats",
        },
        {
          type: "improvement",
          description: "Improved performance of GET /api/v1/posts endpoint with optimized database queries",
        },
        {
          type: "improvement",
          description: "Enhanced post response with additional metadata",
        },
        {
          type: "fix",
          description: "Fixed an issue where post views were not being incremented correctly",
        },
      ],
    },
    {
      version: "v1.0.0",
      date: "2025-03-01",
      title: "Initial API Release",
      description: "Initial release of the CollabChron API with core endpoints for posts and users.",
      changes: [
        {
          type: "feature",
          description: "Added endpoint: GET /api/v1/posts",
        },
        {
          type: "feature",
          description: "Added endpoint: GET /api/v1/posts/latest",
        },
        {
          type: "feature",
          description: "Added endpoint: GET /api/v1/posts/:id",
        },
        {
          type: "feature",
          description: "Added endpoint: GET /api/v1/users/profile",
        },
        {
          type: "feature",
          description: "Added endpoint: GET /api/v1/users/posts",
        },
        {
          type: "docs",
          description: "Published initial API documentation",
        },
      ],
    },
  ]

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">API Changelog</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-screen-xl">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API Changelog</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track the evolution of the CollabChron API with our detailed changelog
          </p>
        </div>

        <div className="space-y-8">
          {changelogEntries.map((entry) => (
            <div key={entry.version} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {entry.version}
                      <ArrowRight size={16} className="text-gray-400" />
                      {entry.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{entry.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    <Calendar size={16} />
                    <span>{entry.date}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Changes</h3>
                <ul className="space-y-3">
                  {entry.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          change.type === "feature"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : change.type === "improvement"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : change.type === "fix"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        }`}
                      >
                        <Tag size={12} className="mr-1" />
                        {change.type}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{change.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

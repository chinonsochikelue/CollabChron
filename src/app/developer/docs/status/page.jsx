"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw } from "lucide-react"

export default function ApiStatus() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      setLoading(false)
    }
  }, [status, router])

  const refreshStatus = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const apiServices = [
    {
      name: "Posts API",
      status: "operational",
      description: "API endpoints for retrieving blog posts",
      lastIncident: null,
      endpoints: [
        { path: "/api/v2/posts", status: "operational" },
        { path: "/api/v2/posts/latest", status: "operational" },
        { path: "/api/v2/posts/:id", status: "operational" },
      ],
    },
    {
      name: "Users API",
      status: "operational",
      description: "API endpoints for user data",
      lastIncident: null,
      endpoints: [
        { path: "/api/v2/users/profile", status: "operational" },
        { path: "/api/v2/users/posts", status: "operational" },
        { path: "/api/v2/users/stats", status: "operational" },
      ],
    },
    {
      name: "Authentication",
      status: "operational",
      description: "API key authentication and validation",
      lastIncident: null,
    },
    {
      name: "Rate Limiting",
      status: "degraded",
      description: "Rate limiting service for API requests",
      lastIncident: "2025-05-17T14:30:00Z",
      incidentDetails: "Experiencing higher than normal latency in rate limiting service",
    },
  ]

  const incidents = [
    {
      id: "incident-001",
      title: "Rate Limiting Service Degradation",
      status: "monitoring",
      date: "2025-05-17T14:30:00Z",
      updates: [
        {
          timestamp: "2025-05-17T16:45:00Z",
          message:
            "We are continuing to monitor the rate limiting service. Performance has improved, but we're keeping a close eye on it.",
        },
        {
          timestamp: "2025-05-17T15:20:00Z",
          message:
            "We've identified the issue with our rate limiting service and have implemented a fix. We're monitoring the situation.",
        },
        {
          timestamp: "2025-05-17T14:30:00Z",
          message:
            "We're investigating reports of increased latency in our rate limiting service. Some API requests may experience delays.",
        },
      ],
    },
    {
      id: "incident-002",
      title: "API Downtime",
      status: "resolved",
      date: "2025-04-05T10:15:00Z",
      resolvedAt: "2025-04-05T11:30:00Z",
      updates: [
        {
          timestamp: "2025-04-05T11:30:00Z",
          message: "The issue has been fully resolved and all API services are operating normally.",
        },
        {
          timestamp: "2025-04-05T11:00:00Z",
          message:
            "We've identified the issue as a database connection problem and have implemented a fix. Services are coming back online.",
        },
        {
          timestamp: "2025-04-05T10:15:00Z",
          message: "We're investigating reports of API downtime. Some endpoints may be unavailable.",
        },
      ],
    },
  ]

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case "operational":
        return <CheckCircle className="text-green-500" size={24} />
      case "degraded":
        return <AlertTriangle className="text-yellow-500" size={24} />
      case "outage":
        return <XCircle className="text-red-500" size={24} />
      default:
        return <AlertTriangle className="text-gray-500" size={24} />
    }
  }

  const getStatusBadge = (statusType) => {
    switch (statusType) {
      case "operational":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Operational
          </span>
        )
      case "degraded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Degraded
          </span>
        )
      case "outage":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Outage
          </span>
        )
      case "monitoring":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Monitoring
          </span>
        )
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Resolved
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Unknown
          </span>
        )
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">API Status</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-screen">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">API Status</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Current status of the CollabChron API services</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-blue-400"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Refresh Status
                </>
              )}
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock size={14} />
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            {apiServices.some((service) => service.status === "outage") ? (
              <XCircle className="text-red-500" size={32} />
            ) : apiServices.some((service) => service.status === "degraded") ? (
              <AlertTriangle className="text-yellow-500" size={32} />
            ) : (
              <CheckCircle className="text-green-500" size={32} />
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {apiServices.some((service) => service.status === "outage")
                  ? "Major Outage"
                  : apiServices.some((service) => service.status === "degraded")
                    ? "Partial Outage"
                    : "All Systems Operational"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {apiServices.filter((service) => service.status === "operational").length} of {apiServices.length}{" "}
                services are fully operational
              </p>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Service Status</h2>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {apiServices.map((service) => (
              <div key={service.name} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{service.description}</p>
                      {service.lastIncident && (
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
                          Last incident: {formatDate(service.lastIncident)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>{getStatusBadge(service.status)}</div>
                </div>

                {service.endpoints && (
                  <div className="mt-4 ml-10">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Endpoints</h4>
                    <ul className="space-y-2">
                      {service.endpoints.map((endpoint) => (
                        <li key={endpoint.path} className="flex items-center justify-between">
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                          {getStatusBadge(endpoint.status)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.incidentDetails && (
                  <div className="mt-4 ml-10 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <p className="text-yellow-800 dark:text-yellow-300 text-sm">{service.incidentDetails}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Recent Incidents</h2>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {incidents.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>No incidents reported in the last 90 days.</p>
              </div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{incident.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {formatDate(incident.date)}
                        {incident.resolvedAt && ` - Resolved at ${formatDate(incident.resolvedAt)}`}
                      </p>
                    </div>
                    <div>{getStatusBadge(incident.status)}</div>
                  </div>

                  <div className="space-y-4">
                    {incident.updates.map((update, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          {index < incident.updates.length - 1 && <div className="w-0.5 h-full bg-gray-300 mt-1"></div>}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(update.timestamp)}</p>
                          <p className="text-gray-700 dark:text-gray-300">{update.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

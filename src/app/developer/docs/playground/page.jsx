"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Copy, Play, ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiPlayground() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState("")
  const [loading, setLoading] = useState(true)
  const [endpoints, setEndpoints] = useState([
    {
      id: "get-posts",
      name: "Get All Posts",
      method: "GET",
      url: "/api/v2/posts",
      description: "Retrieve a paginated list of blog posts",
      params: [
        { name: "page", type: "number", default: "1", description: "Page number" },
        { name: "limit", type: "number", default: "20", description: "Number of posts per page" },
        { name: "category", type: "string", default: "", description: "Filter by category slug (optional)" },
      ],
      headers: [{ name: "Authorization", value: "Bearer YOUR_API_KEY", required: true }],
      body: null,
    },
    {
      id: "get-latest-posts",
      name: "Get Latest Posts",
      method: "GET",
      url: "/api/v2/posts/latest",
      description: "Retrieve the most recently published blog posts",
      params: [{ name: "limit", type: "number", default: "10", description: "Number of posts to return" }],
      headers: [{ name: "Authorization", value: "Bearer YOUR_API_KEY", required: true }],
      body: null,
    },
    {
      id: "get-post",
      name: "Get Post by ID",
      method: "GET",
      url: "/api/v2/posts/:id",
      description: "Retrieve a specific blog post by its ID",
      params: [],
      pathParams: [{ name: "id", type: "string", description: "Post ID" }],
      headers: [{ name: "Authorization", value: "Bearer YOUR_API_KEY", required: true }],
      body: null,
    },
    {
      id: "get-profile",
      name: "Get User Profile",
      method: "GET",
      url: "/api/v2/users/profile",
      description: "Retrieve the profile information of the authenticated user",
      params: [],
      headers: [{ name: "Authorization", value: "Bearer YOUR_API_KEY", required: true }],
      body: null,
    },
    {
      id: "get-user-posts",
      name: "Get User Posts",
      method: "GET",
      url: "/api/v2/users/posts",
      description: "Retrieve the posts created by the authenticated user",
      params: [
        { name: "page", type: "number", default: "1", description: "Page number" },
        { name: "limit", type: "number", default: "20", description: "Number of posts per page" },
      ],
      headers: [{ name: "Authorization", value: "Bearer YOUR_API_KEY", required: true }],
      body: null,
    },
    {
      id: "get-user-stats",
      name: "Get User Stats",
      method: "GET",
      url: "/api/v2/users/stats",
      description: "Retrieve statistics about the authenticated user's content and engagement",
      params: [],
      headers: [{ name: "Authorization", value: "Bearer YOUR_API_KEY", required: true }],
      body: null,
    },
  ])
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0])
  const [endpointParams, setEndpointParams] = useState({})
  const [endpointPathParams, setEndpointPathParams] = useState({})
  const [endpointHeaders, setEndpointHeaders] = useState({})
  const [endpointBody, setEndpointBody] = useState("")
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showEndpointList, setShowEndpointList] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchApiKeys()
    }
  }, [status, router])

  useEffect(() => {
    // Reset params, headers, and body when endpoint changes
    const params = {}
    const pathParams = {}
    const headers = {}

    selectedEndpoint.params?.forEach((param) => {
      params[param.name] = param.default || ""
    })

    selectedEndpoint.pathParams?.forEach((param) => {
      pathParams[param.name] = ""
    })

    selectedEndpoint.headers?.forEach((header) => {
      if (header.name === "Authorization" && selectedKey) {
        headers[header.name] = `Bearer ${selectedKey}`
      } else {
        headers[header.name] = header.value
      }
    })

    setEndpointParams(params)
    setEndpointPathParams(pathParams)
    setEndpointHeaders(headers)
    setEndpointBody(selectedEndpoint.body || "")
    setResponse(null)
    setError(null)
  }, [selectedEndpoint, selectedKey])

  useEffect(() => {
    // Update Authorization header when API key changes
    if (selectedKey) {
      setEndpointHeaders((prev) => ({
        ...prev,
        Authorization: `Bearer ${selectedKey}`,
      }))
    }
  }, [selectedKey])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/developer")
      if (res.ok) {
        const data = await res.json()
        setApiKeys(data)
        if (data.length > 0) {
          setSelectedKey(data[0].key)
        }
      } else {
        console.error("Failed to fetch API keys")
      }
    } catch (error) {
      console.error("Error fetching API keys:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEndpointChange = (endpoint) => {
    setSelectedEndpoint(endpoint)
  }

  const handleParamChange = (name, value) => {
    setEndpointParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePathParamChange = (name, value) => {
    setEndpointPathParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleHeaderChange = (name, value) => {
    setEndpointHeaders((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBodyChange = (value) => {
    setEndpointBody(value)
  }

  const buildUrl = () => {
    let url = selectedEndpoint.url

    // Replace path parameters
    if (selectedEndpoint.pathParams) {
      for (const param of selectedEndpoint.pathParams) {
        url = url.replace(`:${param.name}`, endpointPathParams[param.name] || `:${param.name}`)
      }
    }

    // Add query parameters
    const queryParams = new URLSearchParams()
    for (const [key, value] of Object.entries(endpointParams)) {
      if (value) {
        queryParams.append(key, value)
      }
    }

    const queryString = queryParams.toString()
    if (queryString) {
      url = `${url}?${queryString}`
    }

    return `${process.env.NEXT_PUBLIC_SITE_URL}${url}`
  }

  const handleSendRequest = async () => {
    setIsLoading(true)
    setResponse(null)
    setError(null)

    try {
      const url = buildUrl()
      const options = {
        method: selectedEndpoint.method,
        headers: Object.entries(endpointHeaders).reduce((acc, [key, value]) => {
          if (value) {
            acc[key] = value
          }
          return acc
        }, {}),
      }

      if (selectedEndpoint.method !== "GET" && endpointBody) {
        options.body = endpointBody
        options.headers["Content-Type"] = "application/json"
      }

      const res = await fetch(url, options)
      const contentType = res.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      } else {
        data = await res.text()
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries([...res.headers.entries()]),
        data,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateCurlCommand = () => {
    const url = buildUrl()
    let command = `curl -X ${selectedEndpoint.method} "${url}"`

    // Add headers
    for (const [key, value] of Object.entries(endpointHeaders)) {
      if (value) {
        command += ` \\\n  -H "${key}: ${value}"`
      }
    }

    // Add body
    if (selectedEndpoint.method !== "GET" && endpointBody) {
      command += ` \\\n  -d '${endpointBody}'`
    }

    return command
  }

  const formatResponse = (response) => {
    if (!response) return ""

    try {
      if (typeof response.data === "string") {
        return response.data
      }
      return JSON.stringify(response.data, null, 2)
    } catch (err) {
      return String(response.data)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">API Playground</h1>
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
            <h1 className="text-3xl font-bold">API Playground</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Test the CollabChron API endpoints directly in your browser
            </p>
          </div>
          <div className="w-full md:w-auto">
            <div className="flex flex-col">
              <label htmlFor="api-key" className="text-sm font-medium mb-1">
                Select API Key
              </label>
              <select
                id="api-key"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full md:w-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {apiKeys.length === 0 ? (
                  <option value="">No API keys available</option>
                ) : (
                  apiKeys.map((key) => (
                    <option key={key.id} value={key.key}>
                      {key.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Endpoint Selection */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Endpoints</h2>
                <button
                  onClick={() => setShowEndpointList(!showEndpointList)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 md:hidden"
                >
                  {showEndpointList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              <div className={`${showEndpointList ? "block" : "hidden md:block"}`}>
                <ul className="space-y-1">
                  {endpoints.map((endpoint) => (
                    <li key={endpoint.id}>
                      <button
                        onClick={() => handleEndpointChange(endpoint)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                          selectedEndpoint.id === endpoint.id
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block w-14 text-xs font-medium px-2 py-1 rounded mr-2 ${
                            endpoint.method === "GET"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : endpoint.method === "POST"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : endpoint.method === "PUT"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <span className="truncate">{endpoint.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Request Builder */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold">{selectedEndpoint.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{selectedEndpoint.description}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`inline-block text-xs font-medium px-2 py-1 rounded mr-2 ${
                      selectedEndpoint.method === "GET"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : selectedEndpoint.method === "POST"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : selectedEndpoint.method === "PUT"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{selectedEndpoint.url}</code>
                </div>
              </div>

              <div className="p-4">
                <Tabs defaultValue="params">
                  <TabsList className="mb-4">
                    {selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0 && (
                      <TabsTrigger value="path-params">Path Parameters</TabsTrigger>
                    )}
                    {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
                      <TabsTrigger value="params">Query Parameters</TabsTrigger>
                    )}
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    {selectedEndpoint.method !== "GET" && <TabsTrigger value="body">Body</TabsTrigger>}
                  </TabsList>

                  {selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0 && (
                    <TabsContent value="path-params">
                      <div className="space-y-4">
                        {selectedEndpoint.pathParams.map((param) => (
                          <div key={param.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div>
                              <label htmlFor={`path-param-${param.name}`} className="block text-sm font-medium mb-1">
                                {param.name}
                                <span className="text-red-500 ml-1">*</span>
                              </label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{param.description}</p>
                            </div>
                            <div className="md:col-span-2">
                              <input
                                id={`path-param-${param.name}`}
                                type={param.type === "number" ? "number" : "text"}
                                value={endpointPathParams[param.name] || ""}
                                onChange={(e) => handlePathParamChange(param.name, e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                placeholder={`Enter ${param.name}`}
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}

                  {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
                    <TabsContent value="params">
                      <div className="space-y-4">
                        {selectedEndpoint.params.map((param) => (
                          <div key={param.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div>
                              <label htmlFor={`param-${param.name}`} className="block text-sm font-medium mb-1">
                                {param.name}
                              </label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{param.description}</p>
                            </div>
                            <div className="md:col-span-2">
                              <input
                                id={`param-${param.name}`}
                                type={param.type === "number" ? "number" : "text"}
                                value={endpointParams[param.name] || ""}
                                onChange={(e) => handleParamChange(param.name, e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                placeholder={param.default ? `Default: ${param.default}` : `Enter ${param.name}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}

                  <TabsContent value="headers">
                    <div className="space-y-4">
                      {selectedEndpoint.headers &&
                        selectedEndpoint.headers.map((header) => (
                          <div key={header.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            <div>
                              <label htmlFor={`header-${header.name}`} className="block text-sm font-medium mb-1">
                                {header.name}
                                {header.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {header.name === "Authorization" && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">API key for authentication</p>
                              )}
                            </div>
                            <div className="md:col-span-2">
                              <input
                                id={`header-${header.name}`}
                                type="text"
                                value={endpointHeaders[header.name] || ""}
                                onChange={(e) => handleHeaderChange(header.name, e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                placeholder={`Enter ${header.name}`}
                                required={header.required}
                                readOnly={header.name === "Authorization"}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  {selectedEndpoint.method !== "GET" && (
                    <TabsContent value="body">
                      <div>
                        <label htmlFor="request-body" className="block text-sm font-medium mb-1">
                          Request Body
                        </label>
                        <textarea
                          id="request-body"
                          value={endpointBody || ""}
                          onChange={(e) => handleBodyChange(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 font-mono text-sm h-40"
                          placeholder="Enter request body (JSON)"
                        />
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                  <button
                    onClick={handleSendRequest}
                    disabled={isLoading || apiKeys.length === 0}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Send Request
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(generateCurlCommand())}
                    className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy as cURL"}
                  </button>
                </div>
              </div>

              {/* Response Section */}
              {(response || error) && (
                <div className="mt-6 border-t dark:border-gray-700 p-4">
                  <h3 className="text-lg font-semibold mb-2">Response</h3>
                  {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">Error</h4>
                        <p className="text-gray-700 dark:text-gray-300">{error}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                            response.status >= 200 && response.status < 300
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : response.status >= 400
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {response.status} {response.statusText}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {response.headers["content-type"]}
                        </span>
                      </div>

                      <Tabs defaultValue="response">
                        <TabsList className="mb-4">
                          <TabsTrigger value="response">Response</TabsTrigger>
                          <TabsTrigger value="headers">Headers</TabsTrigger>
                        </TabsList>
                        <TabsContent value="response">
                          <div className="relative">
                            <button
                              onClick={() => copyToClipboard(formatResponse(response))}
                              className="absolute top-2 right-2 p-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                              aria-label="Copy response"
                            >
                              <Copy size={16} />
                            </button>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                              {formatResponse(response)}
                            </pre>
                          </div>
                        </TabsContent>
                        <TabsContent value="headers">
                          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                            <table className="min-w-full">
                              <thead>
                                <tr>
                                  <th className="text-left py-2 px-4 border-b dark:border-gray-700">Name</th>
                                  <th className="text-left py-2 px-4 border-b dark:border-gray-700">Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(response.headers).map(([name, value]) => (
                                  <tr key={name}>
                                    <td className="py-2 px-4 border-b dark:border-gray-700 font-medium">{name}</td>
                                    <td className="py-2 px-4 border-b dark:border-gray-700 font-mono">{value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { CopyBlock, dracula } from "react-code-blocks"
import Link from "next/link"
import { Copy, ExternalLink, ChevronDown, ChevronRight, Info, Shield, Clock, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ApiDocumentation() {
    const { theme } = useTheme()
    const { data: session, status } = useSession()
    const router = useRouter()
    const [activeSection, setActiveSection] = useState("introduction")
    const [expandedSections, setExpandedSections] = useState({
        authentication: true,
        endpoints: true,
        errors: true,
        ratelimits: true,
    })
    const [copied, setCopied] = useState({})

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopied({ [id]: true })
        setTimeout(() => setCopied({ [id]: false }), 2000)
    }

    // Code examples in different languages
    const codeExamples = {
        javascript: `// Using fetch API
const fetchPosts = async () => {
  const response = await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  const data = await response.json();
  return data;
};

// Using axios
import axios from 'axios';

const client = axios.create({
  baseURL: '${process.env.NEXT_PUBLIC_SITE_URL}/api/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const fetchPosts = async () => {
  const { data } = await client.get('/posts');
  return data;
};`,

        python: `import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1"

def fetch_posts():
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    response = requests.get(f"{BASE_URL}/posts", headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"API request failed with status {response.status_code}")
    
    return response.json()

# Example usage
posts = fetch_posts()
print(f"Found {len(posts['posts'])} posts")`,

        php: `<?php
$apiKey = "YOUR_API_KEY";
$baseUrl = "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1";

function fetchPosts() {
    global $apiKey, $baseUrl;
    
    $ch = curl_init("$baseUrl/posts");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiKey"
    ]);
    
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($statusCode !== 200) {
        throw new Exception("API request failed with status $statusCode");
    }
    
    return json_decode($response, true);
}

// Example usage
try {
    $posts = fetchPosts();
    echo "Found " . count($posts['posts']) . " posts";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}`,

        ruby: `require 'net/http'
require 'json'
require 'uri'

API_KEY = "YOUR_API_KEY"
BASE_URL = "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1"

def fetch_posts
  uri = URI("#{BASE_URL}/posts")
  request = Net::HTTP::Get.new(uri)
  request["Authorization"] = "Bearer #{API_KEY}"
  
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
    http.request(request)
  end
  
  if response.code != "200"
    raise "API request failed with status #{response.code}"
  end
  
  JSON.parse(response.body)
end

# Example usage
posts = fetch_posts
puts "Found #{posts['posts'].length} posts"`,

        go: `package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const (
	apiKey  = "YOUR_API_KEY"
	baseURL = "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1"
)

type PostsResponse struct {
	Posts []Post \`json:"posts"\`
	Meta  Meta   \`json:"meta"\`
}

type Post struct {
	ID        string \`json:"id"\`
	Title     string \`json:"title"\`
	Desc      string \`json:"desc"\`
	// Add other fields as needed
}

type Meta struct {
	CurrentPage int  \`json:"currentPage"\`
	TotalPages  int  \`json:"totalPages"\`
	TotalCount  int  \`json:"totalCount"\`
	HasNextPage bool \`json:"hasNextPage"\`
	HasPrevPage bool \`json:"hasPrevPage"\`
}

func fetchPosts() (*PostsResponse, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", baseURL+"/posts", nil)
	if err != nil {
		return nil, err
	}
	
	req.Header.Add("Authorization", "Bearer "+apiKey)
	
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("API request failed with status %d", resp.StatusCode)
	}
	
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	
	var postsResp PostsResponse
	err = json.Unmarshal(body, &postsResp)
	if err != nil {
		return nil, err
	}
	
	return &postsResp, nil
}

func main() {
	posts, err := fetchPosts()
	if err != nil {
		fmt.Printf("Error: %v\\n", err)
		return
	}
	
	fmt.Printf("Found %d posts\\n", len(posts.Posts))
}`,
    }

    // If loading or unauthenticated, show loading state
    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-screen overflow-x-hidden py-8 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <nav className="space-y-1">
                            <h3 className="font-semibold text-lg mb-2">Documentation</h3>
                            <ul className="space-y-1">
                                <li className="dark:text-gray-200">
                                    <button
                                        onClick={() => setActiveSection("introduction")}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeSection === "introduction"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        Introduction
                                    </button>
                                </li>
                                <li className="dark:text-gray-200">
                                    <button
                                        onClick={() => {
                                            setActiveSection("authentication")
                                            if (!expandedSections.authentication) {
                                                toggleSection("authentication")
                                            }
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeSection === "authentication"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        Authentication
                                    </button>
                                </li>
                                <li className="dark:text-gray-200">
                                    <div>
                                        <button
                                            onClick={() => toggleSection("endpoints")}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <p>Endpoints</p>
                                            {expandedSections.endpoints ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </button>
                                        {expandedSections.endpoints && (
                                            <ul className="ml-4 space-y-1 mt-1">
                                                <li className="dark:text-gray-200">
                                                    <button
                                                        onClick={() => setActiveSection("posts")}
                                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === "posts"
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            }`}
                                                    >
                                                        Posts
                                                    </button>
                                                </li>
                                                <li className="dark:text-gray-200">
                                                    <button
                                                        onClick={() => setActiveSection("users")}
                                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === "users"
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            }`}
                                                    >
                                                        Users
                                                    </button>
                                                </li>
                                                <li className="dark:text-gray-200">
                                                    <button
                                                        onClick={() => setActiveSection("stats")}
                                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${activeSection === "stats"
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                            }`}
                                                    >
                                                        Stats
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </li>
                                <li className="dark:text-gray-200">
                                    <button
                                        onClick={() => {
                                            setActiveSection("errors")
                                            if (!expandedSections.errors) {
                                                toggleSection("errors")
                                            }
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeSection === "errors"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        Error Handling
                                    </button>
                                </li>
                                <li className="dark:text-gray-200">
                                    <button
                                        onClick={() => {
                                            setActiveSection("ratelimits")
                                            if (!expandedSections.ratelimits) {
                                                toggleSection("ratelimits")
                                            }
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeSection === "ratelimits"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        Rate Limits
                                    </button>
                                </li>
                                <li className="dark:text-gray-200">
                                    <button
                                        onClick={() => setActiveSection("sdks")}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeSection === "sdks"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        Code Examples
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Need an API Key?</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                Generate an API key in your developer dashboard to start using the API.
                            </p>
                            <Link
                                href="/developer"
                                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                                Go to Developer Dashboard →
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {activeSection === "introduction" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">CollabChron API Documentation</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    Welcome to the CollabChron API documentation. This API allows you to programmatically access blog
                                    posts, user data, and statistics from the CollabChron platform.
                                </p>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 flex flex-wrap items-start gap-3">
                                    <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Base URL</h3>
                                        <p className="text-gray-700 dark:text-gray-300 flex flex-wrap">
                                            All API requests should be made to:{" "}
                                            <code className="bg-blue-100 flex flex-wrap dark:bg-blue-800 px-2 py-1 rounded text-blue-800 dark:text-blue-200 font-mono">
                                                {process.env.NEXT_PUBLIC_SITE_URL}/api/v1
                                            </code>
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">Getting Started</h2>
                                <p className="dark:text-gray-200">{"To use the CollabChron API, you'll need to:"}</p>
                                <ol className="list-decimal pl-6 mb-6 space-y-2">
                                    <li className="dark:text-gray-200">
                                        <Link href="/developer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            Generate an API key
                                        </Link>{" "}
                                        in your developer dashboard
                                    </li>
                                    <li className="dark:text-gray-200">Include your API key in the Authorization header of your requests</li>
                                    <li className="dark:text-gray-200">Make requests to the appropriate endpoints</li>
                                </ol>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">Available Resources</h2>
                                <div className="grid md:grid-cols-2 gap-4 mb-8">
                                    <div className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-lg mb-2 dark:text-gray-200">Posts</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                                            Access blog posts, including content, metadata, and statistics.
                                        </p>
                                        <button
                                            onClick={() => setActiveSection("posts")}
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                        >
                                            View Posts API →
                                        </button>
                                    </div>
                                    <div className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-lg mb-2 dark:text-gray-200">Users</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                                            Retrieve user profile information and user-specific content.
                                        </p>
                                        <button
                                            onClick={() => setActiveSection("users")}
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                        >
                                            View Users API →
                                        </button>
                                    </div>
                                    <div className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-lg mb-2 dark:text-gray-200">Stats</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                                            Get statistics about posts, users, and platform activity.
                                        </p>
                                        <button
                                            onClick={() => setActiveSection("stats")}
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                        >
                                            View Stats API →
                                        </button>
                                    </div>
                                    <div className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-lg mb-2 dark:text-gray-200">Code Examples</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                                            Sample code in various programming languages to help you get started.
                                        </p>
                                        <button
                                            onClick={() => setActiveSection("sdks")}
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                        >
                                            View Code Examples →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "authentication" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">Authentication</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    The CollabChron API uses API keys to authenticate requests. You can view and manage your API keys in
                                    the{" "}
                                    <Link href="/developer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                        Developer Dashboard
                                    </Link>
                                    .
                                </p>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6 flex items-start gap-3">
                                    <Shield className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">API Key Security</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Your API key carries many privileges, so be sure to keep it secure! Do not share your API key in
                                            publicly accessible areas such as GitHub, client-side code, or blog posts.
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4  dark:text-gray-200">Authentication Header</h2>
                                <p className="mb-4  dark:text-gray-300">
                                    Authentication to the API is performed via the <code>Authorization</code> header with a Bearer token.
                                    All API requests must include this header.
                                </p>

                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-mono text-sm text-gray-500 dark:text-gray-400">Authorization Header</p>
                                        <button
                                            onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY", "auth-header")}
                                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            aria-label="Copy to clipboard"
                                        >
                                            {copied["auth-header"] ? "Copied!" : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <pre className="font-mono text-sm overflow-x-auto">
                                        <code>Authorization: Bearer YOUR_API_KEY</code>
                                    </pre>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4  dark:text-gray-200">API Key Management</h2>
                                <p className="dark:text-gray-200">You can manage your API keys in the Developer Dashboard:</p>
                                <ul className="list-disc pl-6 mb-6 space-y-2">
                                    <li className="dark:text-gray-200">
                                        <strong className="dark:text-gray-200">Generate</strong> new API keys with descriptive names
                                    </li>
                                    <li className="dark:text-gray-200">
                                        <strong className="dark:text-gray-200">View</strong> your existing API keys
                                    </li>
                                    <li className="dark:text-gray-200">
                                        <strong className="dark:text-gray-200">Revoke</strong> API keys that are no longer needed
                                    </li>
                                </ul>

                                <div className="border dark:border-gray-700 rounded-lg p-6 mb-6">
                                    <h3 className="font-bold text-lg mb-3 dark:text-gray-200">API Key Lifecycle</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Generation</h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    Create a new API key in the Developer Dashboard with a descriptive name.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Storage</h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    Store your API key securely. It will only be shown once at creation time.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Usage</h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    Use your API key in the Authorization header for all API requests.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Rotation</h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    Periodically rotate your API keys for enhanced security.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                                                5
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Revocation</h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    Revoke API keys that are no longer needed or may have been compromised.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">API Key Permissions</h2>
                                <p className="mb-4 dark:text-gray-300">
                                    API keys have specific permissions that determine what actions they can perform. Currently, all API
                                    keys have read-only access to the following resources:
                                </p>
                                <ul className="list-disc pl-6 mb-6">
                                    <li className="dark:text-gray-200">
                                        <code>read:posts</code> - Access to post data
                                    </li>
                                    <li className="dark:text-gray-200">
                                        <code>read:profile</code> - Access to user profile data
                                    </li>
                                </ul>
                            </div>
                        </section>
                    )}

                    {activeSection === "posts" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">Posts API</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    The Posts API allows you to retrieve blog posts from the CollabChron platform.
                                </p>

                                <div className="space-y-12">
                                    {/* Get All Posts */}
                                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <p className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                                                    GET
                                                </p>
                                                <h3 className="font-mono text-sm md:text-base -mt-0 dark:text-gray-200">/api/v1/posts</h3>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-100 text-sm">Get all posts</p>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-lg mb-3">Get All Posts</h4>
                                            <p className="mb-4 dark:text-gray-300">
                                                Retrieves a paginated list of blog posts. You can filter posts by category and control
                                                pagination with query parameters.
                                            </p>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Query Parameters</h5>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Parameter
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Type
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Default
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Description
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">page</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                integer
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                1
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                Page number for pagination
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">limit</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                integer
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                20
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                Number of posts per page (max 100)
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">category</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                string
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                null
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                Filter posts by category slug
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Request</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">cURL</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts?page=1&limit=10&category=technology" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
                                                                "curl-posts",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["curl-posts"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts?page=1&limit=10&category=technology" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                                                </pre>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Response</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">JSON</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `{
  "posts": [
    {
      "id": "post_id_1",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "postDesc": "Learn how to build modern web applications with Next.js",
      "desc": "<p>Next.js is a React framework that enables server-side rendering...</p>",
      "img": "https://example.com/images/nextjs.jpg",
      "views": 1250,
      "catSlug": "technology",
      "createdAt": "2023-05-15T10:30:00Z",
      "updatedAt": "2023-05-16T08:15:00Z",
      "user": {
        "id": "user_id_1",
        "name": "Jane Doe",
        "image": "https://example.com/images/jane.jpg"
      }
    },
    // More posts...
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 48,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}`,
                                                                "json-posts",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["json-posts"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`{
  "posts": [
    {
      "id": "post_id_1",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "postDesc": "Learn how to build modern web applications with Next.js",
      "desc": "<p>Next.js is a React framework that enables server-side rendering...</p>",
      "img": "https://example.com/images/nextjs.jpg",
      "views": 1250,
      "catSlug": "technology",
      "createdAt": "2023-05-15T10:30:00Z",
      "updatedAt": "2023-05-16T08:15:00Z",
      "user": {
        "id": "user_id_1",
        "name": "Jane Doe",
        "image": "https://example.com/images/jane.jpg"
      }
    },
    // More posts...
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 48,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}`}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Get Latest Posts */}
                                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <p className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                                                    GET
                                                </p>
                                                <h3 className="font-mono text-sm md:text-base md:text-gray-300 -mt-0">/api/v1/posts/latest</h3>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Get latest posts</p>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-lg mb-3">Get Latest Posts</h4>
                                            <p className="mb-4 dark:text-gray-300">
                                                Retrieves the most recently published blog posts. You can control the number of posts returned
                                                with the limit parameter.
                                            </p>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Query Parameters</h5>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Parameter
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Type
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Default
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Description
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">limit</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                integer
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                10
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                Number of posts to return (max 50)
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Request</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">cURL</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts/latest?limit=5" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
                                                                "curl-latest",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["curl-latest"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts/latest?limit=5" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                                                </pre>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Response</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">JSON</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `[
  {
    "id": "post_id_1",
    "title": "The Future of AI in 2023",
    "slug": "the-future-of-ai-in-2023",
    "postDesc": "Exploring the latest advancements in artificial intelligence",
    "desc": "<p>Artificial intelligence continues to evolve at a rapid pace...</p>",
    "img": "https://example.com/images/ai-future.jpg",
    "views": 876,
    "catSlug": "technology",
    "createdAt": "2023-05-20T14:25:00Z",
    "updatedAt": "2023-05-20T14:25:00Z",
    "user": {
      "id": "user_id_2",
      "name": "John Smith",
      "image": "https://example.com/images/john.jpg"
    }
  },
  // More posts...
]`,
                                                                "json-latest",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["json-latest"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`[
  {
    "id": "post_id_1",
    "title": "The Future of AI in 2023",
    "slug": "the-future-of-ai-in-2023",
    "postDesc": "Exploring the latest advancements in artificial intelligence",
    "desc": "<p>Artificial intelligence continues to evolve at a rapid pace...</p>",
    "img": "https://example.com/images/ai-future.jpg",
    "views": 876,
    "catSlug": "technology",
    "createdAt": "2023-05-20T14:25:00Z",
    "updatedAt": "2023-05-20T14:25:00Z",
    "user": {
      "id": "user_id_2",
      "name": "John Smith",
      "image": "https://example.com/images/john.jpg"
    }
  },
  // More posts...
]`}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Get Post by ID */}
                                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <p className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                                                    GET
                                                </p>
                                                <h3 className="-mt-0 font-mono text-sm md:text-base md:text-gray-300">/api/v1/posts/:id</h3>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Get post by ID</p>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-lg mb-3">Get Post by ID</h4>
                                            <p className="mb-4 dark:text-gray-300">
                                                Retrieves a specific blog post by its ID. This endpoint also returns the post's comments and
                                                increments the view count.
                                            </p>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Path Parameters</h5>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Parameter
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Type
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Description
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">id</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                string
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                The unique identifier of the post
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Request</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">cURL</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts/post_id_1" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
                                                                "curl-post",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["curl-post"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts/post_id_1" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                                                </pre>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Response</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">JSON</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `{
  "id": "post_id_1",
  "title": "Getting Started with Next.js",
  "slug": "getting-started-with-nextjs",
  "postDesc": "Learn how to build modern web applications with Next.js",
  "desc": "<p>Next.js is a React framework that enables server-side rendering...</p>",
  "img": "https://example.com/images/nextjs.jpg",
  "views": 1251,
  "catSlug": "technology",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-16T08:15:00Z",
  "user": {
    "id": "user_id_1",
    "name": "Jane Doe",
    "image": "https://example.com/images/jane.jpg",
    "email": "jane@example.com"
  },
  "Comments": [
    {
      "id": "comment_id_1",
      "createdAt": "2023-05-16T12:45:00Z",
      "desc": "Great article! Very helpful for beginners.",
      "user": {
        "id": "user_id_2",
        "name": "John Smith",
        "image": "https://example.com/images/john.jpg"
      }
    },
    // More comments...
  ]
}`,
                                                                "json-post",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["json-post"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`{
  "id": "post_id_1",
  "title": "Getting Started with Next.js",
  "slug": "getting-started-with-nextjs",
  "postDesc": "Learn how to build modern web applications with Next.js",
  "desc": "<p>Next.js is a React framework that enables server-side rendering...</p>",
  "img": "https://example.com/images/nextjs.jpg",
  "views": 1251,
  "catSlug": "technology",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-16T08:15:00Z",
  "user": {
    "id": "user_id_1",
    "name": "Jane Doe",
    "image": "https://example.com/images/jane.jpg",
    "email": "jane@example.com"
  },
  "Comments": [
    {
      "id": "comment_id_1",
      "createdAt": "2023-05-16T12:45:00Z",
      "desc": "Great article! Very helpful for beginners.",
      "user": {
        "id": "user_id_2",
        "name": "John Smith",
        "image": "https://example.com/images/john.jpg"
      }
    },
    // More comments...
  ]
}`}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "users" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">Users API</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    The Users API allows you to retrieve information about the authenticated user, including profile data
                                    and posts.
                                </p>

                                <div className="space-y-12">
                                    {/* Get User Profile */}
                                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <p className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                                                    GET
                                                </p>
                                                <h3 className="font-mono text-sm md:text-base md:text-gray-300 -mt-0">/api/v1/users/profile</h3>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Get user profile</p>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-lg mb-3">Get User Profile</h4>
                                            <p className="mb-4 dark:text-gray-300">
                                                Retrieves the profile information of the authenticated user. This includes basic user details
                                                and social media links.
                                            </p>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Request</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">cURL</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/users/profile" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
                                                                "curl-profile",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["curl-profile"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/users/profile" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                                                </pre>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Response</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">JSON</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `{
  "id": "user_id_1",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "image": "https://example.com/images/jane.jpg",
  "about": "Full-stack developer and technical writer",
  "skills": "JavaScript, React, Node.js",
  "website": "https://janedoe.com",
  "twitter": "https://twitter.com/janedoe",
  "linkedin": "https://linkedin.com/in/janedoe",
  "facebook": null,
  "github": "https://github.com/janedoe",
  "instagram": "https://instagram.com/janedoe",
  "youtube": null,
  "buymeacoffee": "https://buymeacoffee.com/janedoe",
  "createdAt": "2023-01-15T08:30:00Z"
}`,
                                                                "json-profile",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["json-profile"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`{
  "id": "user_id_1",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "image": "https://example.com/images/jane.jpg",
  "about": "Full-stack developer and technical writer",
  "skills": "JavaScript, React, Node.js",
  "website": "https://janedoe.com",
  "twitter": "https://twitter.com/janedoe",
  "linkedin": "https://linkedin.com/in/janedoe",
  "facebook": null,
  "github": "https://github.com/janedoe",
  "instagram": "https://instagram.com/janedoe",
  "youtube": null,
  "buymeacoffee": "https://buymeacoffee.com/janedoe",
  "createdAt": "2023-01-15T08:30:00Z"
}`}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Get User Posts */}
                                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <p className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                                                    GET
                                                </p>
                                                <h3 className="font-mono text-sm md:text-base dark:text-gray-300 -mt-0">/api/v1/users/posts</h3>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Get user posts</p>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-lg mb-3">Get User Posts</h4>
                                            <p className="mb-4 dark:text-gray-300">
                                                Retrieves the posts created by the authenticated user. Results are paginated and include comment
                                                and clap counts.
                                            </p>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Query Parameters</h5>
                                            <div className="overflow-x-auto mb-6">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Parameter
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Type
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Default
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                            >
                                                                Description
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">page</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                integer
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                1
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                Page number for pagination
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">limit</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                integer
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                20
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                Number of posts per page (max 100)
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Request</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-center mb-2 dark:text-gray-300">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-300">cURL</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/users/posts?page=1&limit=10" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
                                                                "curl-user-posts",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["curl-user-posts"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/users/posts?page=1&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                                                </pre>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Response</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">JSON</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `{
  "posts": [
    {
      "id": "post_id_1",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "postDesc": "Learn how to build modern web applications with Next.js",
      "desc": "<p>Next.js is a React framework that enables server-side rendering...</p>",
      "img": "https://example.com/images/nextjs.jpg",
      "views": 1250,
      "catSlug": "technology",
      "createdAt": "2023-05-15T10:30:00Z",
      "updatedAt": "2023-05-16T08:15:00Z",
      "commentCount": 8,
      "clapCount": 42
    },
    // More posts...
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 27,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}`,
                                                                "json-user-posts",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["json-user-posts"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`{
  "posts": [
    {
      "id": "post_id_1",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-with-nextjs",
      "postDesc": "Learn how to build modern web applications with Next.js",
      "desc": "<p>Next.js is a React framework that enables server-side rendering...</p>",
      "img": "https://example.com/images/nextjs.jpg",
      "views": 1250,
      "catSlug": "technology",
      "createdAt": "2023-05-15T10:30:00Z",
      "updatedAt": "2023-05-16T08:15:00Z",
      "commentCount": 8,
      "clapCount": 42
    },
    // More posts...
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 27,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}`}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "stats" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">Stats API</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    The Stats API provides statistics about the authenticated user's content and engagement.
                                </p>

                                <div className="space-y-12">
                                    {/* Get User Stats */}
                                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <p className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                                                    GET
                                                </p>
                                                <h3 className="font-mono text-sm md:text-base dark:text-gray-200 -mt-0">/api/v1/users/stats</h3>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Get user statistics</p>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-lg mb-3">Get User Statistics</h4>
                                            <p className="mb-4 dark:text-gray-300">
                                                Retrieves comprehensive statistics about the authenticated user's content and engagement,
                                                including post counts, views, followers, and more.
                                            </p>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Request</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">cURL</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/users/stats" \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
                                                                "curl-stats",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["curl-stats"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`curl -X GET "${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/users/stats" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                                                </pre>
                                            </div>

                                            <h5 className="font-semibold mt-6 mb-2 dark:text-gray-200">Example Response</h5>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-mono text-sm text-gray-500 dark:text-gray-400">JSON</p>
                                                    <button
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `{
  "overview": {
    "postCount": 27,
    "totalViews": 15680,
    "followerCount": 142,
    "followingCount": 87,
    "totalClaps": 358,
    "totalComments": 96
  },
  "topPosts": [
    {
      "id": "post_id_3",
      "title": "Understanding React Hooks",
      "slug": "understanding-react-hooks",
      "views": 3245,
      "createdAt": "2023-03-10T09:15:00Z"
    },
    {
      "id": "post_id_7",
      "title": "Building a REST API with Node.js",
      "slug": "building-a-rest-api-with-nodejs",
      "views": 2187,
      "createdAt": "2023-02-22T14:30:00Z"
    },
    // More top posts...
  ],
  "categoryDistribution": [
    {
      "category": "technology",
      "count": 15
    },
    {
      "category": "coding",
      "count": 8
    },
    {
      "category": "education",
      "count": 4
    }
    // More categories...
  ]
}`,
                                                                "json-stats",
                                                            )
                                                        }
                                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        aria-label="Copy to clipboard"
                                                    >
                                                        {copied["json-stats"] ? "Copied!" : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{`{
  "overview": {
    "postCount": 27,
    "totalViews": 15680,
    "followerCount": 142,
    "followingCount": 87,
    "totalClaps": 358,
    "totalComments": 96
  },
  "topPosts": [
    {
      "id": "post_id_3",
      "title": "Understanding React Hooks",
      "slug": "understanding-react-hooks",
      "views": 3245,
      "createdAt": "2023-03-10T09:15:00Z"
    },
    {
      "id": "post_id_7",
      "title": "Building a REST API with Node.js",
      "slug": "building-a-rest-api-with-nodejs",
      "views": 2187,
      "createdAt": "2023-02-22T14:30:00Z"
    },
    // More top posts...
  ],
  "categoryDistribution": [
    {
      "category": "technology",
      "count": 15
    },
    {
      "category": "coding",
      "count": 8
    },
    {
      "category": "education",
      "count": 4
    }
    // More categories...
  ]
}`}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "errors" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">Error Handling</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    The CollabChron API uses conventional HTTP response codes to indicate the success or failure of an API
                                    request.
                                </p>

                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 flex items-start gap-3">
                                    <AlertTriangle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-red-700 dark:text-red-300 mb-1">Error Response Format</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            All error responses include a JSON object with an <code>error</code> field that contains a
                                            human-readable message.
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">HTTP Status Codes</h2>
                                <div className="overflow-x-auto mb-6">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Status Code
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                                                    <p className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs">
                                                        200 - OK
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The request was successful.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                                                    <p className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs">
                                                        400 - Bad Request
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The request was invalid or cannot be otherwise served. An accompanying error message will
                                                    explain the issue.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                                                    <p className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs">
                                                        401 - Unauthorized
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    Authentication is required and has failed or has not been provided.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                                                    <p className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs">
                                                        403 - Forbidden
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The request is understood, but it has been refused or access is not allowed.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                                                    <p className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs">
                                                        404 - Not Found
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The requested resource does not exist.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                                                    <p className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs">
                                                        429 - Too Many Requests
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The request limit has been exceeded. Try again later.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                                                    <p className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs">
                                                        500 - Internal Server Error
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    Something went wrong on our end. Please try again later.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">Error Examples</h2>

                                <h3 className="font-semibold mt-6 mb-2 dark:text-gray-200">Invalid API Key</h3>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                    <pre className="font-mono text-sm overflow-x-auto">
                                        <code>{`{
  "error": "Invalid API key"
}`}</code>
                                    </pre>
                                </div>

                                <h3 className="font-semibold mt-6 mb-2 dark:text-gray-200">Resource Not Found</h3>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                    <pre className="font-mono text-sm overflow-x-auto">
                                        <code>{`{
  "error": "Post not found"
}`}</code>
                                    </pre>
                                </div>

                                <h3 className="font-semibold mt-6 mb-2 dark:text-gray-200">Rate Limit Exceeded</h3>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                    <pre className="font-mono text-sm overflow-x-auto">
                                        <code>{`{
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "reset": 1620000000
}`}</code>
                                    </pre>
                                </div>

                                <h3 className="font-semibold mt-6 mb-2 dark:text-gray-200">Invalid Parameters</h3>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                    <pre className="font-mono text-sm overflow-x-auto">
                                        <code>{`{
  "error": "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100."
}`}</code>
                                    </pre>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "ratelimits" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">Rate Limits</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    To ensure the stability and availability of the CollabChron API, rate limits are enforced on all API
                                    endpoints.
                                </p>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6 flex items-start gap-3">
                                    <Clock className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                                    <div>
                                        <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Rate Limit Headers</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            All API responses include headers that provide information about your current rate limit status.
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">Rate Limit Rules</h2>
                                <p className="mb-4 dark:text-gray-300">The CollabChron API enforces the following rate limits:</p>
                                <ul className="list-disc pl-6 mb-6 space-y-2">
                                    <li className="dark:text-gray-300">
                                        <strong className="dark:text-gray-200">100 requests per hour</strong> per API key
                                    </li>
                                    <li className="dark:text-gray-200">
                                        <strong className="dark:text-gray-200">1000 requests per day</strong> per API key
                                    </li>
                                </ul>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">Rate Limit Headers</h2>
                                <p className="mb-4 dark:text-gray-300">
                                    The following headers are included in all API responses to help you track your rate limit usage:
                                </p>
                                <div className="overflow-x-auto mb-6">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Header
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">X-RateLimit-Limit</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The maximum number of requests you're permitted to make per hour.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">X-RateLimit-Remaining</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The number of requests remaining in the current rate limit window.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">X-RateLimit-Reset</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    The time at which the current rate limit window resets, in Unix epoch seconds.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">Exceeding Rate Limits</h2>
                                <p className="mb-4 dark:text-gray-300">
                                    If you exceed the rate limit, you will receive a <code>429 Too Many Requests</code> response with an
                                    error message indicating when you can try again.
                                </p>

                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                                    <pre className="font-mono text-sm overflow-x-auto">
                                        <code>{`HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1620000000

{
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "reset": 1620000000
}`}</code>
                                    </pre>
                                </div>

                                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-gray-200">Best Practices</h2>
                                <p className="mb-4 dark:text-gray-300">
                                    To avoid hitting rate limits, consider implementing the following best practices:
                                </p>
                                <ul className="list-disc pl-6 mb-6 space-y-2">
                                    <li className="dark:text-gray-300">
                                        <strong className="dark:text-gray-200">Cache responses</strong> when appropriate to reduce the number of API calls.
                                    </li>
                                    <li className="dark:text-gray-200">
                                        <strong className="dark:text-gray-200">Implement exponential backoff</strong> when retrying failed requests.
                                    </li>
                                    <li className="dark:text-gray-200">
                                        <strong className="dark:text-gray-200">Monitor your usage</strong> using the rate limit headers.
                                    </li>
                                    <li className="dark:text-gray-200">
                                        <strong className="dark:text-gray-200">Spread requests evenly</strong> over time instead of making bursts of requests.
                                    </li>
                                </ul>
                            </div>
                        </section>
                    )}

                    {activeSection === "sdks" && (
                        <section>
                            <h1 className="text-3xl font-bold mb-6">Code Examples</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
                                    The following examples demonstrate how to use the CollabChron API in various programming languages.
                                </p>

                                <Tabs defaultValue="javascript" className="w-full">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                        <TabsTrigger value="python">Python</TabsTrigger>
                                        <TabsTrigger value="php">PHP</TabsTrigger>
                                        <TabsTrigger value="ruby">Ruby</TabsTrigger>
                                        <TabsTrigger value="go">Go</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="javascript" className="mt-6">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                            <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-gray-700">
                                                <p className="font-medium">JavaScript</p>
                                                <button
                                                    onClick={() => copyToClipboard(codeExamples.javascript, "js-code")}
                                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    aria-label="Copy to clipboard"
                                                >
                                                    {copied["js-code"] ? "Copied!" : <Copy size={16} />}
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <CopyBlock
                                                    text={codeExamples.javascript}
                                                    language="javascript"
                                                    showLineNumbers={true}
                                                    theme={theme === "dark" ? dracula : undefined}
                                                    wrapLines
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="python" className="mt-6">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                            <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-gray-700">
                                                <p className="font-medium">Python</p>
                                                <button
                                                    onClick={() => copyToClipboard(codeExamples.python, "python-code")}
                                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    aria-label="Copy to clipboard"
                                                >
                                                    {copied["python-code"] ? "Copied!" : <Copy size={16} />}
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <CopyBlock
                                                    text={codeExamples.python}
                                                    language="python"
                                                    showLineNumbers={true}
                                                    theme={theme === "dark" ? dracula : undefined}
                                                    wrapLines
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="php" className="mt-6">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                            <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-gray-700">
                                                <p className="font-medium">PHP</p>
                                                <button
                                                    onClick={() => copyToClipboard(codeExamples.php, "php-code")}
                                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    aria-label="Copy to clipboard"
                                                >
                                                    {copied["php-code"] ? "Copied!" : <Copy size={16} />}
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <CopyBlock
                                                    text={codeExamples.php}
                                                    language="php"
                                                    showLineNumbers={true}
                                                    theme={theme === "dark" ? dracula : undefined}
                                                    wrapLines
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="ruby" className="mt-6">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                            <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-gray-700">
                                                <p className="font-medium">Ruby</p>
                                                <button
                                                    onClick={() => copyToClipboard(codeExamples.ruby, "ruby-code")}
                                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    aria-label="Copy to clipboard"
                                                >
                                                    {copied["ruby-code"] ? "Copied!" : <Copy size={16} />}
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <CopyBlock
                                                    text={codeExamples.ruby}
                                                    language="ruby"
                                                    showLineNumbers={true}
                                                    theme={theme === "dark" ? dracula : undefined}
                                                    wrapLines
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="go" className="mt-6">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                            <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-gray-700">
                                                <p className="font-medium">Go</p>
                                                <button
                                                    onClick={() => copyToClipboard(codeExamples.go, "go-code")}
                                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    aria-label="Copy to clipboard"
                                                >
                                                    {copied["go-code"] ? "Copied!" : <Copy size={16} />}
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <CopyBlock
                                                    text={codeExamples.go}
                                                    language="go"
                                                    showLineNumbers={true}
                                                    theme={theme === "dark" ? dracula : undefined}
                                                    wrapLines
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <h2 className="text-2xl font-bold mt-12 mb-4 dark:text-gray-200">Using the API with Popular Frameworks</h2>
                                <p className="mb-6 dark:text-gray-300">
                                    Here are some examples of how to use the CollabChron API with popular frameworks and libraries.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="border dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 dark:text-gray-200">
                                            <p>React</p>
                                            <ExternalLink size={16} className="text-gray-500" />
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            Using the CollabChron API with React and the fetch API or axios.
                                        </p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-sm">
                                            <code>{`import { useState, useEffect } from 'react';

function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          '${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/posts/latest',
          {
            headers: {
              'Authorization': 'Bearer YOUR_API_KEY'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Latest Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}`}</code>
                                        </pre>
                                    </div>

                                    <div className="border dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 dark:text-gray-200">
                                            <p>Node.js</p>
                                            <ExternalLink size={16} className="text-gray-500" />
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            Using the CollabChron API with Node.js and axios.
                                        </p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-sm">
                                            <code>{`const axios = require('axios');

async function getUserStats() {
  try {
    const response = await axios.get(
      '${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/users/stats',
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      }
    );
    
    console.log('User Stats:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    throw error;
  }
}

getUserStats().catch(console.error);`}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}

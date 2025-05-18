"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Copy, Eye, EyeOff, Key, RefreshCw, Trash2 } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { NavigationMenu, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function DeveloperPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [apiKeys, setApiKeys] = useState([])
    const [loading, setLoading] = useState(true)
    const [keyName, setKeyName] = useState("")
    const [showKeys, setShowKeys] = useState({})
    const [generatingKey, setGeneratingKey] = useState(false)
    const [newKey, setNewKey] = useState(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated") {
            fetchApiKeys()
            testApiKey()
        }
    }, [status, router])

    const testApiKey = async () => {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:3000/api/v1/users/stats', {
                headers: {
                    'Authorization': 'cc_b1be776ca5b9875d9da05b09c853845353a91d4dfd0567c2'
                }
            });
            if (response.ok) {
                const data = await response.json()
                console.log("======", data);
            } else {
                toast.error("Failed to fetch API keys")
            }
        } catch (error) {
            console.error("Error fetching API keys:", error)
            toast.error("An error occurred while fetching API keys")
        } finally {
            setLoading(false)
        }
    }

    const fetchApiKeys = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/developer`)
            if (res.ok) {
                const data = await res.json()
                setApiKeys(data)
            } else {
                toast.error("Failed to fetch API keys")
            }
        } catch (error) {
            console.error("Error fetching API keys:", error)
            toast.error("An error occurred while fetching API keys")
        } finally {
            setLoading(false)
        }
    }

    const generateApiKey = async () => {
        if (!keyName.trim()) {
            toast.error("Please enter a name for your API key")
            return
        }

        try {
            setGeneratingKey(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/developer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: keyName }),
            })

            if (res.ok) {
                const data = await res.json()
                setNewKey(data)
                toast.success("API key generated successfully")
                setKeyName("")
                fetchApiKeys()
            } else {
                const error = await res.json()
                toast.error(error.message || "Failed to generate API key")
            }
        } catch (error) {
            console.error("Error generating API key:", error)
            toast.error("An error occurred while generating API key")
        } finally {
            setGeneratingKey(false)
        }
    }

    const revokeApiKey = async (keyId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/developer/keys/${keyId}`, {
                method: "DELETE",
            })

            if (res.ok) {
                toast.success("API key revoked successfully")
                fetchApiKeys()
            } else {
                const error = await res.json()
                toast.error(error.message || "Failed to revoke API key")
            }
        } catch (error) {
            console.error("Error revoking API key:", error)
            toast.error("An error occurred while revoking API key")
        }
    }

    const toggleShowKey = (keyId) => {
        setShowKeys((prev) => ({
            ...prev,
            [keyId]: !prev[keyId],
        }))
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    if (status === "loading" || loading) {
        return (
            <div className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6">Developer API</h1>
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="animate-spin h-8 w-8 text-gray-500" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Toaster />
            <div className="flex flex-row items-center justify-evenly">
                <h1 className="text-xl md:text-3xl font-bold mb-6 sm:text-base">Developer API</h1>
                <NavigationMenu className="-mt-5">
                    <Link href="/developer/docs" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            API Documentation
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenu>
            </div>
            <p className="text-lg mb-8">
                Generate API keys to access CollabChron data programmatically. Use these keys to build applications,
                integrations, or analyze your content.
            </p>

            {newKey && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">New API Key Generated</h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                        This is the only time your full API key will be shown. Please copy it now and store it securely.
                    </p>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded border border-green-300 dark:border-green-700">
                        <code className="text-sm font-mono flex-1 overflow-x-auto">{newKey.key}</code>
                        <button
                            onClick={() => copyToClipboard(newKey.key)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            aria-label="Copy API key"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                    <button
                        onClick={() => setNewKey(null)}
                        className="mt-3 text-sm text-green-700 dark:text-green-300 hover:underline"
                    >
                        {"I've copied my key"}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Generate New API Key</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="mb-4">
                            <label htmlFor="keyName" className="block text-sm font-medium mb-1">
                                Key Name
                            </label>
                            <input
                                type="text"
                                id="keyName"
                                value={keyName}
                                onChange={(e) => setKeyName(e.target.value)}
                                placeholder="e.g., My Application"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                            />
                        </div>
                        <button
                            onClick={generateApiKey}
                            disabled={generatingKey || !keyName}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400"
                        >
                            {generatingKey ? (
                                <>
                                    <RefreshCw className="animate-spin h-4 w-4" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Key size={16} />
                                    Generate API Key
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Your API Keys</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        {apiKeys.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                {"You haven't generated any API keys yet."}
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {apiKeys.map((key) => (
                                    <li key={key.id} className="py-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{key.name}</h3>
                                                <div className="flex items-center mt-1">
                                                    <div className="font-mono text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                                        {showKeys[key.id]
                                                            ? key.key
                                                            : `${key.key.substring(0, 8)}...${key.key.substring(key.key.length - 4)}`}
                                                        <button
                                                            onClick={() => toggleShowKey(key.id)}
                                                            className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                            aria-label={showKeys[key.id] ? "Hide API key" : "Show API key"}
                                                        >
                                                            {showKeys[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                        </button>
                                                        <button
                                                            variant="outline"
                                                            onClick={() => copyToClipboard(key.key)}
                                                            className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                            aria-label="Copy API key"
                                                        >
                                                            <Copy size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Created: {new Date(key.createdAt).toLocaleDateString()}
                                                    {key.lastUsedAt && ` • Last used: ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                                                </div>
                                            </div>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-800 dark:hover:text-red-400 dark:bg-gray-300"
                                                        aria-label="Revoke API key"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center justify-center">Delete Your API Key</DialogTitle>
                                                        <DialogDescription>
                                                            {"Are you sure you want to revoke this API key? This action cannot be undone."}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="flex items-center justify-between">
                                                        <Button variant="destructive"
                                                            onClick={() => revokeApiKey(key.id)} >Revoke</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

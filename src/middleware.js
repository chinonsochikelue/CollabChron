import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"
import { rateLimit, getRateLimitResponse } from "./app/api/v1/rate-limit"

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const path = request.nextUrl.pathname

  // Check if the path is an API v1 route
  if (path.startsWith(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v1`)) {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 })
    }

    // Extract the API key
    const apiKey = authHeader.split(" ")[1]

    try {
      // Find the API key in the database
      const keyData = await prisma.apiKey.findUnique({
        where: {
          key: apiKey,
          isRevoked: false,
        },
        include: {
          user: true,
        },
      })

      // Check if the API key exists and is valid
      if (!keyData) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }

      // Check if the API key has expired
      if (keyData.expiresAt && new Date(keyData.expiresAt) < new Date()) {
        return NextResponse.json({ error: "API key has expired" }, { status: 401 })
      }

      // Add the user and API key info to the request
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-api-user", keyData.user.id)
      requestHeaders.set("x-api-key-id", keyData.id)
      requestHeaders.set("x-api-permissions", JSON.stringify(keyData.permissions))

      // Apply rate limiting
      const rateLimitResult = await rateLimit(request)
      const rateLimitResponse = getRateLimitResponse(rateLimitResult)

      if (rateLimitResponse) {
        return rateLimitResponse
      }

      // Update the last used timestamp
      await prisma.apiKey.update({
        where: {
          id: keyData.id,
        },
        data: {
          lastUsedAt: new Date(),
        },
      })

      // Continue with the modified request
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      // Add rate limit headers to the response
      response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString())
      response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
      response.headers.set("X-RateLimit-Reset", rateLimitResult.reset.toString())

      return response
    } catch (error) {
      console.error("Error validating API key:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }

  // For non-API routes, continue normally
  return NextResponse.next()
}

// Configure the middleware to only run on API v1 routes
export const config = {
  matcher: `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/:path*`,
}

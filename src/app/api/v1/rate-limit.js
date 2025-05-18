import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 // 1 hour in seconds
const RATE_LIMIT_MAX = 100 // 100 requests per hour

export async function rateLimit(request) {
  try {
    // Get the API key from the request headers
    const apiKeyId = request.headers.get("x-api-key-id")

    if (!apiKeyId) {
      return {
        success: false,
        error: "API key not found",
      }
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const rateLimitKey = `ratelimit:${apiKeyId}`

    // Get current rate limit data
    const rateLimitData = await redis.get(rateLimitKey)

    if (!rateLimitData) {
      // First request, initialize rate limit data
      await redis.set(
        rateLimitKey,
        JSON.stringify({
          count: 1,
          reset: currentTime + RATE_LIMIT_WINDOW,
        }),
        { ex: RATE_LIMIT_WINDOW },
      )

      return {
        success: true,
        limit: RATE_LIMIT_MAX,
        remaining: RATE_LIMIT_MAX - 1,
        reset: currentTime + RATE_LIMIT_WINDOW,
      }
    }

    // Parse existing rate limit data
    const { count, reset } = JSON.parse(rateLimitData)

    // Check if the rate limit window has expired
    if (currentTime > reset) {
      // Reset the rate limit
      await redis.set(
        rateLimitKey,
        JSON.stringify({
          count: 1,
          reset: currentTime + RATE_LIMIT_WINDOW,
        }),
        { ex: RATE_LIMIT_WINDOW },
      )

      return {
        success: true,
        limit: RATE_LIMIT_MAX,
        remaining: RATE_LIMIT_MAX - 1,
        reset: currentTime + RATE_LIMIT_WINDOW,
      }
    }

    // Check if the rate limit has been exceeded
    if (count >= RATE_LIMIT_MAX) {
      return {
        success: false,
        error: `Rate limit exceeded. Try again in ${reset - currentTime} seconds.`,
        limit: RATE_LIMIT_MAX,
        remaining: 0,
        reset,
      }
    }

    // Increment the request count
    await redis.set(
      rateLimitKey,
      JSON.stringify({
        count: count + 1,
        reset,
      }),
      { ex: reset - currentTime },
    )

    return {
      success: true,
      limit: RATE_LIMIT_MAX,
      remaining: RATE_LIMIT_MAX - (count + 1),
      reset,
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // If there's an error with rate limiting, allow the request to proceed
    return {
      success: true,
      limit: RATE_LIMIT_MAX,
      remaining: RATE_LIMIT_MAX,
      reset: Math.floor(Date.now() / 1000) + RATE_LIMIT_WINDOW,
    }
  }
}

export function getRateLimitResponse(rateLimitResult) {
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.error },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        },
      },
    )
  }

  return null
}

export function addRateLimitHeaders(response, rateLimitResult) {
  response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString())
  response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString())
  response.headers.set("X-RateLimit-Reset", rateLimitResult.reset.toString())

  return response
}

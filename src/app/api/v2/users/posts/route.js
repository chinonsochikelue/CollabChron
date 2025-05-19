import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Step 1: Get API key from Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKey = authHeader.split(" ")[1]

    // Step 2: Find the API key in the database
    const keyRecord = await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
      },
      include: {
        user: true,
      },
    })

    // Step 3: Validate the API key
    if (!keyRecord || keyRecord.isRevoked || !keyRecord.user) {
      return NextResponse.json({ error: "Invalid or revoked API key" }, { status: 401 })
    }

    const user = keyRecord.user

    // Step 4: Parse pagination parameters
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100." },
        { status: 400 },
      )
    }

    // Step 5: Fetch the user's posts
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        where: {
          userEmail: user.email,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Comments: {
            select: { id: true },
          },
          Clap: {
            select: { id: true },
          },
        },
      }),
      prisma.post.count({
        where: {
          userEmail: user.email,
        },
      }),
    ])

    // Step 6: Format response
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const transformedPosts = posts.map((post) => ({
      ...post,
      commentCount: post.Comments.length,
      clapCount: post.Clap.length,
      Comments: undefined,
      Clap: undefined,
    }))

    return NextResponse.json({
      posts: transformedPosts,
      meta: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

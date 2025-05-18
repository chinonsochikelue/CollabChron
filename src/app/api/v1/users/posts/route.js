import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"

// GET - Fetch the authenticated user's posts
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    // Get the user ID from the request headers (set by middleware)
    const userId = session?.user?.email
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get pagination parameters
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100." },
        { status: 400 },
      )
    }

    // Get the user's email
    const user = await prisma.user.findUnique({
      where: {
        email: userId,
      },
      select: {
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch the user's posts
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
            select: {
              id: true,
            },
          },
          Clap: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.post.count({
        where: {
          userEmail: user.email,
        },
      }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Transform the posts to include comment and clap counts
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

import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"

// GET - Fetch the authenticated user's statistics
export async function GET(req) {
  try {
      const session = await getServerSession(authOptions)
      
      // Get the user ID from the request headers (set by middleware)
      const userId = session?.user?.email

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Fetch various statistics
    const [postCount, totalViews, followerCount, followingCount, totalClaps, totalComments] = await prisma.$transaction(
      [
        // Total posts
        prisma.post.count({
          where: {
            userEmail: user.email,
          },
        }),

        // Total views across all posts
        prisma.post.aggregate({
          where: {
            userEmail: user.email,
          },
          _sum: {
            views: true,
          },
        }),

        // Follower count
        prisma.following.count({
          where: {
            followingId: userId,
          },
        }),

        // Following count
        prisma.following.count({
          where: {
            followerId: user.email,
          },
        }),

        // Total claps received on posts
        prisma.clap.count({
          where: {
            post: {
              userEmail: user.email,
            },
          },
        }),

        // Total comments on posts
        prisma.comment.count({
          where: {
            post: {
              userEmail: user.email,
            },
          },
        }),
      ],
    )

    // Get most viewed posts
    const topPosts = await prisma.post.findMany({
      where: {
        userEmail: user.email,
      },
      orderBy: {
        views: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        createdAt: true,
      },
    })

    // Get post distribution by category
    const categoryDistribution = await prisma.post.groupBy({
      by: ["catSlug"],
      where: {
        userEmail: user.email,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    })

    // Compile all statistics
    const stats = {
      overview: {
        postCount,
        totalViews: totalViews._sum.views || 0,
        followerCount,
        followingCount,
        totalClaps,
        totalComments,
      },
      topPosts,
      categoryDistribution: categoryDistribution.map((cat) => ({
        category: cat.catSlug,
        count: cat._count.id,
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

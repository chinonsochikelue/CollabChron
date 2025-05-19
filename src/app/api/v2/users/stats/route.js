import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req) {
  try {
    // Step 1: Extract API key from Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKey = authHeader.split(" ")[1]

    // Step 2: Lookup API key in the database
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    })

    // Step 3: Validate API key and associated user
    if (
      !keyRecord ||
      keyRecord.isRevoked ||
      !keyRecord.user ||
      (keyRecord.expiresAt && new Date() > keyRecord.expiresAt)
    ) {
      return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 })
    }

    const user = keyRecord.user
    const userId = user.id
    const userEmail = user.email

    // Step 4: Fetch statistics
    const [
      postCount,
      totalViews,
      followerCount,
      followingCount,
      totalClaps,
      totalComments,
    ] = await prisma.$transaction([
      prisma.post.count({
        where: { userEmail },
      }),
      prisma.post.aggregate({
        where: { userEmail },
        _sum: { views: true },
      }),
      prisma.following.count({
        where: { followingId: userId },
      }),
      prisma.following.count({
        where: { followerId: userEmail },
      }),
      prisma.clap.count({
        where: {
          post: {
            userEmail,
          },
        },
      }),
      prisma.comment.count({
        where: {
          post: {
            userEmail,
          },
        },
      }),
    ])

    // Step 5: Get top posts by views
    const topPosts = await prisma.post.findMany({
      where: { userEmail },
      orderBy: { views: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        createdAt: true,
      },
    })

    // Step 6: Get category distribution
    const categoryDistribution = await prisma.post.groupBy({
      by: ["catSlug"],
      where: { userEmail },
      _count: { id: true },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    })

    // Step 7: Format and return stats
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

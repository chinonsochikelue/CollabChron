import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// GET - Fetch latest posts
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Validate limit parameter
    if (limit < 1 || limit > 50) {
      return NextResponse.json({ error: "Invalid limit parameter. Limit must be between 1 and 50." }, { status: 400 })
    }

    // Fetch the latest posts
    const posts = await prisma.post.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching latest posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

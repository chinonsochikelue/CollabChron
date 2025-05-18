import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"

// GET - Fetch the authenticated user's profile
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    // Get the user ID from the request headers (set by middleware)
    const userId = session?.user?.email

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the user profile
    const user = await prisma.user.findUnique({
      where: {
        email: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        about: true,
        skills: true,
        website: true,
        twitter: true,
        linkedin: true,
        facebook: true,
        github: true,
        instagram: true,
        youtube: true,
        buymeacoffee: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

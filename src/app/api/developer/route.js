import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"
import crypto from "crypto"

// GET - Fetch all API keys for the authenticated user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        user: {
          email: session.user.email,
        },
        isRevoked: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST - Generate a new API key
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name } = body

    if (!name || name.trim() === "") {
      return NextResponse.json({ message: "API key name is required" }, { status: 400 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user already has too many API keys (limit to 5)
    const keyCount = await prisma.apiKey.count({
      where: {
        userId: user.id,
        isRevoked: false,
      },
    })

    if (keyCount >= 5) {
      return NextResponse.json(
        {
          message:
            "You have reached the maximum number of API keys (5). Please revoke an existing key before creating a new one.",
        },
        { status: 400 },
      )
    }

    // Generate a random API key
    const apiKey = `cc_${crypto.randomBytes(24).toString("hex")}`

    // Create the API key in the database
    const newApiKey = await prisma.apiKey.create({
      data: {
        key: apiKey,
        name,
        userId: user.id,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        permissions: ["read:posts", "read:profile"],
      },
    })

    return NextResponse.json(newApiKey)
  } catch (error) {
    console.error("Error generating API key:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

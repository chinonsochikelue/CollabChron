import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"
import prisma from "@/lib/prismadb"
import { NextResponse } from "next/server"

// DELETE - Revoke an API key
export async function DELETE(req, { params }) {
  console.log("==========", params)
  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
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

    // Find the API key
    const apiKey = await prisma.apiKey.findUnique({
      where: {
        id,
      },
    })

    if (!apiKey) {
      return NextResponse.json({ message: "API key not found" }, { status: 404 })
    }

    // Check if the API key belongs to the user
    if (apiKey.userId !== user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Revoke the API key
    await prisma.apiKey.update({
      where: {
        id,
      },
      data: {
        isRevoked: true,
      },
    })

    return NextResponse.json({ message: "API key revoked successfully" })
  } catch (error) {
    console.error("Error revoking API key:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

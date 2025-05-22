import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

// GET /api/users/[userId]/social-accounts - Fetch user's social accounts
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  const { userId } = params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional: Add check to ensure only the authenticated user or an admin can access this
  if (session.user.id !== userId && !session.user.isAdmin) { // Assuming isAdmin flag for admins
     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const userSocialAccounts = await prisma.userSocialAccount.findMany({
      where: {
        userId: userId,
      },
      // Select only necessary fields if needed, e.g., to avoid exposing sensitive details unintentionally
      // select: { id: true, platform: true, apiKey: true, apiSecret: true /* other fields */ }
    });

    if (!userSocialAccounts) {
      return NextResponse.json({ error: "No social accounts found for this user" }, { status: 404 });
    }

    return NextResponse.json(userSocialAccounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching user social accounts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

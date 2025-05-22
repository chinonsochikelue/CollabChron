import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
// No session needed for site-wide accounts if they are public or accessed by a system role.
// However, if you want to restrict this endpoint, you might add session validation.

// GET /api/site-social-accounts - Fetch site's social accounts
export async function GET(req) {
  // Optional: Add authentication/authorization if this endpoint should be protected
  // For example, only allow admins or specific system roles to access this.
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user.isAdmin) {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  try {
    const siteSocialAccounts = await prisma.siteSocialAccount.findMany({
      // Select only necessary fields if needed
      // select: { id: true, platform: true, apiKey: true, /* other fields */ }
    });

    if (!siteSocialAccounts || siteSocialAccounts.length === 0) {
      return NextResponse.json({ error: "No site social accounts found" }, { status: 404 });
    }

    return NextResponse.json(siteSocialAccounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching site social accounts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

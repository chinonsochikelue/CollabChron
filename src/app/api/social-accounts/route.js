import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

// POST /api/social-accounts - Connect a social media account
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { platform, apiKey, apiSecret, accessToken } = body;
    const userId = session.user.id; // Get userId from session

    if (!userId || !platform || !apiKey || !accessToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // For some providers, apiSecret might not be available or necessary post-OAuth
    // Handle it being optional or ensure it's always provided if your logic requires it.
    const socialAccount = await prisma.userSocialAccount.create({
      data: {
        userId,
        platform,
        apiKey,
        apiSecret: apiSecret || null, // Make apiSecret optional or handle as needed
        accessToken,
      },
    });

    return NextResponse.json(socialAccount, { status: 201 });
  } catch (error) {
    console.error("Error connecting social account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/social-accounts - Disconnect a social media account
export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { platform } = body; // userId will be taken from session
    const userId = session.user.id;

    if (!userId || !platform) {
      return NextResponse.json({ error: "Missing required fields (userId, platform)" }, { status: 400 });
    }

    const existingAccount = await prisma.userSocialAccount.findFirst({
      where: {
        userId,
        platform,
      },
    });

    if (!existingAccount) {
      return NextResponse.json({ error: "Social account not found for this user and platform" }, { status: 404 });
    }

    await prisma.userSocialAccount.delete({
      where: {
        id: existingAccount.id,
      },
    });

    return NextResponse.json({ message: "Social account disconnected successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error disconnecting social account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

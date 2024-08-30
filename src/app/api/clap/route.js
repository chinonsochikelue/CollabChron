import { getAuthSession } from "@/utils/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET ALL CLAPS FOR A POST
export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  try {
    const claps = await prisma.clap.findMany({
      where: {
        ...(postId && { postId }),
      },
      include: { user: true }, // Include user information if needed
    });

    const clapCount = await prisma.clap.count({
      where: { postId },
    });

    return new NextResponse(JSON.stringify(claps, clapCount), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }), 
      { status: 500 }
    );
  }
};

// CREATE OR UPDATE A CLAP
export const POST = async (req) => {
  const session = await getAuthSession();
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");


  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }), 
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const clap = await prisma.clap.create({
      data: { ...body, userEmail: session.user.email },
    });

    return new NextResponse(JSON.stringify(clap), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }), 
      { status: 500 }
    );
  }
};

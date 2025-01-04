import { getAuthSession } from "@/utils/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET ALL COMMENTS OF A POST
export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const postSlug = searchParams.get("postSlug");

  try {
    const comments = await prisma.comment.findMany({
      where: {
        ...(postSlug && { postSlug }),
      },
      include: { user: true },
    });

    return new NextResponse(JSON.stringify(comments, { status: 200 }));
  } catch (err) {
    // console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// CREATE A COMMENT
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }, { status: 401 })
    );
  }

  try {
    const body = await req.json();
    const comment = await prisma.comment.create({
      data: { ...body, userEmail: session.user.email },
    });

    return new NextResponse(JSON.stringify(comment, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};



// CLAP A COMMENT
export const POST_CLAP = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated!" }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { commentId } = body;

    if (!commentId) {
      return new NextResponse(
        JSON.stringify({ message: "Comment ID is required!" }),
        { status: 400 }
      );
    }

    // Check if clap exists for the user and comment
    let clap = await prisma.clap.findFirst({
      where: {
        userId: session.user.email,
        commentId,
      },
    });

    if (clap) {
      // Increment clap count if it exists
      clap = await prisma.clap.update({
        where: { id: clap.id },
        data: { clapCount: { increment: 0 } },
      });
    } else {
      // Create a new clap if it does not exist
      clap = await prisma.clap.create({
        data: {
          userId: session.user.email,
          commentId,
          clapCount: 1,
        },
      });
    }

    return new NextResponse(JSON.stringify(clap), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

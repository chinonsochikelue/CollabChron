// pages/api/posts/most-viewed.js
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET POSTS BY VIEWS
export const GET = async () => {
  try {
    const post = await prisma.post.findMany({
      include: {
        user: true,
      },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

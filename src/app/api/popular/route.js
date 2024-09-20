// pages/api/posts/most-viewed.js
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// GET POSTS BY VIEWS
export const GET = async (req) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        views: 'desc',
      },
      take: 4,  
      include: {
        user: true,
      },
    });

    return new NextResponse(JSON.stringify(posts, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

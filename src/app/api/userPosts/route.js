import { getAuthSession } from "@/utils/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
  
    const page = searchParams.get("page");
    const cat = searchParams.get("cat");
    const userId = searchParams.get("userId"); // Assuming you're passing the user ID as a query parameter
  
    const POST_PER_PAGE = 5;
  
    const query = {
      take: POST_PER_PAGE,
      skip: POST_PER_PAGE * (page - 1),
      where: {
        ...(cat && { catSlug: cat }),
        ...(userId && { userId }), // Add the user ID filter
      },
      orderBy: {
        createdAt: 'desc', // Sort by creation date in descending order
      },
    };
  
    try {
      const [posts, count] = await prisma.$transaction([
        prisma.post.findMany(query),
        prisma.post.count({ where: query.where }),
      ]);
      return new NextResponse(JSON.stringify({ posts, count }, { status: 200 }));
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
      );
    }
  };
  ;




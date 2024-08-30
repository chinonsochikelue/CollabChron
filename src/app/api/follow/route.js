import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const followingId = url.searchParams.get('followingId');
  const followerId = url.searchParams.get('followerId');

  try {
    const existingFollow = await prisma.following.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    return new NextResponse(JSON.stringify({isFollowing: existingFollow}, { status: 200 }));
  } catch (error) {
    console.error('Error fetching follow status:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}


export async function POST(req) {
  const { followerId, followingId } = await req.json();

  try {
    // Check if the user is already following the target user
    const existingFollow = await prisma.following.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (existingFollow) {
      // If already following, unfollow
      await prisma.following.delete({
        where: {
          id: existingFollow.id,
        },
      });
      return new NextResponse(
        JSON.stringify({ message: "" }), 
        { status: 200 }
      );
    } else {
      // If not following, follow
      const newFollow = await prisma.following.create({
        data: {
          followerId,
          followingId,
          userEmail: followerId, // Assuming the followerId is the email of the user
        },
      });
      return new NextResponse(JSON.stringify(newFollow), { status: 200 });
    }
  } catch (error) {
    console.error('Error handling follow/unfollow:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

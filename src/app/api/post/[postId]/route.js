import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import prisma from "@/lib/prismadb";

// Handle DELETE request
export async function DELETE(req, { params }) {
  const { postId } = params;

  // Get user session
  const session = await getServerSession(req, authOptions);

  // if (!session) {
  //   return new Response(JSON.stringify({ message: "Unauthorized" }), {
  //     status: 401,
  //   });
  // }

  try {
    // Find the post by ID
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    // if (post.userEmail !== session.user.email) {
    //   return new Response(JSON.stringify({ message: "Forbidden" }), {
    //     status: 403,
    //   });
    // }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    return new Response(JSON.stringify({ message: "Post deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return new Response(JSON.stringify({ message: "Failed to delete post" }), {
      status: 500,
    });
  }
}

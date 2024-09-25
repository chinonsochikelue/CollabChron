import { authOptions } from "@/utils/auth";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";

// Handle post update
export async function PUT(request, { params }) {
  const { id } = params;

  // Fetch session data
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { title, desc, img, slug, catSlug } = await request.json();

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        desc,
        img,
        slug,
        catSlug,
      },
    });
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update post" }), { status: 500 });
  }
}

// Handle post deletion
export async function DELETE(request, { params }) {
  const { id } = params;

  // Fetch session data
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    // Delete post by its id
    await prisma.post.delete({
      where: { id },
    });
    return new Response(JSON.stringify({ message: "Post deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete post" }), { status: 500 });
  }
}

import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";
import { authOptions } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  // Fetch session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "You must be logged in to delete this post." });
  }

  try {
    // Find the post
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the logged-in user is the author of the post
    if (post.userEmail !== session.user.email) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting the post." });
  }
}

import EditPostForm from "@/components/editPost/editPost";
import { authOptions } from "@/utils/auth";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";


const getPostData = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const EditPostPage = async ({ params }) => {
  const { id } = params;

  // Fetch post data
  const post = await getPostData(id);

  // Fetch session data
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and authorized
  if (!session || session.user.email !== post.userEmail) {
    return <p>You are not authorized to edit this post.</p>;
  }

  return (
    <div className="p-6 mb-[-70px]">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  );
};

export default EditPostPage;

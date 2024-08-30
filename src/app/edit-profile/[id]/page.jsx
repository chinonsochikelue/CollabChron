import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import EditProfilePage from "@/components/EditProfilePage/EditProfilePage";


// Fetch user data server-side
const getUserData = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export async function generateMetadata({ params }) {
  const { id } = params;
  const user = await getUserData(id);
  return {
    title: `${user.name}'s Profile`,
    description: `Profile page for ${user.name}.`,
  };
}

const ProfilePage = async ({ params }) => {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const user = await getUserData(id);

  if (!user) {
    return <div>User not found</div>;
  }

  if (session?.user?.email !== user?.email) {
    return <div>You are not authorized to edit this profile.</div>;
  }

  return <EditProfilePage user={user} />;
};

export default ProfilePage;

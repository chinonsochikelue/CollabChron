import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import FollowButton from "@/components/follow/followButton";
import { MailPlusIcon } from "lucide-react";
import Link from "next/link";
import Photo from "../Photo";
import Stats from "@/components/stats/Stats";
import NotFound from "@/app/_404";
import { faCoffee, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import CardList from "../CardList";

// Fetch user data and session server-side
const getUserData = async (id, userEmail, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // Fetch the user data along with the required statistics
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc", // Order posts from most recent to oldest
        },
      },
      Following: {
        select: {
          followerId: true,
        },
      },
    },
  });

  if (user) {
    // Calculate followers and following count
    const followersCount = await prisma.following.count({
      where: { followingId: id },
    });

    const followingCount = await prisma.following.count({
      where: { followerId: userEmail },
    });

    const Posts = user?.posts;
    const postsCount = user.posts.length;
    const viewsCount = user.posts.reduce(
      (total, post) => total + post.views,
      0
    );

    return {
      ...user,
      followers: followersCount,
      following: followingCount,
      posts: postsCount,
      Posts,
      views: viewsCount,
    };
  }

  return null;
};

export async function generateMetadata({ params }) {
  const { id } = params;
  const user = await getUserData(id);
  return {
    title: `${user?.name}`,
    description: `${user?.name + " " + user?.desc}.`,
    image: `${user?.image}`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${user.id}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${user.id}`,
      },
    },
    openGraph: {
      title: "Home - Collaboration Chronology",
      description: `${user?.about}`,
      type: "website",
      images: [
        {
          url: `${user?.image}`, // replace with the actual image path
          width: 800,
          height: 600,
          alt: `${user?.name}`,
        },
      ],
    },
    twitter: {
      card: `${user?.name}`,
      title: "Home - Collaboration Chronology",
      description: `${user?.about}`,
      images: [`${user?.image}`], // replace with the actual image path
    },
  };
}

const ProfilePage = async ({ params, searchParams }) => {
  const { id } = params;
  const page = parseInt(searchParams.page) || 1;
  const limit = 10;
  const session = await getServerSession(authOptions);
  const user = await getUserData(id);
  console.log("posts", user?.posts);

  // console.log("posts", user.posts?.title)
  if (!user) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  const isCurrentUser = session?.user?.email === user?.email;
  // const isAuthor = session?.user?.email === postData.user?.email;

  return (
    <section className="w-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
          <div className="text-center xl:text-left order-2 xl:order-none">
            <span className="text-xl">Software Developer</span>
            <h1 className="h1">
              Hello I&apos;m <br />{" "}
              <span className="text-red-600">{user?.name}</span>
            </h1>
            <p className="max-w-[500px] mb-9 text-black/80 dark:text-white/80">
              {user?.about}
            </p>
            <div className="flex flex-col items-center justify-center xl:flex-row gap-8">
              {isCurrentUser && (
                <button size="lg" className="  rounded-3xl border">
                  <Link
                    href={`/edit-profile/${user?.id}`}
                    className="uppercase flex items-center m-2"
                  >
                    Edit Profile
                  </Link>
                </button>
              )}
              <div>
                {!isCurrentUser && (
                  <div>
                    <FollowButton followingId={user.id} user={user} />
                  </div>
                )}
              </div>
              <div className="mb-8 xl:mb-0 justify-center">
                <div className="flex gap-6">
                  <Link
                    href={`mailto:${user.email}`}
                    aria-label="Send an email"
                  >
                    <MailPlusIcon color="#D44638" width={35} height={35} />
                  </Link>
                  {user?.website && (
                    <a
                      href={user?.website}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-red-600 text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faGlobe}
                        style={{ color: "#0088CC" }}
                      />
                    </a>
                  )}

                  {user?.instagram && (
                    <a
                      href={user?.instagram}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-red-600 text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faInstagram}
                        style={{ color: "#E4405F" }}
                      />
                    </a>
                  )}

                  {user?.facebook && (
                    <a
                      href={user?.facebook}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-red-600 text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faFacebook}
                        style={{ color: "#1877F2" }}
                      />
                    </a>
                  )}

                  {user?.linkedin && (
                    <a
                      href={user?.linkedin}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-red-600 text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faLinkedin}
                        style={{ color: "#0A66C2" }}
                      />
                    </a>
                  )}

                  {user?.twitter && (
                    <a
                      href={user?.twitter}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-red-600 text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faXTwitter}
                        style={{ color: "#0088CC" }}
                      />
                    </a>
                  )}

                  {user?.youtube && (
                    <a
                      href={user?.youtube}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-red-600 text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faYoutube}
                        style={{ color: "#FF0000" }}
                      />
                    </a>
                  )}

                  {user?.buymeacoffee && (
                    <a
                      href={user?.buymeacoffee}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-red-600 text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faCoffee}
                        style={{ color: "#FFDD00" }}
                      />
                    </a>
                  )}

                  {user?.github && (
                    <a
                      href={user?.github}
                      className="w-9 h-9   rounded-full flex justify-center items-center text-base hover:scale-125 transition-all ease hover:text-primary hover:transition-all duration-500"
                    >
                      <FontAwesomeIcon
                        icon={faGithub}
                        className="text-[#171515] dark:text-white"
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 xl:order-none mb-8 xl:mb-0">
            <Photo user={user} />
          </div>
        </div>
      </div>
      {isCurrentUser && (
        <div className="flex flex-col items-center justify-center xl:flex-row gap-8">
        <button size="lg" className="rounded-3xl border">
          <Link
            href={`/analytics/${user?.id}`}
            className="uppercase flex items-center m-2"
          >
            {" "}
            View Your Analytics
          </Link>
        </button>
        </div>
      )}
      <Stats user={user} />
      <CardList
        posts={user.Posts}
        page={page}
        userId={id}
        totalPosts={user.postsCount}
        limit={limit}
      />
    </section>
  );
};

export default ProfilePage;

import styles from "./singlePage.module.css";
import Image from "next/image";
import { MailPlusIcon, EditIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import prisma from "@/lib/prismadb";
import NotFound from "@/app/_404";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import DeletePost from "@/components/deletePost/deletePost";
import { getPostMetadata, generateJSONLD } from "@/utils/seo";
import sanitizeHtml from "sanitize-html";
import Menu from "@/components/Menu/Menu"
import Comments from "@/components/comments/Comments"
import FollowButton from "@/components/follow/followButton"
import Tts from "@/components/tts/tts"
import Clap from "@/components/clap/clap"
import Share from "@/components/share"


// Function to get post data from the database
const getPostData = async (slug) => {
  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { user: true },
    });
    return post;
  } catch (error) {
    return null;
  }
};


export async function generateMetadata({ params }) {
  const { slug } = params;
  const postData = await getPostData(slug);
  if (!postData) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
      robots: "noindex, nofollow",
    };
  }
  return getPostMetadata(postData);
}

const SinglePage = async ({ params }) => {
  const { slug } = params;
  const postData = await getPostData(slug);

  if (!postData) {
    return <NotFound />;
  }

  const session = await getServerSession(authOptions);
  const isAuthor = session?.user?.email === postData.user?.email;
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postData.slug}`;
  const sanitizedHtml = sanitizeHtml(postData.desc, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height"],
    },
  });

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJSONLD(postData)) }}
      />
      <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
        <div className="w-full flex flex-col-reverse md:flex-row gap-2 gap-y-5 items-center">
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
              {postData.title}
            </h1>
            <div className="w-full flex items-center justify-evenly">
              <span className="text-rose-600 font-semibold">
                <Link href={`/blog?cat=${postData.catSlug}`}>
                  <span>{postData.catSlug}</span>
                </Link>
              </span>
              <Tts data={postData} />
              <Clap postId={postData.id} />
              <span className="flex items-baseline text-2xl font-medium text-slate-700 dark:text-gray-400">
                {postData.views}
                <span className="text-base text-rose-600"> Views</span>
              </span>
            </div>
            <div className="w-full flex items-center gap-10 flex-wrap">
              {postData.user?.image && (
                <div className="flex gap-3">
                  <Link href={`/profile/${postData.user.id}`}>
                    <Image
                      src={postData.user.image}
                      alt={postData.user.name}
                      className="object-cover w-12 h-12 rounded-full"
                      width={45}
                      height={45}
                      priority
                    />
                  </Link>
                  <div>
                    <div className="flex flex-row gap-12 items-center">
                      <Link href={`/profile/${postData.user.id}`}>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                          {postData.user.name}
                        </p>
                      </Link>
                      {isAuthor ? (
                        <>
                          {/* Button for larger screens */}
                          <Link
                            href={`/edit-post/${postData.slug}/${postData.id}`}
                            className="hidden md:inline-block py-1 px-6 border bg-[#38ff38] rounded-3xl"
                            aria-label="Edit Post"
                          >
                            Edit Post
                          </Link>
                          {/* Icon for smaller screens with tooltip */}
                          <Link
                            href={`/edit-post/${postData.slug}/${postData.id}`}
                            className="relative group inline-block md:hidden py-2 px-2 bg-[#38ff38] rounded-full"
                            aria-label="Edit Post"
                          >
                            <EditIcon size={24} color="#fff" />
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2">
                              Edit Post
                            </span>
                          </Link>

                          <DeletePost post={postData} />

                        </>
                      ) : (
                        <>
                          <FollowButton
                            followingId={postData.user.id}
                            user={postData?.user}
                          />
                          <a
                            href={`mailto:${postData.user.email}`}
                            className="py-2 px-4 hover:scale-125 transition-all ease duration-200"
                            aria-label="Send an email to"
                          >
                            <MailPlusIcon
                              color="green"
                              width={30}
                              height={30}
                            />
                          </a>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <span className="text-slate-800 dark:text-slate-300">
                        Created on:{" "}
                        {new Date(postData.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                      {postData.updatedAt && (
                        <span className="text-slate-800 dark:text-slate-300">
                          Last updated:{" "}
                          {new Date(postData.updatedAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {postData.img && (
            <Image
              src={postData.img}
              alt={postData.title}
              className="w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded-md object-contain"
              width={500}
              height={500}
              priority={false}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
            />
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row gap-x-10 2xl:gap-x-28 mt-10 text-slate-800 dark:text-white">
          <div className="w-full md:w-2/3 flex flex-col text-slate-800 dark:text-white">
            <div
              className="prose prose-lg max-w-none text-slate-800 dark:text-white dark:prose-dark"
              dangerouslySetInnerHTML={{ __html: postData.desc }}
            />
            <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
              <Share
                title={postData.title}
                desc={postData.postDesc}
                link={postUrl}
              />
            </div>
            <div className={styles.comment}>
              <Comments postSlug={postData.id} />
            </div>
          </div>
          <Menu />
        </div>
      </div>
    </>
  );
};

export default SinglePage;

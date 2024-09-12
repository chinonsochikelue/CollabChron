 import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css"; // Import your CSS module
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import FollowButton from "@/components/follow/followButton";
import Tts from "@/components/tts/tts";
import Clap from "@/components/clap/clap";
import { MailPlusIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import prisma from "@/lib/prismadb";
import NotFound from "@/app/_404";
import parse, { domToReact } from "html-react-parser";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Toaster } from "react-hot-toast";
import Share from "@/components/share";
import Link from "next/link";

export const dynamic = "force-dynamic";
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

// Generate static params for Next.js
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.id }));
}

// Generate metadata for each post

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

  const publishedAt = new Date(postData.createdAt).toISOString();
  const modifiedAt = new Date(
    postData.updatedAt || postData.createdAt
  ).toISOString();

  const ogImages = postData.img ? [{ url: postData.img }] : [];
  const authors = postData.user?.name ? [postData.user.name] : [];

  const keywordsArray = [postData.title, postData.catSlug, postData.user.name];
  const keywords = keywordsArray.join(",");

  // Use html-react-parser to parse and extract text from HTML
  const extractTextFromHtml = (html) => {
    let textContent = "";
    parse(html, {
      replace: (domNode) => {
        // If the node is a text node, extract the text
        if (domNode.type === "text") {
          textContent += domNode.data;
        }
      },
    });
    return textContent;
  };

  // Parse and extract text from post description
  const parsedDesc = extractTextFromHtml(postData.desc);

  // Limit description length for SEO purposes
  const metaDescription = parsedDesc.substring(0, 160); // Trim to 160 characters for SEO

  return {
    title: postData.title,
    description: metaDescription, // Use parsed text as description
    keywords,
    openGraph: {
      title: postData.title,
      description: metaDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postData.slug}`,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: ogImages,
      authors,
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description: metaDescription,
      images: ogImages,
    },
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postData.slug}`, // Canonical tag for SEO
    alternates: {
      types: {
        "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL}/routes/rss`,
      },
    },
    author: postData.user?.name || "Chinonso Chikelue (fluantiX)", // Fallback author name
  };
}


// Main component for displaying the single post page
const SinglePage = async ({ params }) => {
  const { slug } = params;
  const postData = await getPostData(slug);

  if (!postData) {
    return <NotFound />;
  }

  const session = await getServerSession(authOptions);
  const isAuthor = session?.user?.email === postData.user?.email;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postData.title,
    description: postData.desc,
    image: postData.img,
    datePublished: new Date(postData.createdAt).toISOString(),
    dateModified: new Date(
      postData.updatedAt || postData.createdAt
    ).toISOString(),
    author: [
      {
        "@type": "Person",
        name: postData.user?.name || "Chikelue Chinonso (fluantiX)",
      },
    ],
  };

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postData.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
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
                        <a
                          href={`/edit-post/${postData.slug}/${postData.id}`}
                          className="py-1 px-6 border bg-[#38ff38] rounded-3xl"
                          aria-label="Edit Post"
                        >
                          Edit Post
                        </a>
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
              className="w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded object-contain"
              width={500}
              height={500}
              priority
            />
          )}
        </div>

        <div className="w-full flex flex-col md:flex-row gap-x-10 2xl:gap-x-28 mt-10">
          <div className="w-full md:w-2/3 flex flex-col text-black dark:text-gray-500">
            <div className="leading-[3rem] text-base text-black dark:text-slate-400 ql-video ql-video iframe ql-editor img ql-h1 h1 ql-h2 h2 ql-h3 h3">
              {parse(postData.desc, {
                replace: (domNode) => {
                  if (
                    domNode.name === "pre" &&
                    domNode.children[0]?.name === "code"
                  ) {
                    const language =
                      domNode.attribs.class?.replace("language-", "") ||
                      "javascript";
                    const codeContent = domToReact(
                      domNode.children[0].children
                    ).join("");
                    return (
                      <SyntaxHighlighter language={language} style={dracula}>
                        {codeContent}
                      </SyntaxHighlighter>
                    );
                  }
                },
              })}
            </div>
            <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
              <Share
                title={postData.title}
                desc={postData.desc}
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

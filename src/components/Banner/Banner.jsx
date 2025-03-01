// components/Banner.js
import Link from 'next/link';
import Image from 'next/image';
import NotFound from '@/app/_404';
import parse from "html-react-parser";

const Banner = ({ post }) => {
  if (!post) {
    return <div><NotFound /></div>; // or a loading indicator
  }

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post?.title,
    "description": post?.postDesc || post?.desc.substring(0, 160),
    "image": post?.img,
    "datePublished": new Date(post?.createdAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": post?.user?.name || "Chinonso Chikelue (fluantiX)",
    },
  };

  return (
    <div className="w-full mb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative w-full h-[500px] 2xl:h-[600px] flex px-0 lg:px-20">
        <Link href={`/posts/${post?.slug}`} className="w-full" aria-label={`Read more about ${post?.title}`}>
        {post?.img ? (
          <Image
            src={post?.img}
            alt={`Banner image for ${post?.title}`}
            width={1920}
            height={1080}
            className="w-full md:w-3/4 h-64 md:h-[420px] 2xl:h-[560px] rounded"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
            <span className="text-gray-500">No image available</span>
          </div>
          )}

        </Link>

        <div className="absolute flex flex-col md:right-10 bottom-10 md:bottom-2 w-full md:w-2/4 lg:w-1/3 2xl:w-[480px] bg-white dark:bg-[#05132b] shadow-2xl p-5 rounded-lg gap-3">
          <Link href={`/posts/${post?.slug}`} aria-label={`Post title: ${post?.title}`}>
            <h1 className="font-semibold text-xl text-black dark:text-white">
              {post?.title}
            </h1>
          </Link>

          <div className="prose prose-lg flex-1 overflow-hidden text-sm text-justify dark:prose-dark">
            {parse(post?.desc.substring(0, 160) + "...")}
          </div>
          
          <Link href={`/posts/${post?.slug}`} className="w-fit bg-[#24a0ed] dark:bg-blue-600 bg-opacity-20 px-4 py-1 rounded-full text-sm cursor-pointer " aria-label={`Read more about ${post?.title}`}>
            Read more...
          </Link>

          <Link href={`/profile/${post?.user?.id}`} className="flex gap-3 mt-4 items-center" aria-label={`More posts by ${post?.user?.name}`}>
            <Image
              src={post?.user?.image}
              alt={`${post?.user?.name}'s profile`}
              width={40}
              height={40}
              className="object-cover w-10 h-10 rounded-full"
            />
            <span className="font-medium text-gray-700 dark:text-slate-200">
              {post?.user?.name}
            </span>
            <span className="text-gray-500 dark:text-gray-200">
              {new Date(post?.createdAt).toDateString()}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;

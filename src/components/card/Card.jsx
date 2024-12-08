import Image from "next/image";
import Link from "next/link";
import { AiOutlineArrowRight } from "react-icons/ai";
import parse, { domToReact } from "html-react-parser";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";  // Import a highlight.js theme

const options = {
  replace: (domNode) => {
    if (domNode.name === "pre" && domNode.children[0]?.name === "code") {
      // Extract the code from the pre > code block
      const codeContent = domToReact(domNode.children[0].children);
      const highlightedCode = hljs.highlightAuto(codeContent).value;

      return (
        <pre className="rounded-md overflow-x-auto bg-gray-800 p-4 text-white">
          <code
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          ></code>
        </pre>
      );
    }
  },
};

const Card = ({ item }) => {
  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": item?.title,
    "description": item?.desc.substring(0, 260),
    "image": item?.img,
    "datePublished": new Date(item?.createdAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": item?.author?.name || "Unknown Author",
    },
    "keywords": item?.keywords || "blog, article, coding, news",
  };

  return (
    <div
      className={`w-full flex flex-col gap-8 items-center rounded md:flex-row mb-10 mt-10`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full h-auto md:h-64 md:w-2/4">
      {item?.img ? (
          <Image
            src={item.img}
            alt={item.title || 'Post image'}
            className="object-cover w-full h-full rounded"
            width={800}
            height={800}
            priority
          />
        ) : (
      <Image
   src="https://dl.dropboxusercontent.com/scl/fi/1nji3jnur7f5lwabqynz8/No-image-available-2.jpg?rlkey=ppox3crisw5w4joda1l2j8a00"
            alt="No image available"
            className="object-cover w-full h-full rounded"
            width={800}
            height={800}
            priority
          />
        )}
      </div>
      <div className="w-full md:w-2/4 flex flex-col gap-3">
        <div className="flex gap-2">
          <span className="text-sm text-gray-600 dark:text-slate-200">
            {new Date(item?.createdAt).toDateString()}
          </span>
          <span className="text-sm text-rose-600 font-semibold">
          <Link
                  href={`/blog?cat=${item.catSlug}`}
                >
                  <span>{item.catSlug}</span>
                </Link>
          </span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1 className="text-xl 2xl:text-3xl font-semibold text-black dark:text-slate-200">
            {item.title}
          </h1>
        </Link>
        {/* Render the HTML content stored by React Quill with options */}
        <div className="flex-1 text-slate-900 dark:text-slate-200 text-sm">
          {parse(item?.desc.substring(0, 260) + "...", options)}
        </div>
        <Link
          href={`/posts/${item.slug}`}
          className="flex items-center gap-2 text-black dark:text-white"
          aria-label={`Read the post titled ${item.title} about ${item.catSlug}`}
        >
          <span className="underline">Read the post titled: {item.title.substring(0, 40) + "..."} </span> <AiOutlineArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Card;

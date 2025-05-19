import styles from "./homepage.module.css";
import Banner from "@/components/Banner/Banner";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";
import { BsNewspaper, BsPerson } from "react-icons/bs";
import { MdCastForEducation } from "react-icons/md";
import Link from "next/link";
import { Bot, Cpu } from "lucide-react";
import NotFound from "./_404";

// Define categories
const CATEGORIES = [
  {
    label: "NEWS",
    color: "bg-[#e11d48]", // Red
    text: "text-[#fff]",
    icon: <BsNewspaper />,
  },
  {
    label: "TECHNOLOGY",
    color: "bg-[#1e90ff]", // Blue
    icon: <Cpu />,
  },
  {
    label: "AI",
    color: "bg-[#1e9]", //
    icon: <Bot />,
  },
  {
    label: "EDUCATION",
    color: "bg-[#ca8a04]", // Orange
    icon: <MdCastForEducation />,
  },
  {
    label: "LIFESTYLE",
    color: "bg-[#ff6f61]", // Red
    icon: <BsPerson />,
  },
];


// Function to fetch posts data
const getData = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${baseUrl}/api/post`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};


// Generate JSON-LD for the home page
export async function generateJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": baseUrl,
      "name": "CollabChron",
      "description": "CollabChron is a dynamic multi-author blog platform where writers and readers connect. Discover diverse perspectives, share your voice, and explore captivating stories on topics ranging from technology and lifestyle to culture and beyond.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Write",
          "item": `${baseUrl}/write`,
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Blog",
          "item": `${baseUrl}/blog`,
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Api",
          "item": `${baseUrl}/developer`,
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "About",
          "item": `${baseUrl}/about`,
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Contact",
          "item": `${baseUrl}/contact`,
        },
        {
          "@type": "ListItem",
          "position": 7,
          "name": "Docs",
          "item": `${baseUrl}/developer/docs`,
        }
      ]
    }
  ];
}


// Main component for the home page
export default async function Home({ searchParams }) {
  const posts = await getData();
  const page = parseInt(searchParams?.page || "1", 10);
  const randomIndex = Array.isArray(posts)
    ? Math.floor(Math.random() * posts.length)
    : 0;

  if (!posts.length && page > 1) {
    NotFound();
  }

  const jsonLd = await generateJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-20 2xl:py-5">
        <Banner post={posts[randomIndex]} />

        <div className="px-0 md:px-10">
          <div className="mt-6 md:mt-0">
            <p className="text-2xl font-semibold text-gray-600 dark:text-white">
              Popular Categories
            </p>
            <div className="w-full flex overflow-x-auto py-10 gap-8">
              {CATEGORIES.map((cat) => (
                <Link
                  href={`/blog?cat=${cat.label}`}
                  className={`flex items-center justify-center gap-3 ${cat.color} text-white font-semibold text-base px-4 py-2 rounded cursor-pointer whitespace-nowrap`}
                  key={cat.label}
                >
                  {cat?.icon}
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
            <div className="w-full flex flex-col gap-10 2xl:gap-20">
              <div className="md:gap-5 gap-10 grid md:grid-cols-9">
                <CardList page={page} />
                <Menu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



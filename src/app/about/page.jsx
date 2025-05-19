import Hero from "@/components/Hero";
import People from "@/components/people";
import React from "react";

export async function generateMetadata() {
  return {
    title: "About",
    description:
      "CollabChron is a dynamic multi-author blog platform where writers and readers connect. Discover diverse perspectives, share your voice, and explore captivating stories on topics ranging from technology and lifestyle to culture and beyond.",
    image: "/favicon.ico",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    },
    openGraph: {
      title: "About - Collaboration Chronology",
      description:
        "CollabChron is a dynamic multi-author blog platform where writers and readers connect. Discover diverse perspectives, share your voice, and explore captivating stories on topics ranging from technology and lifestyle to culture and beyond.",
      type: "website",
      images: [
        {
          url: "/favicon.ico", // replace with the actual image path
          width: 800,
          height: 600,
          alt: "CollabChron logo",
        },
      ],
    },
    twitter: {
      card: "CollabChron",
      title: "About CollabChron",
      description:
        "CollabChron is a dynamic multi-author blog platform where writers and readers connect. Discover diverse perspectives, share your voice, and explore captivating stories on topics ranging from technology and lifestyle to culture and beyond.",
      images: "/favicon.ico", // replace with the actual image path
    },
  };
}


async function page() {
  return (
    <div className="max-w-screen-xl mx-auto overflow-hidden">
      <Hero />
      <People />
    </div>
  );
}

export default page;

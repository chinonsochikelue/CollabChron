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


const fetchPosts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v2/users/profile", {
      method: "GET",
      headers: {
        "Authorization": "Bearer cc_5832b024f267016c1d74d95ea4cdf66ae35c763e4b1f1b28"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Post data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};



async function page() {
  // Optional: Call the fetchPosts function if you want to log that data too
  const externalPosts = await fetchPosts();
  console.log("Fetched external posts:", externalPosts);
  return (
    <div className="max-w-screen-xl mx-auto overflow-hidden">
      <Hero />
      <People />
    </div>
  );
}

export default page;

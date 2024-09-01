// pages/api/rss.js
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }, // Order posts by creation date
    });

    const siteUrl = "https://collabchron.com.ng"; // Replace with your site's URL

    const rssItemsXml = posts
      .map(post => {
        return `
          <item>
            <title>${post.title}</title>
            <link>${siteUrl}/posts/${post.slug}/${post.id}</link>
            <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
            <description>${post.desc}</description>
            <author>${post.user.email} (${post.user.name})</author>
            <guid>${siteUrl}/posts/${post.slug}/${post.id}</guid>
          </item>
        `;
      })
      .join('');

    const rssFeedXml = `
      <rss version="2.0">
        <channel>
          <title>Collaboration Chronology</title>
          <link>${siteUrl}</link>
          <description>Your blog description goes here.</description>
          <language>en-us</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          ${rssItemsXml}
        </channel>
      </rss>
    `;

    return new NextResponse(rssFeedXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://collabchron.com.ng';
  
  try {
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        updatedAt: true,
        id: true, // Added to include post id
      },
      orderBy: { updatedAt: 'desc' },
    });

    const siteUrl = baseUrl;

    const staticPaths = [
      { path: '/', priority: 1.0 },
      { path: '/about', priority: 0.8 },
      { path: '/contact', priority: 0.8 },
    ];

    const dynamicPaths = posts.map(post => ({
      path: `/posts/${post.slug}/${post.id}`, // Now includes post.id
      lastmod: new Date(post.updatedAt).toISOString(),
      priority: 0.7,
    }));

    const allPaths = [...staticPaths, ...dynamicPaths];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPaths.map(({ path, lastmod, priority }) => `
    <url>
      <loc>${siteUrl}${path}</loc>
      ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      <priority>${priority}</priority>
    </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemapXml.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
        

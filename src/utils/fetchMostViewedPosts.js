import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    // Fetch the top 10 posts based on views
    const posts = await prisma.post.findMany({
      orderBy: {
        views: 'desc',  // Sort posts by views in descending order
      },
      take: 3,  // Limit results to top 10 posts
    });
    
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching popular posts' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

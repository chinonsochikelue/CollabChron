import Image from 'next/image';
import Link from 'next/link';
import styles from "./menuPosts.module.css";
import prisma from "@/lib/prismadb";

export const getTopAuthors = async () => {
    const authors = await prisma.user.findMany({
      include: {
        posts: {
          select: {
            views: true
          }
        }
      }
    });
  
    const authorPopularity = authors.map(author => {
      const totalViews = author.posts.reduce((sum, post) => sum + post.views, 0);
      return { ...author, totalViews };
    });
  
    authorPopularity.sort((a, b) => b.totalViews - a.totalViews);
  
    return authorPopularity.slice(0, 5); // Top 5 authors
  };
  

const PopularAuthorPage = async () => {
  // Fetch the top 5 authors data
  const authors = await getTopAuthors();

  if (authors.length === 0) {
    return <div>No authors found</div>;
  }

  return (
    <div className="mt-[35px] mb-[60px] gap-[35px] flex flex-col justify-evenly">
      {authors.map((author) => (
        <div key={author.id} className={styles.item}>
          {author.image && (
            <div className={styles.imageContainer}>
              <Image src={author.image} alt={author.name} height={60} width={60} priority className={styles.image} />
            </div>
          )}
          <div className={styles.textContainer}>
            <Link href={`/profile/${author.id}`}>
            <h3>
              {author.name}
            </h3>
            </Link>
            <div className={styles.detail}>
              <span className={styles.username}>Total Views: {author.totalViews}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularAuthorPage;

'use client';
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./menuPosts.module.css";

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/popular`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    // Ensure data is an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array on error
  }
};

const MenuPosts = ({ withImage }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setPosts(data);
    };

    fetchData();
  }, []);

  return (
    <div className="mt-[35px] mb-[60px] flex flex-col gap-[35px]">
      {posts.length > 0 ? (
        posts.map((post) => (
          <article
            key={post.id}
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            <Link
              href={`/posts/${post.slug}`}
              className={styles.item}
              aria-label={`Read the post titled ${post.title} about ${post.catSlug}`}
            >
              {withImage && post.img && (
                <figure className={styles.imageContainer}>
                  <Image
                    src={post.img}
                    alt={`Image illustrating ${post.title}`}
                    height={60} width={60} priority
                    className={styles.image}
                  />
                </figure>
              )}
              <div className={styles.textContainer}>
                <header>
                  <span
                    className={`${styles.category} ${styles[post.catSlug]}`}
                    itemProp="articleSection"
                  >
                    {post.catSlug}
                  </span>
                  <h3 className={styles.postTitle} itemProp="headline">
                    {post.title}
                  </h3>
                </header>
                <div className={styles.detail}>
                  <span className={styles.username} itemProp="author">
                    {post.user.name}
                  </span>
                  <time
                    className={styles.date}
                    itemProp="datePublished"
                    dateTime={new Date(post.createdAt).toISOString()}
                  >
                    {` - ${new Date(post.createdAt).toDateString()}`}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default MenuPosts;

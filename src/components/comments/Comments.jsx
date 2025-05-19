"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const Comments = ({ postSlug }) => {
  const { status } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { data, mutate, error, isLoading } = useSWR(
    postSlug ? `${baseUrl}/api/comments?postSlug=${postSlug}` : null,
    fetcher
  );

  const [desc, setDesc] = useState("");

  const handleSubmit = async () => {
    if (!desc.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      await fetch(`${baseUrl}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desc, postSlug }),
      });
      setDesc(""); // Clear the textarea after successful submission
      mutate(); // Refresh the comments
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Failed to submit comment.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <Textarea
            placeholder="Write a comment..."
            className="resize-none flex focus:ml-2"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Button className={styles.button} onClick={handleSubmit}>
            Send
          </Button>
        </div>
      ) : (
        <Link href="/login">Login to write a comment</Link>
      )}
      <div className={styles.comments}>
        {isLoading ? (
          "Loading..."
        ) : error ? (
          <p>Error loading comments</p>
        ) : data?.length > 0 ? (
          data.map((item) => (
            <div className={styles.comment} key={item._id}>
              <div className={styles.user}>
                {item.user?.image && (
                  <Image
                    src={item.user.image}
                    alt=""
                    width={50}
                    height={50}
                    className={styles.image}
                  />
                )}
                <div className={styles.userInfo}>
                  <span className={styles.username}>{item.user.name}</span>
                  <span className={styles.date}>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  );
};

export default Comments;

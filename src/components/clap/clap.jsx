"use client";

import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import { HeartHandshakeIcon, Loader } from "lucide-react";
import { useAnimation, motion } from "framer-motion";
import toast from "react-hot-toast";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const Clap = ({ postId }) => {
  const { status, data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 
  const { data, error, isLoading } = useSWR(
    postId ? `${baseUrl}/api/clap?postId=${postId}` : null,
    fetcher
  );

  const [isClapped, setIsClapped] = useState(false);
  const controls = useAnimation();

  const handleClap = async () => {
    if (status !== "authenticated") {
      toast.custom("You need to be logged in to like this story.");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 
      await fetch(`${baseUrl}/api/clap?postId=${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      setIsClapped(true);
      controls.start({
        scale: [1, 3, 1],
        transition: { duration: 0.3 },
      });

      mutate(`${baseUrl}/api/clap?postId=${postId}`); // Refresh the clap data
    } catch (err) {
      console.error("Failed to clap:", err);
      toast.error("Failed to like story.");
    }
  };

  // Get the userEmail from the session
  const userEmail = session?.user?.email;

  // Check if the current user has already clapped
  const hasClapped = data?.some((clap) => clap.userEmail === userEmail);

  return (
    <div>
      {isLoading ? (
        <Loader className="animate-spin text-black dark:text-white" size={25} />
      ) : error ? (
        <p>Error loading clap data</p>
      ) : (
        <div
          className="flex items-baseline text-2xl font-medium text-slate-700 dark:text-gray-400"
          style={{ cursor: hasClapped ? "not-allowed" : "pointer" }}
        >
          <motion.div
            onClick={handleClap} 
            disabled={hasClapped || isClapped}
            animate={controls}
          >
            {hasClapped ? (
              <HeartHandshakeIcon height={30} width={30} color="red" />
            ) : (
              <HeartHandshakeIcon height={30} width={30} color="gray" />
            )}
          </motion.div>
          <p className="text-slate-800 dark:text-slate-300 text-base">{data?.length}</p>
        </div>
      )}
    </div>
  );
};

export default Clap;

'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Loader } from 'lucide-react'; // Import the Loader icon
import toast from 'react-hot-toast';
import Link from "next/link";

const FollowButton = ({ followingId, user }) => {
  const { data: session, status } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const followerId = session?.user?.email;
 

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      if (!followerId || !followingId) return;

      setLoading(true); // Start loading

      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 
        const response = await fetch(`${baseUrl}/api/follow?followingId=${followingId}&followerId=${followerId}`);
        const data = await response.json();

        if (response.ok) {
          setIsFollowing(data.isFollowing);
        } else {
          console.error('Failed to fetch follow status:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchFollowingStatus();
  }, [followerId, followingId]);

  const handleFollowClick = async () => {
    if (!followerId || !followingId) return;

    setLoading(true); // Start loading

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 
      const response = await fetch( `${baseUrl}/api/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerId, followingId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(!isFollowing);
        toast.success("Action Performed Successfully")
      } else {
        console.error('Failed to follow/unfollow:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <button 
      onClick={handleFollowClick} 
      className="follow-button" 
      disabled={loading} // Disable button while loading
    >
      {status === "unauthenticated" ? (
        <Link href="/login">Login to follow {user?.name.substring(0, 12) + "..."}</Link>
      ) : loading ? (
        <Loader className="animate-spin text-black dark:text-white" size={25} />
      ) : isFollowing ? (
        <p>Following</p>
      ) : (
        <p>Follow</p>
      )}
    </button>
  );
};

export default FollowButton;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
// import { savePost } from "@/utils/api";

export default function UserProfile({ user }) {
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Implement update logic here
    // Example: POST request to /api/profile/update
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URLL}/api/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (response.ok) {
      router.refresh();
    }
  };

//   const handleSavePost = async (postId) => {
//     await savePost(postId);
//     router.refresh();
//   };

  const followersData = {
    labels: ['Followers'],
    datasets: [
      {
        label: 'Number of Followers',
        data: [user.following.length],
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="mb-6 flex flex-col items-start">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Name"
          />
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Email"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Update Profile
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
          <ul className="space-y-4">
            {user.posts.map(post => (
              <li key={post.id} className="border-b border-gray-300 pb-2">
                <a href={`/posts/${post.slug}`} className="text-blue-500 hover:underline">{post.title}</a>
                {/* <button
                  onClick={() => handleSavePost(post.id)}
                  className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Save
                </button> */}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
            <div className="w-full max-w-md">
              <Bar data={followersData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

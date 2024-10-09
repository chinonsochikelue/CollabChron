// components/DeleteButton.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader, TrashIcon } from "lucide-react";  // Import TrashIcon
import Modal from "./Modal";
import { TrashIcon } from "lucide-react";

const DeletePost = ({ post, onPostDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleDeletePost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${post?.slug}/${post?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post deleted successfully!", { duration: 4000 });
        if (onPostDeleted) onPostDeleted(post?.id);
        router.push("/");
      } else {
        toast.error("Failed to delete post.", { duration: 4000 });
        console.error(`Failed to delete post ${post?.id}: ${response.status}`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { duration: 4000 });
      console.error(`Error deleting post ${post?.id}:`, error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
{/* Icon for smaller screens with tooltip */}
      <div className="relative group inline-block md:hidden">
        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className={`rounded-full py-2 px-2 text-white ${loading ? "bg-gray-400" : "bg-red-500"}`}
          aria-label="Delete Post"
        >
          {loading ? <Loader className="animate-spin text-white" size={25} /> : <TrashIcon size={24} /> }
        </button>
        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2">
          Delete Post
        </span>
      </div>


      {/* Button for larger screens */}
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className={`hidden md:inline-block rounded-full py-2 px-4 text-white ${loading ? "bg-gray-400" : "bg-red-500"}`}
      >
        <div className={`hidden md:inline-block py-2 px-4 rounded-full ${loading ? "bg-gray-400" : "bg-red-500"}`}>
          {loading ? "Deleting..." : "Delete Post"}
                          </div>
<div className="inline-block md:hidden py-2 px-2 bg-red-500 rounded-full">
                     <TrashIcon size={24} color="#fff" />
                          </div>
      </button>



      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 id="modal-title" className="text-lg font-semibold text-black">Confirm Deletion</h3>
          <p className="text-black">Are you sure you want to delete this post? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end">
            <button
              className="mr-2 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
              onClick={handleDeletePost}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DeletePost;

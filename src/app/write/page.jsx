"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState, useCallback } from "react";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import { CircleFadingPlusIcon, ImageIcon, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");  // This should always hold the editor content
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to upload images to Firebase and return URL
  const uploadImageToFirebase = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Handle image upload in Quill
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setLoading(true);
        try {
          const url = await uploadImageToFirebase(file);
          const quill = document.querySelector(".ql-editor");
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
          quill.setSelection(range.index + 1);
        } catch (error) {
          toast.error("Image upload failed.");
        } finally {
          setLoading(false);
        }
      }
    };
  }, []);

  // Quill toolbar configuration
  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image", "video"],
        [{ color: [] }, { background: [] }],
        [{ "code-block": true }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  // Quill allowed formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "link",
    "indent",
    "image",
    "video",
    "code-block",
    "color",
    "background",
  ];

  // Handle content submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: value,
          img: media,
          slug: slugify(title),
          catSlug: catSlug || "News", // Default to "News" if not selected
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success("Post published successfully!");
        router.push(`/posts/${data.slug}/${data.id}`);
      } else {
        toast.error("Failed to publish the post.");
      }
    } catch (error) {
      toast.error("An error occurred while publishing the post.");
    } finally {
      setLoading(false);
    }
  };

  // Utility function to create slugs
  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }

  return (
    <div className={`styles.container mb-[70px]`}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        onChange={(e) => setCatSlug(e.target.value)}
      >
        <option value="News">News</option>
        <option value="Education">Education</option>
        <option value="Sports">Sports</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Fashion">Fashion</option>
        <option value="Food">Food</option>
        <option value="Culture">Culture</option>
        <option value="Travel">Travel</option>
        <option value="AI & Machine Learning">AI & Machine Learning</option>
        <option value="Coding">Coding</option>
      </select>
      <div className={styles.editor}>
        <ReactQuill
          className={styles.textArea}
          theme="snow"
          value={value}  // Set the controlled value to state
          onChange={setValue}  // Update state on editor change
          placeholder="Tell your story..."
          modules={modules}
          formats={formats}
        />
      </div>
      <button
        className={styles.publish}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <Loader className="animate-spin" width={24} height={24} />
        ) : (
          "Publish"
        )}
      </button>
    </div>
  );
};

export default WritePage;

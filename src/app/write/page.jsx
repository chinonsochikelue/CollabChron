"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState, useRef } from "react";
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

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const quillRef = useRef(null); // Reference to React Quill

  // Firebase Upload Logic (remains unchanged)
  useEffect(() => {
    if (file) {
      const storage = getStorage(app);
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload error:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
          });
        }
      );
    }
  }, [file]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/");
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

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
          catSlug: catSlug || "News", // If not selected, choose the general category
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success("Post published successfully!, Navigating to the created post");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFile(file); // Also update the file state for Firebase upload
    }
  };

  // Custom handler for image upload within React Quill
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const storage = getStorage(app);
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file.");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const quill = quillRef.current.getEditor();
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, "image", downloadURL);
            });
          }
        );
      }
    };
  };

  // ReactQuill modules with custom image handler
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
        image: handleImageUpload,
      },
    },
  };

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

  return (
    <div className={`styles.container mb-[70px]`}>
      {selectedImage && (
        <div className={styles.imageContainer}>
          <Image src={selectedImage} alt="Selected" layout="fill" objectFit="cover" />
        </div>
      )}
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
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <CircleFadingPlusIcon width={30} height={30} />
        </button>
        {open && (
          <div className={styles.add}>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <button className={styles.addButton}>
              <label htmlFor="image">
                <ImageIcon color="red" width={30} height={30} />
              </label>
            </button>
          </div>
        )}
        <ReactQuill
          ref={quillRef}
          className={`${styles.textArea} quill-editor`} // Added class name
          theme="snow"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
          modules={modules}
          formats={formats}
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit} disabled={loading}>
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

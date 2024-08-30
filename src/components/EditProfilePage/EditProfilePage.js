"use client"; // This makes this file a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SocialButtons from "./SocialButtons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, CircleFadingPlusIcon } from "lucide-react";

const EditProfilePage = ({ user }) => {
  const router = useRouter();
  const [name, setName] = useState(user?.name);
  const [skills, setSkills] = useState(user?.skills);
  const [about, setAbout] = useState(user?.about);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [loading, setLoading] = useState(false); // Local state to manage loading
  const [image, setImage] = useState(user?.image);
  const [progress, setProgress] = useState(0); // State for upload progress

  useEffect(() => {
    if (file) {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress); // Update progress state
          toast.custom("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              toast("Upload paused");
              break;
            case "running":
              toast.loading("Uploading image...");
              break;
          }
        },
        (error) => {
          console.error("Error during upload:", error);
          toast.error("Error uploading image.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
            setImage(downloadURL); // Update image state to reflect the new image URL
            toast.dismiss();
            toast.success("Image uploaded successfully!");
            setProgress(0); // Reset progress
          });
        }
      );
    }
  }, [file]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); // Also update the file state for Firebase upload
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeInOut" },
      }}
      className="py-6"
    >
      <Toaster />
      <div className="container mx-auto">
        {image && (
          <div className="flex justify-center mb-4">
            <Image
              src={image}
              alt={name}
              className="w-40 h-40 rounded-full object-cover"
              width={250}
              height={250}
            />
            <label
              htmlFor="image"
              className="rounded-md cursor-pointer text-center mt-[60px] ml-[-3px]"
            >
              <CircleFadingPlusIcon width={30} height={30} />
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        )}
        <div className="flex-col xl:flex-row gap-8">
          <div className="xl:h-[54%] order-1 xl:order-none">
            <SocialButtons user={user} />
            <form
              onSubmit={(e) =>
                handleSubmit(e, user.id, router, setLoading, media)
              }
              className="flex flex-col gap-6 p-10 rounded-xl"
            >
              <h3 className="text-4xl text-white">Update Your Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex h-[48px] rounded-md border border-gray-300 focus:border-blue-500 font-light px-4 py-5 text-base placeholder:text-white/60 outline-none"
                />
                <textare
                  id="skills"
                  name="skills"
                  type="text"
                  maxLength="80"
                  rows="1"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                  className="flex h-[48px] rounded-md border border-gray-300 focus:border-blue-500 font-light px-4 py-5 text-base placeholder:text-white/60 outline-none"
                />
                <textarea
                  id="about"
                  name="about"
                  rows="4"
                  maxLength="220"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="h-[200px] flex w-full rounded-md border focus:border-blue-500 bg-primary px-4 py-5 text-base placeholder:text-black/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
                </div>
                <div className="ttext-sm text-gray-500">
                  {about.length}/220 characters
                </div>
                <div className="flex flex-col xl:flex-row justify-evenly">
                 <div className="xl:order-2">
                <button
                  type="submit"
                  className="bg-blue-500 rounded-md disabled:bg-slate-400 text-white disabled:text-gray-200 py-2 px-4 mx-auto w-full flex gap-2 items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                </div>
            <div className="gap-3 xl:order-1 mt-4">
              <Link
                href={`/profile/${user.id}`}
                className="flex flex-row text-blue-600 hover:underline"
              >
             <ArrowLeft />   Back to Profile
              </Link>
            </div>
                </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfilePage;

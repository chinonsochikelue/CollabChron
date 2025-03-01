"use client";
import { Button, Select, Textarea, TextInput } from "@mantine/core";
import styles from "./writePage.module.css";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { IconColorPicker } from "@tabler/icons-react";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import ts from "highlight.js/lib/languages/typescript";
import { CircleFadingPlusIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Image as TipTapImages } from "@tiptap/extension-image"; // Import Image extension
import { Dropzone } from '@mantine/dropzone';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const lowlight = createLowlight();
lowlight.register({ ts });


export const CustomImage = TipTapImages.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'custom-image', // Add a default class
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'), // Allow inline styles
        renderHTML: (attributes) => {
          return { style: attributes.style };
        },
      },
    };
  },
});

const EditPostForm = ({ post }) => {
  const { status } = useSession();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [isPreview, setIsPreview] = useState(false); // New state for preview mode
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const openRef = useRef(null);
  const dropzoneRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: "Write post here...." }),
      Underline,
      Link,
      Superscript,
      SubScript,
      CustomImage,
      Highlight,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

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

  if (status === "loading") return <SkeletonLoader />;
  if (status === "unauthenticated") {
    router.push("/");
    return null;
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
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 
      const res = await fetch(`${baseUrl}/api/posts/${post?.slug}/${post?.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          desc: value,
          keywords,
          postDesc,
          img: media,
          slug: slugify(title),
          catSlug: catSlug || "News",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success(
          "Post updated successfully!, Navigating to the updated post"
        );
        router.push(`${baseUrl}/posts/${data?.slug}`);
      } else {
        toast.error("Failed to update this post.");
      }
    } catch (error) {
      toast.error("An error occurred while updatinging this post.");
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
      setFile(file);
    }
  };

    // Function to handle image drop/upload
    const addImageToEditor = async (imageFile) => {
      setIsUploading(true);
      const storage = getStorage(app);
      const name = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, name);
  
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const inlineStyles = `
            display: block;
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 10px auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            margin-bottom: 10px;
          `;
            editor.chain().focus().setImage({
              src: downloadURL,
              style: inlineStyles,
            }).run(); // Add image to editor
            setMedia(downloadURL);
            setIsUploading(false);
          });
        }
      );
    };


  return (
    <div className={styles.container}>
      {selectedImage && (
        <div className={styles.imageContainer}>
          <Image
            src={selectedImage}
            alt="Selected"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <TextInput
              withAsterisk
              label="Post title"

              className="w-full flex-1 text-black dark:text-white"
              placeholder="Post title"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextInput
              withAsterisk
              label=" keywords"
              className="w-full flex-1 text-black dark:text-white"
              placeholder="keywords, separated by commas, e.g. news, tech, lifestyle"
              defaultValue={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />

            <Textarea
              withAsterisk
              autosize
              minRows={2}
              maxRows={4}
              size="md"
              label="Post Description"
              className="w-full flex-1 text-black dark:text-white"
              placeholder="Post Description, e.g. This is a post about..."
              defaultValue={postDesc}
              onChange={(e) => setPostDesc(e.target.value)}
            />

            <Select
              label="Category"
              defaultValue={"NEWS"}
              className="w-full flex-1 text-black"
              placeholder="Pick Category"
              data={["NEWS", "TECHNOLOGY", "LIFESTYLE", "EDUCATION"]}
              onChange={(val) => setCatSlug(val)}
            />
          </div>

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

        <RichTextEditor
            editor={editor}
            className="bg-white dark:bg-[#020b19] rounded-lg border border-slate-300 dark:border-[#1f2b3d] shadow-md"
          >


            {editor && (
              <BubbleMenu editor={editor}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Link />
                </RichTextEditor.ControlsGroup>
              </BubbleMenu>
            )}

            {editor && (
              <FloatingMenu editor={editor}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.BulletList />
                  <Dropzone
                    openRef={openRef}
                    //loading={isUploading}
                    onDrop={(files) => addImageToEditor(files[0])} // Handle image drop
                    accept={["image/jpeg", "image/png", "image/jpg", "image/gif"]}
                    multiple={false}
                    ref={dropzoneRef}
                    maxSize={512000} // 10MB
                    onReject={(files) => {
                      toast.error("Unsupported format.", {
                        duration: 3000,
                      });
                    }}
                  >
                    <ImageIcon width={27} height={27} color="gray" className="cursor-pointer" />
                  </Dropzone>
                </RichTextEditor.ControlsGroup>
              </FloatingMenu>
            )}

            <RichTextEditor.Toolbar sticky stickyOffset={20}>
              <RichTextEditor.ColorPicker
                colors={[
                  "#25262b",
                  "#868e96",
                  "#fa5252",
                  "#e64980",
                  "#be4bdb",
                  "#7950f2",
                  "#4c6ef5",
                  "#228be6",
                  "#15aabf",
                  "#12b886",
                  "#40c057",
                  "#82c91e",
                  "#fab005",
                  "#fd7e14",
                ]}
              />
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Control interactive={true}>
                  <IconColorPicker size="1rem" stroke={1.5} />
                </RichTextEditor.Control>
                <RichTextEditor.Color color="#F03E3E" />
                <RichTextEditor.Color color="#7048E8" />
                <RichTextEditor.Color color="#1098AD" />
                <RichTextEditor.Color color="#37B24D" />
                <RichTextEditor.Color color="#F59F00" />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.UnsetColor />

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
              </RichTextEditor.ControlsGroup>


              <div className="flex items-center border border-gray-200 pl-2 pr-2 rounded-md justify-between gap-2">
                <RichTextEditor.ControlsGroup>
                  <Dropzone
                    openRef={openRef}
                    loading={isUploading}
                    onDrop={(files) => addImageToEditor(files[0])} // Handle image drop
                    accept={["image/jpeg", "image/png", "image/jpg", "image/gif"]}
                    multiple={false}
                    ref={dropzoneRef}
                    //maxSize={10240} // 10MB
                    onReject={(files) => {
                      toast.error("Unsupported format.", {
                        duration: 3000,
                      });
                    }}
                  >
                    <ImageIcon width={27} height={27} color="gray" className="cursor-pointer" />
                  </Dropzone>
                  <RichTextEditor.CodeBlock />
                </RichTextEditor.ControlsGroup>
              </div>


              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content className="w-full prose-lg text-black prose-invert" />
          </RichTextEditor>
      </div>
      
      <div className="w-full flex items-end justify-end mt-6">
        <Button
          className="bg-blue-600 disabled:bg-gray-500"
          disabled={loading}
          onClick={() => handleSubmit()}
        >
          {loading ? "Publishing" : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default EditPostForm;

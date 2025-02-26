"use client";
import { Button, Select, TextInput } from "@mantine/core";
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

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isPreview, setIsPreview] = useState(false); // New state for preview mode
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const openRef = useRef(null);
  const dropzoneRef = useRef(null);

  useEffect(() => {
    dropzoneRef.current?.focus();
  }, []);

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
    if (!file || !title) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: editor.getHTML(),
          img: media,
          slug: slugify(title),
          catSlug: catSlug || "LIFESTYLE",
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success("Post published successfully!");
        router.push(`/posts/${data.slug}`);
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
    <>
      {/* Toggle Button for Preview */}
      <div className="mb-4 flex justify-between">
        <h2 className="text-lg font-bold text-slate-500 dark:text-white">
          {isPreview ? "Preview Mode" : "Edit Mode"}
        </h2>
        <Button onClick={() => setIsPreview(!isPreview)}>
          {isPreview ? "Switch to Edit" : "Switch to Preview"}
        </Button>
      </div>

      {!isPreview ? (
        <>
          <div className="w-full  flex flex-col md:flex-row flex-wrap gap-5 mb-8">
            <TextInput
              withAsterisk
              label="Post title"
              className="w-full flex-1 text-black dark:text-white"
              placeholder="Post title"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Select
              label="Category"
              defaultValue={"NEWS"}
              className="w-full flex-1 text-black dark:text-white"
              placeholder="Pick Category"
              data={["CHEMISTRY", "PHYSICS", "SPORTS", "PROGRAMMING", "EDUCATION", "LIFESTYLE"]}
              onChange={(val) => setCatSlug(val)}
            />
          </div>

          {/* Image Preview */}
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

          <div className={styles.editor}>
            <button className={styles.button} onClick={() => setOpen(!open)}>
              <CircleFadingPlusIcon width={30} height={30} />
            </button>
            {open && (
              <div className={styles.add}>
                <input
                  type="file"
                  id="image"
                  data-max-size="5120"
                  accept=".jpg, .png, .jpeg"
                  onChange={handleImageChange} // Update to use the new handler
                  style={{ display: "none" }}
                />
                <button className={styles.addButton}>
                  <label htmlFor="image">
                    <ImageIcon color="red" width={30} height={30} />
                  </label>
                </button>
              </div>
            )}
          </div>

          <RichTextEditor editor={editor}>
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

            <RichTextEditor.Content
              className="py-8"
              style={{ height: "200px", overflowY: "auto" }}
            />
          </RichTextEditor>
        </>
      ) : (
        <div className="bg-gray-100 dark:bg-[#020b19] p-4 rounded-md">
          {/* Preview mode: Render the HTML generated by the editor */}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {selectedImage && (
            <div className="relative w-full h-64 mt-4 rounded-md">
              <Image
                src={selectedImage}
                className={styles.imageContainer}
                alt="Post Image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <div
            className="prose prose-lg dark:prose-dark max-w-none text-slate-900 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        </div>
      )}

      <div className="w-full flex items-end justify-end mt-6">
        <Button
          className="bg-blue-600 disabled:bg-gray-500"
          disabled={loading}
          onClick={() => handleSubmit()}
        >
          {loading ? "Publishing" : "Publish"}
        </Button>
      </div>
    </>
  );
};

export default WritePage;

"use client";

import {
  faFacebook,
  faGithub,
  faInstagram,
  faXTwitter,
  faYoutube,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { ReactSortable } from "react-sortablejs";
import {
  faCoffee,
  faGlobe,
  faGripLines,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const allButtons = [
  {
    key: "instagram",
    label: "instagram",
    icon: faInstagram,
    placeholder: "https://instagram.com/profile/...",
    color: "#E4405F", // Instagram Pink
  },
  {
    key: "facebook",
    label: "facebook",
    icon: faFacebook,
    color: "#1877F2", // Facebook Blue
    placeholder: "https://facebook.com/profile/...",
  },
  {
    key: "linkedin",
    label: "linkedin",
    icon: faLinkedin,
    color: "#0A66C2", // LinkedIn Blue
    placeholder: "https://linkedin.com/in/...",
  },
  {
    key: "twitter",
    label: "twitter",
    icon: faXTwitter,
    color: "#1DA1F2", // Twitter Blue
    placeholder: "https://twitter.com/...",
  },
  {
    key: "youtube",
    label: "youtube",
    icon: faYoutube,
    color: "#FF0000", // YouTube Red
    placeholder: "https://youtube.com/c/...",
  },
  {
    key: "buymeacoffee",
    label: "buy me a coffee",
    icon: faCoffee,
    color: "#FFDD00", // Buy Me A Coffee Yellow
    placeholder: "https://buymeacoffee.com/...",
  },
  {
    key: "github",
    label: "github",
    icon: faGithub,
    color: "#171515", // GitHub Black
    placeholder: "https://github.com/...",
  },
  {
    key: "website",
    label: "website",
    icon: faGlobe,
    color: "#0088CC", // Common Website Color
    placeholder: "https://yourwebsite.com",
  },
];

function upperFirst(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

const handleSubmit = async (event, id) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL; 
  const data = Object.fromEntries(formData.entries());

  try {
    await fetch(`${baseUrl}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to update profile.");
  }
};

export default function PageButtonsForm({ user }) {
  const [website, setWebsite] = useState(user?.website);
  const [linkedin, setLinkedin] = useState(user.linkedin);
  const [facebook, setFacebook] = useState(user.facebook);
  const [twitter, setTwitter] = useState(user.twitter);
  const [buymeacoffee, setBuymeacoffee] = useState(user.buymeacoffee);
  const [youtube, setYoutube] = useState(user.youtube);
  const [instagram, setInstagram] = useState(user.instagram);
  const [github, setGithub] = useState(user.github);
  const [activeButtons, setActiveButtons] = useState([]);

  function addButtonToProfile(button) {
    setActiveButtons((prevButtons) => {
      return [...prevButtons, button];
    });
  }

  function removeButton({ key: keyToRemove }) {
    setActiveButtons((prevButtons) => {
      return prevButtons.filter((button) => button.key !== keyToRemove);
    });
  }

  const availableButtons = allButtons.filter(
    (b1) => !activeButtons.find((b2) => b1.key === b2.key)
  );

  const handleInputChange = (key, value) => {
    switch (key) {
      case "website":
        setWebsite(value);
        break;
      case "linkedin":
        setLinkedin(value);
        break;
      case "facebook":
        setFacebook(value);
        break;
      case "twitter":
        setTwitter(value);
        break;
      case "buymeacoffee":
        setBuymeacoffee(value);
        break;
      case "youtube":
        setYoutube(value);
        break;
      case "instagram":
        setInstagram(value);
        break;
      case "github":
        setGithub(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-[#020b19] m-8 p-4 shadow">
      <Toaster />
      <form onSubmit={(e) => handleSubmit(e, user.id)}>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>

        <ReactSortable
          handle=".handle"
          list={activeButtons}
          setList={setActiveButtons}
        >
          {activeButtons.map((b) => (
            <div key={b.key} className="mb-4 md:flex items-center">
              <div className="w-56 flex h-full p-2 gap-2 items-center">
                <FontAwesomeIcon
                  icon={faGripLines}
                  className="cursor-pointer handle p-2"
                />

                <FontAwesomeIcon icon={b.icon} style={{ color: b.color }} />
                <span>{upperFirst(b.label)}:</span>
              </div>
              <div className="grow flex">
                <input
                  placeholder={b.placeholder}
                  name={b.key}
                  defaultValue={[b.key]}
                  value={eval(b.key)}
                  type="url"
                  onChange={(e) => handleInputChange(b.key, e.target.value)}
                  style={{ marginBottom: "0" }}
                  className="flex h-[48px] rounded-md border border-gray-300 focus:border-blue-500 font-light px-4 py-5 text-base outline-none"
                />
                <button
                  onClick={() => removeButton(b)}
                  type="button"
                  className="py-2 px-4 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </ReactSortable>
        <div className="flex flex-wrap gap-2 mt-4 border-y py-4">
          {availableButtons.map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={() => addButtonToProfile(b)}
              className="flex items-center gap-1 p-2 "
            >
              <FontAwesomeIcon icon={b.icon} style={{ color: b.color }} />
              <span className="">{upperFirst(b.label)}</span>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          ))}
        </div>
        <div className="max-w-xs mx-auto mt-8">
          <button className="bg-blue-500 rounded-md disabled:bg-slate-400 disabled:text-gray-200 py-2 px-4 mx-auto w-full flex gap-2 items-center justify-center " disabled={activeButtons.length === 0}>
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  );
}

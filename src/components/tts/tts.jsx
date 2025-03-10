"use client";

import React, { useEffect, useState } from "react";
import {
  speakText,
  pauseSpeech,
  resumeSpeech,
  stopSpeech,
} from "@/utils/speechSynthesis";
import { CirclePause, CirclePlay, CircleStop } from "lucide-react";
import toast from "react-hot-toast";
import parse from "html-react-parser";

const Tts = ({ data }) => {
  const [speechState, setSpeechState] = useState("stopped");

  // Function to extract plain text from HTML
  const extractTextFromHtml = (html) => {
    let textContent = "";
    parse(html, {
      replace: (domNode) => {
        if (domNode.type === "text") {
          textContent += domNode.data;
        }
      },
    });
    return textContent;
  };

  const handleSpeak = () => {
    if (data?.desc) {
      const textToSpeak = extractTextFromHtml(data.desc); // Extract plain text from HTML
      if (textToSpeak) {
        toast.loading("Loading");
        speakText(textToSpeak); // Pass the extracted text to the TTS function
        setSpeechState("playing");
      } else {
        toast.custom("No readable content available.");
      }
    } else {
      toast.custom("No content available to read.");
    }
  };

  const handlePause = () => {
    pauseSpeech();
    setSpeechState("paused");
  };

  const handleResume = () => {
    resumeSpeech();
    setSpeechState("playing");
  };

  const handleStop = () => {
    stopSpeech();
    setSpeechState("stopped");
  };

  useEffect(() => {
    // Cleanup speech synthesis when the component unmounts
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <div>
      {speechState === "stopped" && (
        <button
          className="flex-1 text-slate-800 dark:text-slate-200 font-medium flex items-center"
          onClick={handleSpeak}
          aria-label="Listen to the content"
        >
          <CirclePlay className="mr-2 placeholder:text-slate-800 dark:text-slate-200 font-medium" />
          Listen
        </button>
      )}
      {speechState === "playing" && (
        <>
          <button
            className="flex-1 text-slate-800 dark:text-slate-200 font-medium flex items-center"
            onClick={handlePause}
            aria-label="Pause speech"
          >
            <CirclePause className="mr-2 placeholder:text-slate-800 dark:text-slate-200 font-medium" />
            Pause
          </button>
          <button
            className="flex-1 text-slate-800 dark:text-slate-200 font-medium flex items-center"
            onClick={handleStop}
            aria-label="Stop speech"
          >
            <CircleStop className="mr-2 placeholder:text-slate-800 dark:text-slate-200 font-medium" />
            Stop
          </button>
        </>
      )}
      {speechState === "paused" && (
        <>
          <button
            className="flex-1 text-slate-800 dark:text-slate-200 font-medium flex items-center"
            onClick={handleResume}
            aria-label="Resume speech"
          >
            <CirclePlay className="mr-2" />
            Resume
          </button>
          <button
            className="flex-1 text-slate-800 dark:text-slate-200 font-medium flex items-center mt-2"
            onClick={handleStop}
            aria-label="Stop speech"
          >
            <CircleStop className="mr-2" />
            Stop
          </button>
        </>
      )}
    </div>
  );
};

export default Tts;

import React from "react";
import { useRef, useEffect, useState } from "react";
import "./styles.css";

const Video = ({ video, className = null, newVideo = false }) => {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  // Function to handle key presses
  const handleKeyDown = (event) => {
    const video = videoRef.current;
    if (!isActive || !video) return;

    if (event.key === "ArrowRight") {
      video.currentTime += 2; // Change this value to set the skip time forward
    } else if (event.key === "ArrowLeft") {
      video.currentTime -= 2; // Change this value to set the skip time backward
    }
  };

  useEffect(() => {
    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  return (
    <>
      <video
        ref={videoRef}
        controls
        style={{ maxWidth: "100%" }}
        className={className}
        onClick={() => setIsActive(true)} // Activate when clicked
        onPause={() => setIsActive(false)} // Deactivate when paused
        onBlur={() => setIsActive(false)} // Deactivate when it loses focus
      >
        <source
          src={
            newVideo
              ? URL.createObjectURL(video)
              : `http://localhost:8000/api/videos/${video}`
          }
          type={
            newVideo
              ? video.type
              : `video/${video.split(".").pop().toLowerCase()}`
          }
        />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default Video;

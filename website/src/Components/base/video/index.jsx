import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";

const Video = ({ video, newVideo = false }) => {
  return (
    <>
      <video
        controls
        style={{ maxWidth: "100%" }}
      >
        <source
          src={newVideo ? URL.createObjectURL(video) : `http://localhost:8000/api/videos/${video}`}
          type={newVideo ? video.type : `video/${video.split(".").pop().toLowerCase()}`}
        />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default Video;


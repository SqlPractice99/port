import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";

const Image = ({
  src,
  alt,
  className,
  onClick = null,
  fullImage = null,
  title = null,
  imageArray = [],
  currentIndex,
  setCurrentIndex,
  display = null,
  slideshow = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(currentIndex); // Track current image index
  const imageExtensions = ["jpeg", "jpg", "png"];

  useEffect(() => {
    if (isOpen) {
      setIndex(currentIndex); // Reset index when modal opens
    }
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (!currentIndex) {
      setIndex(0);
    } else {
      setIndex(currentIndex);
    }
    // console.log("Index: " + index)
    // console.log("currentIndexxxxxxxxx: " + currentIndex)
    // console.log("slideshow: " + slideshow)
  }, [currentIndex]);

  useEffect(() => {
    if (imageArray.length == 0 && display === "true") {
      // console.log("whatttttttttt: " + src);
    }
    // console.log("IIIIIIndex: " + index)
    // console.log("ccccccurrentIndex: " + currentIndex)
  }, []);

  const prevSlide = (e) => {
    //e.stopPropagation(); // Prevent closing popup when clicking button
    setIndex((prev) => (prev > 0 ? prev - 1 : imageArray.length - 1));
    // console.log("nooooooooo   " + slideshow);
    if (slideshow) {
      // console.log("helloooooooooo");
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageArray.length - 1));
    }

    // console.log("Index: " + index);
    // console.log("currentIndex: " + currentIndex);
  };

  const nextSlide = (e) => {
    //e.stopPropagation();
    setIndex((prev) => (prev < imageArray.length - 1 ? prev + 1 : 0));
    // console.log("nooooooooo   " + slideshow);
    if (slideshow) {
      // console.log("helloooooooooo");
      setCurrentIndex((prev) => (prev < imageArray.length - 1 ? prev + 1 : 0));
    }

    // console.log("Index: " + index);
    // console.log("currentIndex: " + currentIndex);
  };

  // Listen for keyboard events when popup is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        setIsOpen(false); // Close popup on Escape key
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // useEffect(() => {
  //   console.log(imageExtensions);

  //   if (imageArray.length > 0) {
  //     console.log("Current File:", imageArray[index]);
  //     console.log("File Type:", imageArray[index]?.split(".").pop()?.toLowerCase());
  //   }
  // }, [index, imageArray]);
  

  return (
    <>
      <img
        src={src}
        alt={alt}
        title={title}
        className={className}
        onClick={fullImage ? () => setIsOpen(true) : onClick}
      />

      {isOpen && fullImage && (
        <div
          className="popupmodal-overlay fit-wdith"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="popupmodal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="popupclose-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>

            {/* Navigation Buttons */}
            {imageArray?.length > 0 ? (
              <button className="prevBtn" onClick={prevSlide}>
                ❮
              </button>
            ) : (
              <></>
            )}

            {imageExtensions.includes(imageArray[index].split(".").pop().toLowerCase()) ? (
              <img
                src={
                  imageArray?.length > 0
                    ? `http://localhost:8000/${imageArray[index]}`
                    : src
                }
                alt={`Image ${index + 1}`}
                className="popup-image"
              />
            ) : (
              <video controls style={{ marginTop: "10px" }}>
                <source src={imageArray?.length > 0
                    ? `http://localhost:8000/${imageArray[index]}`
                    : src} />
                Your browser does not support the video tag.
              </video>
            )}
            {imageArray?.length > 0 ? (
              <button className="nextBtn" onClick={nextSlide}>
                ❯
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Image;
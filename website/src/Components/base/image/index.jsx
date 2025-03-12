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

  const getNextImageIndex = (currentIndex, direction) => {
    let newIndex = currentIndex;

    do {
      newIndex = (newIndex + direction + imageArray.length) % imageArray.length;
    } while (
      !imageExtensions.includes(
        imageArray[newIndex].split(".").pop().toLowerCase()
      ) &&
      newIndex !== currentIndex
    );

    return newIndex;
  };

  const prevSlide = () => {
    if (imageArray.length === 0) return;
    setIndex(getNextImageIndex(index, -1));
    if (slideshow) setCurrentIndex(getNextImageIndex(index, -1));
  };

  const nextSlide = () => {
    if (imageArray.length === 0) return;
    setIndex(getNextImageIndex(index, 1));
    if (slideshow) setCurrentIndex(getNextImageIndex(index, 1));
  };

  // Listen for keyboard events when popup is open
  useEffect(() => {
    if (!isOpen) return;
  
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setIndex(getNextImageIndex(index, 1));
        if (slideshow) setCurrentIndex(getNextImageIndex(index, 1));
      } else if (e.key === "ArrowLeft") {
        setIndex(getNextImageIndex(index, -1));
        if (slideshow) setCurrentIndex(getNextImageIndex(index, -1));
      } else if (e.key === "Escape") {
        setIsOpen(false); // Close popup on Escape key
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, index, slideshow]); // Added dependencies
  

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

            {imageExtensions.includes(
              imageArray[index].split(".").pop().toLowerCase()
            ) ? (
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
              <></>
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

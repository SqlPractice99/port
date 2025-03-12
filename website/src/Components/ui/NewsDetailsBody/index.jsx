import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../base/image";
import axios from "axios";
import ShareButton from "../../base/ShareButton";
import Video from "../../base/video";

const NewsDetailsBody = () => {
  // const { encodedNews } = useParams(); // Get encoded news from URL
  // const { slug } = useParams();
  const imageExtensions = ["jpeg", "jpg", "png"];
  const location = useLocation();
  const storedNews = sessionStorage.getItem("news");
  const [news, setNews] = useState(
    storedNews ? JSON.parse(storedNews) : location.state?.news
  );
  const token = JSON.parse(localStorage.getItem("userToken"));
  const language = useSelector((state) => state.language.language);

  // State for image scaling
  const [imageScale, setImageScale] = useState(40); // Default 100% scale

  // Function to handle image scaling
  const handleScaleChange = (e) => {
    setImageScale(e.target.value);
  };

  // States for edit mode
  const [title, setTitle] = useState(news.title);
  const [enTitle, setEnTitle] = useState(news.enTitle);
  const [content, setContent] = useState(news.content);
  const [enContent, setEnContent] = useState(news.enContent);
  const [isEditing, setIsEditing] = useState(false);

  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState({
    title: news.title,
    enTitle: news.enTitle,
    content: news.content,
    enContent: news.enContent,
    images: JSON.parse(news.image) || [],
  });

  // Manage images
  // const [existingImages, setExistingImages] = useState(JSON.parse(news.image) || []);
  const [existingImages, setExistingImages] = useState(
    Array.isArray(news.image) ? news.image : JSON.parse(news.image)
  );
  const [newImages, setNewImages] = useState([]);

  const [layout, setLayout] = useState("flex-wrap"); // Default layout

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageArray.length) % imageArray.length
    );
  };

  const handleTabClick = (layoutType) => {
    setLayout(layoutType);
  };

  // Enable edit mode and store original values
  const handleEditClick = () => {
    setOriginalData((prev) => ({
      title: news.title ?? prev.title, // Keep previous value if null/undefined
      enTitle: news.enTitle ?? prev.enTitle, // Keep previous value if null/undefined
      content: news.content ?? prev.content,
      enContent: news.enContent ?? prev.enContent,
      images: existingImages,
    }));
    setIsEditing(true);
    setLayout("flex-wrap");
  };

  // Handle Save
  const handleSaveClick = async () => {
    // console.log("news.id: " + news.id )
    // console.log("title: " + title )
    // console.log("content: " + content)imageArrayexisting
    // console.log("token: " + token)
    const formData = new FormData();
    formData.append("token", token);
    formData.append("id", news.id);
    formData.append("title", title);
    formData.append("enTitle", enTitle);
    formData.append("content", content);
    formData.append("enContent", enContent);

    {
      /* Extra method to read the FormData */
    }
    // const formDataObject = {};
    // formData.forEach((value, key) => {
    //   formDataObject[key] = value;
    // });
    // console.log("FormData as an object:", formDataObject);
    // console.log("existingImages");
    // console.log(existingImages);
    let imageArray = [];

    if (Array.isArray(existingImages)) {
      // console.log(existingImages)
      // console.log(Array.isArray(existingImages))
      // Case 1: If existingImages is already an array, keep it as is
      console.log("case 1");
      console.log(typeof existingImages);

      imageArray = existingImages;
    } else if (typeof existingImages === "object" && existingImages !== null) {
      // Case 2: If existingImages is an object, convert it to an array using Object.values
      console.log("case 2");
      console.log(typeof existingImages);
      imageArray = Object.values(existingImages);
    } else {
      try {
        // Case 3: If it's neither an array nor an object, try parsing it as a JSON string
        // console.log(typeof existingImages);
        // console.log(existingImages);

        if (typeof existingImages === "string") {
          imageArray = Object.values(JSON.parse(existingImages));
          console.log("case 3");
          console.log(typeof existingImages);
          // console.log(imageArray);

          // If parsed result is not an array, set to an empty array
          // console.log(typeof imageArray);

          if (!Array.isArray(imageArray)) {
            console.error("Parsed result is not an array");
            imageArray = []; // Fallback to an empty array
          }
        } else {
          console.error(
            "existingImages is neither an array nor a valid string"
          );
          imageArray = []; // Fallback to an empty array if it's an invalid type
        }
      } catch (error) {
        // If parsing fails, handle the error and set to an empty array
        console.error("Failed to parse existingImages:", error);
        imageArray = []; // Fallback to empty array
      }
    }

    // console.log(imageArray); // Final array

    // console.log(imageArray);
    // console.log(Array.isArray(imageArray));

    imageArray.forEach((img, index) =>
      formData.append(`imageArray[${index}]`, img)
    );
    // console.log(imageArray);

    newImages.forEach((img) => formData.append("newImages[]", img));
    // console.log(newImages); // Append new images

    // const allImages = [...Object.values(existingImages), ...newImages]; // Merge existing and new images

    // allImages.forEach((img, index) => formData.append(`images[${index}]`, img));

    // console.log("Logging FormData:");
    // for (let [key, value] of formData.entries()) {
    // console.log(`${key}:`, value);
    // }

    try {
      // console.log("Logging FormData:");
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
      const response = await axios.post(
        "http://localhost:8000/api/editNews",
        formData
      );
      // console.log("Dataaaa: ");
      // console.log(response.data);
      setIsEditing(false);
      // console.log(response.data.data.image);
      // console.log(Array.isArray(response.data.data.image));

      // console.log(Object.values(response.data.data.image));
      setNews((prevNews) => {
        let newImages = [];

        try {
          if (response.data.data.image) {
            // Ensure it's an array
            newImages = response.data.data.image;

            // console.error("newImagessssssssss:");
            // console.log(newImages);

            setExistingImages(response.data.data.image);
          }
        } catch (error) {
          console.error("Error processing imagePaths:", error);
          newImages = []; // Fallback to empty array
        }

        // Ensure existingImages is always an array
        let existingImagesArray;
        try {
          existingImagesArray = Object.values(
            JSON.parse(response.data.data.image)
          );
          // console.log(existingImagesArray);
          // Convert from string to array
          // console.log("existingImagesArray");
          // console.log(existingImagesArray);
          // if (!Array.isArray(existingImagesArray)) {
          // existingImagesArray = []; // Fallback if it's not a valid array
          // }
        } catch {
          console.log("error existingImagesArray");
          // existingImagesArray = []; // Fallback if parsing fails
        }

        existingImagesArray = [...existingImagesArray];
        // console.log("Final existingImagesArray:", existingImagesArray);
        // console.log("New images being added:", newImages);

        return {
          ...prevNews,
          title: title,
          enTitle: enTitle,
          content: content,
          enContent: enContent,
          image: JSON.stringify(response.data.data.image), // Properly formatted array
        };
      });

      // ✅ Update `existingImages` state
      // setExistingImages((prev) => [
      //   ...prev,
      //   ...response.data.imagePaths // Add new images
      // ]);

      // ✅ Clear newImages since they are now saved
      setNewImages([]);
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news");
    }
  };

  // Handle Cancel (restore original data)
  const handleCancelClick = () => {
    setTitle(originalData.title);
    setEnTitle(originalData.enTitle);
    setContent(originalData.content);
    setEnContent(originalData.enContent);
    setExistingImages(originalData.images);
    setNewImages([]);
    setIsEditing(false);
  };

  // Handle Image Removal
  const handleRemoveImage = (index, isNewImage = false) => {
    setCurrentIndex(0);
    if (isNewImage) {
      setNewImages((prev) =>
        Array.isArray(prev)
          ? [...prev.slice(0, index), ...prev.slice(index + 1)]
          : prev
      );
    } else {
      // console.log("Before removing:", existingImages);

      setExistingImages((prev) => {
        // Convert `prev` (object) to an array
        // console.log(prev)
        // console.log(typeof (prev))
        let imageArray;
        if (typeof prev !== "object") {
          imageArray = Object.values(JSON.parse(prev));
        } else {
          imageArray = Object.values(prev);
        }
        // console.log(imageArray)

        if (!Array.isArray(imageArray)) {
          console.error("existingImages is not an array:", imageArray);
          return prev; // Return the original state if conversion fails
        }

        // Remove the selected image
        let updatedImages = imageArray.filter((_, i) => i !== index);

        // console.log("After removing:", updatedImages);
        return updatedImages;
      });
    }
  };

  // Handle Image Upload
  const handleImageUpload = (event) => {
    if (!event.target.files) return;

    // Create a temporary array to store files in order
    let selectedFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      selectedFiles.push(event.target.files[i]); // Push in selection order
    }

    setNewImages((prev) => [...prev, ...selectedFiles]); // Maintain order
  };

  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   const droppedFiles = Array.from(event.dataTransfer.files);
  //   setNewImages((prev) => [...prev, ...droppedFiles]);
  // };

  // // Prevent default browser behavior for drag events
  // const preventDefaults = (event) => {
  //   event.preventDefault();
  // };

  useEffect(() => {
    if (news) {
      sessionStorage.setItem("news", JSON.stringify(news));
    }
    // console.log(news);
  }, [news]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("news");
    };
  }, []);

  // useEffect(() => {
  //   console.log("Updated existingImages:", existingImages);
  // }, [existingImages]);

  // useEffect(() => {
  //   console.log("imageScale " + imageScale);
  // }, [imageScale]);

  let imageArray = [];
  let imageType;

  // console.log(existingImages)
  if (Array.isArray(existingImages)) {
    // console.log(Array.isArray(existingImages))
    // console.log(existingImages)

    // Case 1: If existingImages is already an array, keep it as is
    console.log("case 1");
    console.log(typeof existingImages);

    imageArray = existingImages;
  } else if (typeof existingImages === "object" && existingImages !== null) {
    // Case 2: If existingImages is an object, convert it to an array using Object.values
    console.log("case 2");
    console.log(typeof existingImages);
    imageArray = Object.values(existingImages);
  } else {
    try {
      // Case 3: If it's neither an array nor an object, try parsing it as a JSON string
      console.log("case 3");
      console.log(typeof existingImages);
      // console.log(existingImages);

      if (typeof existingImages === "string") {
        imageArray = Object.values(JSON.parse(existingImages));
        // console.log(typeof existingImages);
        // console.log(imageArray);

        // If parsed result is not an array, set to an empty array
        // console.log(typeof imageArray);

        if (!Array.isArray(imageArray)) {
          console.error("Parsed result is not an array");
          imageArray = []; // Fallback to an empty array
        }
      } else {
        console.error("existingImages is neither an array nor a valid string");
        imageArray = []; // Fallback to an empty array if it's an invalid type
      }
    } catch (error) {
      // If parsing fails, handle the error and set to an empty array
      console.error("Failed to parse existingImages: ", error);
      imageArray = []; // Fallback to empty array
    }
  }

  // console.log(imageArray); // Final array

  // console.log(imageArray); // Check the result

  // console.log("imageArray");
  // console.log(imageArray);
  // console.log(imageArray.length === 0);
  // console.log(Array.isArray(imageArray));

  const tenderDetailsContent = [
    <div
      key="left"
      className={`tenderDetailsLeft flex column align-items width-50 ${
        language === "en" ? "marginLeft-0" : ""
      }`}
    >
      <div className="tenderDetailsLeftContent">
        <div
          className={`tenderDetailsDateContainer flex column ${
            language === "en" ? "align-items-start" : "align-items-end"
          }`}
        >
          <div className="tenderDetailsDate flex">
            {new Intl.DateTimeFormat("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(news.created_at))}
          </div>
        </div>

        {/* Editable Title */}
        {isEditing ? (
          <textarea
            type="text"
            value={language === "en" ? enTitle : title}
            onChange={(e) =>
              language === "en"
                ? setEnTitle(e.target.value)
                : setTitle(e.target.value)
            }
            className={`editInput ${language === "en" ? "en" : "ar"}`}
          />
        ) : (
          <div
            className={`newsDetailsTitle ${language === "en" ? "en" : "ar"}`}
          >
            {language === "en" ? news.enTitle : news.title}
          </div>
        )}
      </div>
    </div>,

    <div key="right" className="tenderDetailsRight flex column width-50">
      <Image
        src={`http://localhost:8000/${news.coverImg}`}
        alt="Tenders of Port of Beirut"
        title="PORT OF BEIRUT"
        className="tenderDetailsCoverImg flex center"
      />
    </div>,
  ];

  //   useEffect(() => {
  //     if (!news) {
  //         axios.get(`/api/news/${slug}`)
  //             .then(response => setNews(response.data))
  //             .catch(error => console.error("Error fetching news:", error));
  //     }
  // }, [slug, news]);

  // useEffect(() => {
  //   try {
  //       const decodedNews = JSON.parse(atob(encodedNews)); // Decode Base64
  //       setNews(decodedNews);
  //       console.log(decodedNews)
  //   } catch (error) {
  //       console.error("Invalid news data:", error);
  //   }
  // }, [encodedNews]);

  return (
    <div className="tenderDetailsContainer width-100 flex column center">
      <div className="newsDetailsSection flex column">
        <div className="tenderDetails flex">
          {language === "ar"
            ? tenderDetailsContent
            : tenderDetailsContent.reverse()}
        </div>

        {/* Editable Content */}
        <div className="newsDetailsDownload flex column align-items-end">
          {isEditing ? (
            <textarea
              value={`${language === "en" ? enContent : content}`}
              onChange={(e) =>
                language === "en"
                  ? setEnContent(e.target.value)
                  : setContent(e.target.value)
              }
              className={`editTextarea ${language === "en" ? "en" : "ar"}`}
            />
          ) : (
            // <div className={`newsDetailsDownloadText ${language === 'en' ? 'en' : 'ar'}`}>{`${language === 'en' ? news.enContent : news.content}`}</div>
            (language === "en" ? news.enContent : news.content)
              ?.split("<br>")
              .map((line, index) =>
                line.trim() === "" ? (
                  <div key={index} className="empty-line"></div>
                ) : (
                  <p
                    key={index}
                    className={`newsDetailsDownloadText width-100 ${
                      language === "en" ? "en" : "ar"
                    }`}
                    style={{ margin: "0px" }}
                  >
                    {line}
                  </p>
                )
              )
          )}
        </div>

        {/* <div className="newsDetailsDownload flex column r-gap-30">
          {isEditing ? (
            <textarea
              value={enContent}
              onChange={(e) => setEnContent(e.target.value)}
              className="editTextarea en"
            />
          ) : (
            <div className="newsDetailsDownloadText en">{news.enContent}</div>
          )}
        </div> */}

        {/* Edit, Save & Cancel Buttons */}
        <div className="editButtons">
          {isEditing ? (
            <>
              <button className="saveBtn" onClick={handleSaveClick}>
                Save
              </button>
              <button className="cancelBtn" onClick={handleCancelClick}>
                Cancel
              </button>
            </>
          ) : (
            token && (
              <button className="editBtn" onClick={handleEditClick}>
                Edit
              </button>
            )
          )}
        </div>

        <div className="">
          <ShareButton news={news} />
        </div>

        <div className="flex center c-gap-20">
          {/* Layout Tabs */}
          {!isEditing && imageArray.length !== 0 ? (
            <div className="layoutTabs flex">
              <button
                className={`tabBtn ${layout === "flex-wrap" ? "active" : ""}`}
                onClick={() => handleTabClick("flex-wrap")}
              >
                Grid
              </button>
              <button
                className={`tabBtn ${layout === "slideshow" ? "active" : ""}`}
                onClick={() => handleTabClick("slideshow")}
              >
                Slideshow
              </button>
              <button
                className={`tabBtn ${layout === "column" ? "active" : ""}`}
                onClick={() => handleTabClick("column")}
              >
                Normal
              </button>
            </div>
          ) : (
            <></>
          )}

          {layout === "flex-wrap" && imageArray.length !== 0 ? (
            <div className="scale-slider flex center">
              <label>Scale: </label>
              <input
                type="range"
                min="20"
                max="70"
                step="10"
                value={imageScale}
                onChange={handleScaleChange}
              />
              <span>{imageScale}%</span>
            </div>
          ) : (
            <></>
          )}
        </div>

        {isEditing ? (
          <div className="upload-container flex center">
            <input
              type="file"
              multiple
              accept="image/*, video/*"
              onChange={handleImageUpload}
            />
          </div>
        ) : (
          <></>
        )}
        {/* Image Layout Rendering */}
        {layout === "flex-wrap" && (
          <div className="flex align-items-start justify-content wrap c-gap-30">
            {isEditing ? (
              <>
                {/* Existing Images */}
                {imageArray.map((imagePath, index) => (
                  <div
                    className={`newsDetailsImgCont flex wrap width-${imageScale} center width-${imageScale} border`}
                    key={`new-${index}`}
                  >
                    {imageExtensions.includes(
                      imagePath.split(".").pop().toLowerCase()
                    ) ? (
                      <Image
                        src={`http://localhost:8000/${imagePath}`}
                        alt={`News Image ${index + 1}`}
                        title={`Image ${index + 1}`}
                        className={`newsDetailsImg pointer flex border`}
                        fullImage="true"
                        imageArray={imageArray} // Pass the array of images
                        currentIndex={index}
                      />
                    ) : (
                      <Video video={imagePath} />
                    )}
                    <button
                      className="remove-btn pointer"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* New Uploaded Images (Preview) */}
                {newImages.map((imageFile, index) => (
                  <div
                    className={`newsDetailsImgCont flex wrap width-${imageScale} aspectRation5-4 border`}
                    key={`new-${index}`}
                  >
                    {console.log(imageFile.name)}
                    {imageExtensions.includes(
                      imageFile.name.split(".").pop().toLowerCase()
                    ) ? (
                      <Image
                        src={URL.createObjectURL(imageFile)} // Preview for new images
                        alt={`New Image ${index + 1}`}
                        title={`New Image ${index + 1}`}
                        className={`newsDetailsImg pointer flex border`}
                        fullImage="true"
                        imageArray={imageArray} // Pass the array of images
                        currentIndex={index}
                      />
                    ) : (
                      <Video video={imageFile} newVideo={true} />
                    )}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveImage(index, true)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </>
            ) : (
              // <>
              // {console.log('uye')}
              // {console.log(imageArray)}
              // </>
              imageArray.map((imagePath, index) => (
                <div
                  className={`newsDetailsImgCont flex width-${imageScale} aspectRation5-4`}
                  key={`new-${index}`}
                >
                  {imageExtensions.includes(
                    imagePath.split(".").pop().toLowerCase()
                  ) ? (
                    <Image
                      src={`http://localhost:8000/${imagePath}`}
                      alt={`News Image ${index + 1}`}
                      title={`Image ${index + 1}`}
                      className={`newsDetailsImg pointer flex`}
                      fullImage="true"
                      imageArray={imageArray} // Pass the array of images
                      currentIndex={index}
                      display="true"
                    />
                  ) : (
                    <Video video={imagePath} />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {layout === "slideshow" && (
          <div className="slideshow-container flex center">
            <div className="slideshow-slide flex">
              {imageExtensions.includes(
                imageArray[currentIndex].split(".").pop().toLowerCase()
              ) ? (
                <Image
                  src={`http://localhost:8000/${imageArray[currentIndex]}`}
                  alt={`Slide ${currentIndex + 1}`}
                  title={`Slide ${currentIndex + 1}`}
                  className="newsDetailsImg pointer"
                  fullImage="true"
                  imageArray={imageArray} // Pass the array of images
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  slideshow={true}
                />
              ) : (
                <video controls style={{ marginTop: "10px" }}>
                  <source
                    src={`http://localhost:8000/api/videos/${imageArray[currentIndex]}`}
                    type={`video/${imageArray[currentIndex]
                      .split(".")
                      .pop()
                      .toLowerCase()}`}
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            {/* Navigation Buttons */}
            <button className="prevBtn" onClick={prevSlide}>
              ❮
            </button>
            <button className="nextBtn" onClick={nextSlide}>
              ❯
            </button>
          </div>
        )}

        {layout === "column" && (
          <div className="column-images flex center column">
            {imageArray.map((imagePath, index) => (
              <div
                className={`newsDetailsImgCont flex`}
                style={layout === "column" ? { maxWidth: "none" } : {}}
                key={`new-${index}`}
              >
                {imageExtensions.includes(
                  imagePath.split(".").pop().toLowerCase()
                ) ? (
                  <Image
                    src={`http://localhost:8000/${imagePath}`}
                    alt={`News Image ${index + 1}`}
                    title={`Image ${index + 1}`}
                    className={`newsDetailsImg pointer flex`}
                    fullImage="true"
                    imageArray={imageArray} // Pass the array of images
                    currentIndex={index}
                  />
                ) : (
                  <Video video={imagePath} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetailsBody;

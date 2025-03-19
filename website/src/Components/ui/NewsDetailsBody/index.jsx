import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../base/image";
import axios from "axios";
import ShareButton from "../../base/ShareButton";
import Video from "../../base/video";
import MediaGallery from "../../base/mediaGallery";

const NewsDetailsBody = () => {
  // const initialMedia = [
  //   { id: "1", name: "Image 1", thumb: "/images/gary.png" },
  //   { id: "2", name: "Image 2", thumb: "/images/cato.png" },
  //   { id: "3", name: "Image 3", thumb: "/images/kvn.png" },
  // ];
  // const [media, setMedia] = useState(initialMedia);
  const imageExtensions = ["jpeg", "jpg", "png"];
  const location = useLocation();
  const storedNews = sessionStorage.getItem("news");
  const token = JSON.parse(localStorage.getItem("userToken"));
  const language = useSelector((state) => state.language.language);
  const [newImages, setNewImages] = useState([]);
  const [layout, setLayout] = useState("flex-wrap");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [imageScale, setImageScale] = useState(40);
  const [news, setNews] = useState(
    storedNews ? JSON.parse(storedNews) : location.state?.news
  );
  const [title, setTitle] = useState(news.title);
  const [enTitle, setEnTitle] = useState(news.enTitle);
  const [content, setContent] = useState(news.content);
  const [enContent, setEnContent] = useState(news.enContent);
  const [originalData, setOriginalData] = useState({
    title: news.title,
    enTitle: news.enTitle,
    content: news.content,
    enContent: news.enContent,
    images: JSON.parse(news.image) || [],
  });
  const [existingImages, setExistingImages] = useState(
    Array.isArray(news.image) ? news.image : JSON.parse(news.image)
  );

  const [tempMediaArray, setTempMediaArray] = useState([
    ...existingImages, 
    ...newImages
  ]);
   // Temporary state
  let tempImageArray = [];

  const handleScaleChange = (e) => {
    setImageScale(e.target.value);
  };

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

  const handleEditClick = () => {
    const parsedExistingImages = Array.isArray(existingImages)
    ? existingImages
    : JSON.parse(existingImages || "[]");

    setOriginalData((prev) => ({
      title: news.title ?? prev.title,
      enTitle: news.enTitle ?? prev.enTitle,
      content: news.content ?? prev.content,
      enContent: news.enContent ?? prev.enContent,
      images: existingImages,
    }));
    setTempMediaArray([...parsedExistingImages, ...newImages]); // Reset temp order
    setIsEditing(true);
    setLayout("flex-wrap");
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("id", news.id);
    formData.append("title", title);
    formData.append("enTitle", enTitle);
    formData.append("content", content);
    formData.append("enContent", enContent);

    // console.log("where");
    if (Array.isArray(existingImages)) {
      console.log("case 1");
      console.log(typeof existingImages);

      tempImageArray = existingImages;
    } else if (typeof existingImages === "object" && existingImages !== null) {
      console.log("case 2");
      console.log(typeof existingImages);
      tempImageArray = Object.values(existingImages);
    } else {
      try {
        if (typeof existingImages === "string") {
          tempImageArray = Object.values(JSON.parse(existingImages));
          console.log("case 3");
          console.log(typeof existingImages);

          if (!Array.isArray(imageArray)) {
            console.error("Parsed result is not an array");
            tempImageArray = [];
          }
        } else {
          console.error(
            "existingImages is neither an array nor a valid string"
          );
          tempImageArray = [];
        }
      } catch (error) {
        console.error("Failed to parse existingImages:", error);
        tempImageArray = [];
      }
    }

    // setImageArray(tempImageArray);
    // console.log("imageArray")
    // imageArray.forEach((img, index) =>
    //   formData.append(`imageArray[${index}]`, img)
    // );
    // Append images correctly
    // tempMediaArray.forEach((img, index) => {
    //     formData.append(`imageArray[${index}]`, img)
    // });

    // newImages.forEach((img) => formData.append("newImages[]", img));

    // let processedImages = tempMediaArray;
    // if (typeof tempMediaArray === 'string') {
    //     try {
    //         processedImages = JSON.parse(tempMediaArray);
    //     } catch (e) {
    //         console.error("Error parsing tempMediaArray:", e);
    //     }
    // }

    // console.log("processedImages:", processedImages);

    
    tempMediaArray.flat().forEach((img, index) => {
      if (img instanceof File) {
        formData.append(`newImages[${index}]`, img); // Append new images
      } else {
        formData.append(`imageArray[${index}]`, img); // Append existing images
      }
    });

    // console.log("tempMediaArray before processing:", tempMediaArray);

    console.warn("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.warn(key, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/editNews",
        formData
      );

      // Update state with saved media order
      // setExistingImages(tempMediaArray.slice(0, existingImages.length));
      // setNewImages(tempMediaArray.slice(existingImages.length));

      let updatedImages = [];
      console.warn(JSON.parse(response.data.data.image));
      try {
        updatedImages = JSON.parse(response.data.data.image);
      } catch (error) {
        console.error("Error parsing response images:", error);
      }

      // Merge the old and new images correctly
      setExistingImages((prevImages) => {
        return [...prevImages, ...updatedImages];
      });

      // setTempMediaArray((prev) => [...prev, ...updatedImages]);

      setIsEditing(false);
      setNews((prevNews) => {
        let newImages = [];

        try {
          if (response.data.data.image) {
            newImages = response.data.data.image;

            setExistingImages(response.data.data.image);
            setTempMediaArray(response.data.data.image);
            // console.warn("yyyyyyyyy");
            // console.warn(tempMediaArray);
            console.warn(response.data.data.image);
          }
        } catch (error) {
          console.error("Error processing imagePaths:", error);
          newImages = [];
        }

        let existingImagesArray;
        try {
          existingImagesArray = Object.values(
            JSON.parse(response.data.data.image)
          );
        } catch {
          console.log("error existingImagesArray");
        }

        existingImagesArray = [...existingImagesArray];

        return {
          ...prevNews,
          title: title,
          enTitle: enTitle,
          content: content,
          enContent: enContent,
          image: JSON.stringify(response.data.data.image),
        };
      });

      setNewImages([]);
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news");
    }
  };

  const handleCancelClick = () => {
    setTitle(originalData.title);
    setEnTitle(originalData.enTitle);
    setContent(originalData.content);
    setEnContent(originalData.enContent);
    setExistingImages(originalData.images);
    setTempMediaArray(originalData.images); // Reset temp state
    setNewImages([]);
    setIsEditing(false);
  };

  const handleMediaChange = (updatedArray) => {
    console.warn('Updated Array:', updatedArray);
    
    setTempMediaArray(updatedArray);

    // Separate existing images and new images correctly
    const updatedExistingImages = updatedArray.filter(img => 
        typeof img === "string" && existingImages.includes(img)
    );

    const updatedNewImages = updatedArray.filter(img => 
        img instanceof File || !existingImages.includes(img)
    );

    setExistingImages(updatedExistingImages); // Update existing images
    setNewImages(updatedNewImages); // Update new images

    console.warn('Updated Existing Images:', updatedExistingImages);
    console.warn('Updated New Images:', updatedNewImages);
};


  const handleRemoveImage = (index, isNewImage = false) => {
    setCurrentIndex(0);

    // console.log('index: ' + index + ' isNewImage: ' + isNewImage)
    // setTempMediaArray((prev) => {
    //   console.log('here')
    //   return prev.filter((_, i) => i !== index);
    // });

    const existingCount = existingImages.length;

    if (isNewImage) {
      // console.log(index);
      // console.log(newImages);
      setNewImages((prev) => [
        ...prev.slice(0, index - existingCount),
        ...prev.slice(index - existingCount + 1),
      ]);

      setTempMediaArray((prev) => {
        const adjustedIndex = index - existingCount + 1;
        if (adjustedIndex <= 0) return prev; // Ensure we don't remove an existing image

        console.log("Removing image at: ", index, "Adjusted index: ", adjustedIndex);

        return [
          ...prev.slice(0, adjustedIndex),
          ...prev.slice(adjustedIndex + 1),
        ];
      });
    } else {
      setExistingImages((prev) => {
        let tempImageArray = prev;

        while (!Array.isArray(tempImageArray)) {
          if (typeof tempImageArray === "string") {
            try {
              tempImageArray = JSON.parse(tempImageArray);
            } catch (error) {
              console.error("Failed to parse existingImages:", error);
              return prev; // Return previous state if parsing fails
            }
          } else if (
            typeof tempImageArray === "object" &&
            tempImageArray !== null
          ) {
            tempImageArray = Object.values(tempImageArray);
          } else {
            console.error(
              "existingImages is neither a valid string nor object:",
              tempImageArray
            );
            return prev;
          }
        }

        return tempImageArray.filter((_, i) => i !== index);
      });

      setTempMediaArray((prev) => {
        return prev.filter((_, i) => i !== index);
      });
      
      
    }
  };

  useEffect(() => {
    console.log("newImages");
    console.warn(newImages);
  }, [newImages]);

  useEffect(() => {
    console.log('tempMediaArray');
    console.warn(tempMediaArray);
  }, [tempMediaArray]);

  const handleImageUpload = (event) => {
    if (!event.target.files) return;

    let selectedFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      selectedFiles.push(event.target.files[i]);
    }

    setNewImages((prev) => [...prev, ...selectedFiles]);
    setTempMediaArray((prev) => [prev, ...selectedFiles]);
  };

  useEffect(() => {
    if (news) {
      sessionStorage.setItem("news", JSON.stringify(news));
    }
  }, [news]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("news");
    };
  }, []);

  // let imageType;

  // if (Array.isArray(existingImages)) {
  //   console.log("case 1");
  //   console.log(typeof existingImages);

  //   tempImageArray = existingImages;
  // } else if (typeof existingImages === "object" && existingImages !== null) {
  //   console.log("case 2");
  //   console.log(existingImages);
  //   tempImageArray = Object.values(existingImages);
  //   console.log("tempImageArray");
  //   console.log(tempImageArray);
  // } else {
  //   try {
  //     console.log("case 3");
  //     console.log(typeof existingImages);

  //     if (typeof existingImages === "string") {
  //       tempImageArray = Object.values(JSON.parse(existingImages));

  //       if (!Array.isArray(imageArray)) {
  //         console.error("Parsed result is not an array");
  //         tempImageArray = [];
  //       }
  //     } else {
  //       console.error("existingImages is neither an array nor a valid string");
  //       tempImageArray = [];
  //     }
  //   } catch (error) {
  //     console.error("Failed to parse existingImages: ", error);
  //     tempImageArray = [];
  //   }
  // }

  // setImageArray(tempImageArray);

  // useEffect(() => {
  //   console.log("imageArray");
  //   console.log(imageArray);
  // }, [imageArray]);

  const getFileExtension = (path) => {
    if (path instanceof File) {
      return path.name.split(".").pop().toLowerCase();
    } else if (typeof path === "string") {
      return path.split(".").pop().toLowerCase();
    }
    return null;
  };

  const processedImages = useMemo(() => {
    let result = existingImages;

    while (!Array.isArray(result)) {
      if (typeof result === "string") {
        try {
          result = JSON.parse(result);
        } catch (error) {
          console.error("Failed to parse existingImages:", error);
          return []; // Return an empty array if parsing fails
        }
      } else if (typeof result === "object" && result !== null) {
        result = Object.values(result);
      } else {
        console.error(
          "existingImages is neither a valid string nor object:",
          result
        );
        return [];
      }
    }

    return result;
  }, [existingImages]);

  let fileExtension;
  let isValidImage;

  useEffect(() => {
    if (JSON.stringify(processedImages) !== JSON.stringify(imageArray)) {
      setImageArray(processedImages); // Only update state if it's actually different
    }
  }, [processedImages]);

  // useEffect(() => {
  //   setTempMedia()
  // }, [newImages])

  useEffect(() => {
    console.log('existingImages');
    console.warn(existingImages);
  }, [existingImages])

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

  return (
    <div className="tenderDetailsContainer width-100 flex column center">
      <div className="newsDetailsSection flex column">
        <div className="tenderDetails flex">
          {language === "ar"
            ? tenderDetailsContent
            : tenderDetailsContent.reverse()}
        </div>

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

        <div className="flex space-between">
          <div className="shareBtn">
            <ShareButton news={news} />
          </div>

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
        </div>

        <div className="flex center c-gap-20">
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

        {layout === "flex-wrap" && (
          <div className="flex align-items-start justify-content wrap c-gap-30">
            {isEditing ? (
              <>
                {/* Media Gallery for Existing Images */}
                {(imageArray.length > 0 || newImages.length > 0) && (
                  <MediaGallery
                    mediaArray={[...imageArray, ...newImages]} // ✅ Correctly merging
                    setMediaArray={setTempMediaArray}
                    handleMediaChange={handleMediaChange}
                    renderItem={(imagePathOrFile, index) => {
                      const isNewImage = imagePathOrFile instanceof File; // ✅ Check if it's a new image

                      return (
                        <div
                          className={`newsDetailsImgEditCont flex wrap width-${imageScale} center`}
                        >
                          <div className="flex justify-content">
                            {isNewImage ? (
                              imageExtensions.includes(
                                imagePathOrFile.name
                                  .split(".")
                                  .pop()
                                  .toLowerCase()
                              ) ? (
                                <Image
                                  src={URL.createObjectURL(imagePathOrFile)}
                                  alt={`New Image ${index + 1}`}
                                  title={`New Image ${index + 1}`}
                                  className={`newsDetailsImgEdit width-70 pointer aspectRation5-4 flex`}
                                  fullImage="true"
                                  imageArray={imageArray}
                                  currentIndex={index}
                                />
                              ) : (
                                <Video
                                  video={imagePathOrFile}
                                  newVideo={true}
                                  className="width-80 maxHeightVideo"
                                />
                              )
                            ) : imageExtensions.includes(
                                imagePathOrFile.split(".").pop().toLowerCase()
                              ) ? (
                              <Image
                                src={`http://localhost:8000/${imagePathOrFile}`}
                                alt={`News Image ${index + 1}`}
                                title={`Image ${index + 1}`}
                                className={`newsDetailsImgEdit width-70 pointer flex aspectRation5-4`}
                                fullImage="true"
                                imageArray={imageArray}
                                currentIndex={index}
                              />
                            ) : (
                              <Video
                                video={imagePathOrFile}
                                className="width-80 maxHeightVideo"
                              />
                            )}

                            <button
                              className="remove-btn pointer"
                              onClick={() =>
                                handleRemoveImage(index, isNewImage)
                              }
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    }}
                  />
                )}
                {/* </> */}

                {/* {imageArray && imageArray.length > 0 && imageArray.map((imagePath, index) => (
                  <div
                    className={`newsDetailsImgCont flex wrap width-${imageScale} center`}
                    key={`new-${index}`}
                  >
                    {imageExtensions.includes(
                      imagePath.split(".").pop().toLowerCase()
                    ) ? (
                      <Image
                        src={`http://localhost:8000/${imagePath}`}
                        alt={`News Image ${index + 1}`}
                        title={`Image ${index + 1}`}
                        className={`newsDetailsImg pointer flex aspectRation5-4`}
                        fullImage="true"
                        imageArray={imageArray}
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

                {newImages.map((imageFile, index) => (
                  <div
                    className={`newsDetailsImgCont flex wrap width-${imageScale}`}
                    key={`new-${index}`}
                  >
                    {console.log(imageFile.name)}
                    {imageExtensions.includes(
                      imageFile.name.split(".").pop().toLowerCase()
                    ) ? (
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt={`New Image ${index + 1}`}
                        title={`New Image ${index + 1}`}
                        className={`newsDetailsImg pointer aspectRation5-4 flex`}
                        fullImage="true"
                        imageArray={imageArray}
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
                ))} */}
              </>
            ) : (
              <>
                {/* Media Gallery for Drag & Drop Sorting */}

                {/* <MediaGallery mediaArray={media} setMediaArray={setMedia} /> */}
                {/* Displaying Images & Videos */}
                {/* {console.log(imageArray)} */}
                {imageArray.map((imagePath, index) => (
                  <div
                    className={`newsDetailsImgCont flex justify-content width-${imageScale}`}
                    key={`new-${index}`}
                  >
                    {
                      (isValidImage =
                        getFileExtension(imagePath) &&
                        imageExtensions.includes(getFileExtension(imagePath)))
                    }

                    {isValidImage ? (
                      <Image
                        src={`http://localhost:8000/${imagePath}`}
                        alt={`News Image ${index + 1}`}
                        title={`Image ${index + 1}`}
                        className={`newsDetailsImg pointer aspectRation5-4 flex`}
                        fullImage="true"
                        imageArray={imageArray}
                        currentIndex={index}
                        display="true"
                      />
                    ) : (
                      <Video video={imagePath} className="width-100" />
                    )}
                  </div>
                ))}
              </>
              // imageArray.map((imagePath, index) => (  the right codeeeeee
              //   <div
              //     className={`newsDetailsImgCont flex justify-content width-${imageScale}`}
              //     key={`new-${index}`}
              //   >
              //     {imageExtensions.includes(
              //       imagePath.split(".").pop().toLowerCase()
              //     ) ? (
              //       <Image
              //         src={`http://localhost:8000/${imagePath}`}
              //         alt={`News Image ${index + 1}`}
              //         title={`Image ${index + 1}`}
              //         className={`newsDetailsImg pointer aspectRation5-4 flex border`}
              //         fullImage="true"
              //         imageArray={imageArray}
              //         currentIndex={index}
              //         display="true"
              //       />
              //     ) : (
              //       <Video video={imagePath} />
              //     )}
              //   </div>
              // )) the right codeeeeee
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
                  imageArray={imageArray}
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
          <div className="flex center column">
            {imageArray.map((imagePath, index) => (
              <div className={`column-images flex`} key={`new-${index}`}>
                {imageExtensions.includes(
                  imagePath.split(".").pop().toLowerCase()
                ) ? (
                  <Image
                    src={`http://localhost:8000/${imagePath}`}
                    alt={`News Image ${index + 1}`}
                    title={`Image ${index + 1}`}
                    className={`newsDetailsImg pointer flex`}
                    fullImage="true"
                    imageArray={imageArray}
                    currentIndex={index}
                  />
                ) : (
                  <div className="videoCont">
                    <Video video={imagePath} className="videoCont" />
                  </div>
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

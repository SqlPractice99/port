import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../base/image";
import axios from "axios";
import ShareButton from "../../base/ShareButton";
import Video from "../../base/video";
import MediaGallery from "../../base/mediaGallery";

const NewsDetailsBody = () => {
  const imageExtensions = ["jpeg", "jpg", "png"];
  const location = useLocation();
  const navigate = useNavigate();
  const storedNews = sessionStorage.getItem("news");
  const token = JSON.parse(localStorage.getItem("userToken"));
  const language = useSelector((state) => state.language.language);
  const en = language === "en";
  const [newImages, setNewImages] = useState([]);
  const [layout, setLayout] = useState("flex-wrap");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageScale, setImageScale] = useState(40);
  const [height, setHeight] = useState(40);
  const [news, setNews] = useState(
    storedNews ? JSON.parse(storedNews) : location.state?.news
  );
  const [previewCoverImg, setPreviewCoverImg] = useState(null);
  const [coverImgFile, setCoverImgFile] = useState(null);
  const [title, setTitle] = useState(news.title);
  const [enTitle, setEnTitle] = useState(news.enTitle);
  const [content, setContent] = useState(news.content);
  const [enContent, setEnContent] = useState(news.enContent);
  const [originalData, setOriginalData] = useState({
    coverImg: news.coverImg,
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
    existingImages,
    newImages,
  ]);

  let tempImageArray = [];

  const handleScaleChange = (e) => {
    setImageScale(e.target.value);
    setHeight(e.target.value);
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

  const handleDeleteClick = async () => {
    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("id", news.id);

      const response = await axios.post(
        "http://localhost:8000/api/removeNews",
        formData
      );

      if (response.data.message === "News Deleted") {
        navigate("/news");
      }
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news");
    }
  };

  const handleEditClick = () => {
    console.log("previewCoverImg", previewCoverImg);
    const parsedExistingImages = Array.isArray(existingImages)
      ? existingImages
      : JSON.parse(existingImages || "[]");

    setOriginalData((prev) => ({
      coverImg: news.coverImg ?? prev.coverImg,
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
    formData.append("coverImg", coverImgFile);

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

    tempMediaArray.flat().forEach((img, index) => {
      if (img instanceof File) {
        formData.append(`newImages[${index}]`, img);
        formData.append(`imageArray[${index}]`, "new");
      } else {
        formData.append(`imageArray[${index}]`, img);
      }
    });

    console.warn("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.warn(key, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/editNews",
        formData
      );

      let updatedImages = [];
      console.warn(JSON.parse(response.data.data.image));
      try {
        updatedImages = JSON.parse(response.data.data.image);
      } catch (error) {
        console.error("Error parsing response images:", error);
      }

      setExistingImages((prevImages) => {
        return [...prevImages, ...updatedImages];
      });

      setIsEditing(false);
      setNews((prevNews) => {
        let newImages = [];

        try {
          if (response.data.data.image) {
            newImages = response.data.data.image;

            setExistingImages(response.data.data.image);
            setTempMediaArray(response.data.data.image);
            console.warn(response.data.data.image);
          }
        } catch (error) {
          console.error("Error processing imagePaths:", error);
          setNewImages([]);
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
          coverImg: response.data.data.coverImg,
        };
      });

      setNewImages([]);
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news");
    }
  };

  const handleCancelClick = () => {
    console.warn(originalData);
    setTitle(originalData.title);
    setEnTitle(originalData.enTitle);
    setContent(originalData.content);
    setEnContent(originalData.enContent);
    setPreviewCoverImg(`http://localhost:8000/${originalData.coverImg}`);
    setExistingImages(originalData.images);
    setTempMediaArray(originalData.images);
    setNewImages([]);
    setIsEditing(false);
  };

  const handleMediaChange = (updatedArray) => {
    console.warn("Updated Array:", updatedArray);

    setTempMediaArray(updatedArray);

    const updatedExistingImages = updatedArray.filter(
      (img) => typeof img === "string" && existingImages.includes(img)
    );

    const updatedNewImages = updatedArray.filter(
      (img) => img instanceof File || !existingImages.includes(img)
    );

    setExistingImages(updatedExistingImages);
    setNewImages(updatedNewImages);

    console.warn("Updated Existing Images:", updatedExistingImages);
    console.warn("Updated New Images:", updatedNewImages);
  };

  const handleRemoveImage = (index, isNewImage = false) => {
    setCurrentIndex(0);

    const existingCount = existingImages.length;

    if (isNewImage) {
      setNewImages((prev) => [
        ...prev.slice(0, index - existingCount),
        ...prev.slice(index - existingCount + 1),
      ]);

      setTempMediaArray((prev) => {
        const adjustedIndex = index - existingCount + 1;
        if (adjustedIndex <= 0) return prev;

        console.log(
          "Removing image at: ",
          index,
          "Adjusted index: ",
          adjustedIndex
        );

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
              return prev;
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
    console.log("tempMediaArray");
    console.warn(tempMediaArray);

  }, [tempMediaArray]);

  const handleImageUpload = (event) => {
    if (!event.target.files) return;

    let selectedFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      selectedFiles.push(event.target.files[i]);
    }

    setNewImages((prev) => [...prev, ...selectedFiles]);
    setTempMediaArray((prev) => [prev, ...selectedFiles].flat());
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
          return [];
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

  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImgFile(file);
      setPreviewCoverImg(URL.createObjectURL(file));
    }
  };

  let fileExtension;
  let isValidImage;

  useEffect(() => {
    if (JSON.stringify(processedImages) !== JSON.stringify(imageArray)) {
      setImageArray(processedImages);
    }
  }, [processedImages]);

  useEffect(() => {
    console.log("existingImages");
    console.warn(existingImages);
  }, [existingImages]);

  useEffect(() => {
    if (previewCoverImg === null) {
      setPreviewCoverImg(`http://localhost:8000/${news.coverImg}`);
    }

    console.log("newwws", news.coverImg);
    console.log("newww previewCoverImg", previewCoverImg);
  }, [previewCoverImg]);

  return (
    <div className="tenderDetailsContainer width-100 flex column center">
      <div className="newsDetailsSection flex column">
        <div
          className={`tenderDetails flex
         ${en ? "" : "reverse"}`}
        >
          <div className="tenderDetailsRight flex column width-50">
            {isEditing ? (
              <div className="coverImgSection flex center">
                {previewCoverImg && (
                  <img
                    src={previewCoverImg}
                    alt="Preview"
                    className="tenderDetailsCoverImg flex center"
                  />
                )}

                <div className="overlayLayer"></div>

                <div className="coverImgInput flex center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImgChange}
                    className="upload-input pointer"
                  />
                </div>
              </div>
            ) : (
              <Image
                src={`http://localhost:8000/${news.coverImg}`}
                alt="Tenders of Port of Beirut"
                title="PORT OF BEIRUT"
                className="tenderDetailsCoverImg flex center"
              />
            )}
          </div>

          <div
            className={`tenderDetailsLeft flex column align-items width-50
             ${en ? "marginLeft-0" : ""}`}
          >
            <div className="tenderDetailsLeftContent">
              <div
                className={`tenderDetailsDateContainer flex column ${
                  en ? "align-items-start" : "align-items-end"
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
                  className={`newsEditInput ${language === "en" ? "en" : "ar"}`}
                />
              ) : (
                <div
                  className={`newsDetailsTitle ${
                    language === "en" ? "en" : "ar"
                  }`}
                >
                  {language === "en" ? news.enTitle : news.title}
                </div>
              )}
            </div>
          </div>
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

        <div className={`flex space-between ${en ? '' : 'reverse'}`}>
          <div className="shareBtn">
            <ShareButton news={news} />
          </div>

          <div className="editButtons">
            {isEditing ? (
              <>
                <button className="saveBtn" onClick={handleSaveClick}>
                  {en ? 'Save' : 'حفظ'}
                </button>
                <button className="cancelBtn" onClick={handleCancelClick}>
                {en ? 'Cancel' : 'إلغاء'}
                </button>
              </>
            ) : (
              token && (
                <>
                  <button className="editBtn" onClick={handleEditClick}>
                    {en ? 'Edit' : 'تعديل'}
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    {en ? 'Delete' : 'مسح'}
                  </button>

                  {showDeleteModal && (
                    <div className="modal-overlay">
                      <div className="modal-box">
                        <h3>{en ? 'Are you sure you want to delete this news?' : 'هل أنت متأكد أنك تريد حذف هذا الخبر؟'}</h3>
                        <div className={`modal-buttons ${en ? '' : 'reverse'}`}>
                          <button
                            onClick={handleDeleteClick}
                            className="confirm-delete pointer"
                          >
                            {en ? 'Yes, Delete' : 'نعم، إمسح'}
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(false)}
                            className="cancel-delete pointer"
                          >
                            {en ? 'Cancel' : 'إلغاء'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
                {(imageArray.length > 0 || newImages.length > 0) && (
                  <MediaGallery
                    mediaArray={tempMediaArray}
                    setMediaArray={setTempMediaArray}
                    handleMediaChange={handleMediaChange}
                    renderItem={(imagePathOrFile, index) => {
                      const isNewImage = imagePathOrFile instanceof File;

                      return (
                        <div
                          className={`newsDetailsImgEditCont flex wrap width-${imageScale} center`}
                        >
                          <div className="flex justify-content">
                            {isNewImage ? (
                              imagePathOrFile instanceof File &&
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
                                  className={`newsDetailsImgEdit width-70 aspectRation5-4 flex`}
                                  imageArray={imageArray}
                                  currentIndex={index}
                                />
                              ) : (
                                <Video
                                  video={imagePathOrFile}
                                  newVideo={true}
                                  className="width-80 maxHeightVideo videoDrag"
                                />
                              )
                            ) : 
                            typeof imagePathOrFile === "string" &&
                              imageExtensions.includes(
                                imagePathOrFile.split(".").pop().toLowerCase()
                              ) ? (
                              <Image
                                src={`http://localhost:8000/${imagePathOrFile}`}
                                alt={`News Image ${index + 1}`}
                                title={`Image ${index + 1}`}
                                className={`newsDetailsImgEdit width-70 flex aspectRation5-4`}
                                imageArray={imageArray}
                                currentIndex={index}
                              />
                            ) : (
                              <Video
                                video={imagePathOrFile}
                                className="width-80 maxHeightVideo videoDrag"
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
              </>
            ) : (
              <>
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
                      <Video
                        video={imagePath}
                        className={`width-100 height-${height} videoPlay pointer`}
                      />
                    )}
                  </div>
                ))}
              </>
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

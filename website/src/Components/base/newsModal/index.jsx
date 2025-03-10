import React, { useEffect, useState } from "react";
import Button from "../button";
import axios from "axios";
import "./styles.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const NewsModal = ({ isOpen, onClose, books, setBooks }) => {
  const token = JSON.parse(localStorage.getItem("userToken"));
  const user_id = localStorage.getItem("id");
  const [data, setData] = useState({
    title: "",
    enTitle: "",
    content: "",
    enContent: "",
    language: "",
    tender_paper: "",
    image: "",
  });

  // const [arabicText, setArabicText] = useState("");
  // const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Function to translate Arabic to English
  const handleTranslate = async (text, value, fromLang = "ar", toLang = "en") => {
    if (!text.trim()) return;

    setIsTranslating(true);

    console.log(text)

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;

      const response = await fetch(url);

      const translatedText = await response.json();
      console.log(translatedText[0])
      if (translatedText && translatedText[0]) {
        // setTranslatedText(data.responseData.translatedText);
        const fullTranslatedText = translatedText[0].map((part) => part[0]).join(" ");
        setData({
          ...data,
          [value]: fullTranslatedText,
        });
        console.log(fullTranslatedText)
      } else {
        alert("Translation failed");
      }
    } catch (error) {
      console.error("Translation Error:", error);
    }

    setIsTranslating(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" || name === "coverImg") {
      setData({
        ...data,
        [name]: files[0],
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleImageInputChange = (event) => {
    const files = Array.from(event.target.files);  // Convert FileList to array
    setData({
      ...data,
      images: files,  // Store the selected images in state
    });
    console.log("Selected Images:", files);
  };


  const handlePost = async () => {
    // preventDefault();

    // if (!data.image) {
    //   console.log("No image file selected");
    //   return;
    // }

    if (data.image) {
      console.log("images/" + data.image.name);
    }


    const formData = new FormData();


    if (data.images && data.images.length > 0) {
      // Loop through each selected image
      data.images.forEach((image) => {
        formData.append("images[]", image);  // Append each image to FormData
        formData.append("imageNames[]", image.name);  // You can store the image names too, if needed
      });
    }


    formData.append("title", data.title);
    formData.append("enTitle", data.enTitle);
    // if (data.sub_title) {
    //   formData.append("sub_title", data.sub_title);
    // }
    // if (data.image) {
    //   formData.append("image", data.image);
    //   formData.append("imageName", data.image.name);
    // }
    console.log("t: " + token);
    formData.append("token", token);
    if (data.tender_paper) {
      formData.append("tender_paper", data.tender_paper);
    }
    formData.append("coverImg", data.coverImg);
    formData.append("content", data.content);
    formData.append("enContent", data.enContent);
    formData.append("language", 'ar');

    try {
      console.log([...formData.entries()]);

      const response = await axios.post(
        "http://localhost:8000/api/addNews",
        formData
      );

      console.log(response.data);

      if (response.data.status === "Success") {
        const responseData = response.data.data;
        delete responseData.token;
        // if (data.image) {
        //   responseData.imageName = data.image.name;
        // }

        if (data.images && data.images.length > 0) {
          responseData.imageNames = data.images.map((img) => img.name);
        }

        console.log("Form Data after sending:", responseData);
        console.log("data:");
        console.log(response.data);
        // const updatedBooks = [responseData, ...books];
        // localStorage.setItem("books", JSON.stringify(updatedBooks));
        // setBooks(updatedBooks);
        onClose();
      } else {
        console.log("Didn't Add");
      }
    } catch (error) {
      console.log(error);
    }
    setData({
      title: "",
      enTitle: "",
      content: "",
      enContent: "",
      language: "",
      tender_paper: null,
      image: null,
    });
  };

  // const handleClickOutside = (e) => {
  //   if (!e.target.closest("opened")) {
  //     onClose();
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  return (
    <div className={`${isOpen ? "opened" : "closed"}`}>
      <div className="post-form-container">
        <div className="form-title flex center">
          <div className="title-text width-100">
            <h2>Add News</h2>
          </div>

          <div className="close-btn flex end">
            <Button
              text={"Close"}
              className="button close-button"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="recipe-form flex column">
          <div className="form-row">
            <div className="input-group width-100">
              <label className="bold">Arabic Title</label>
              <textarea
                name="title"
                value={data.title}
                className={"tenderTitleInput ar"}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group width-100">
              <label className="bold">English Title</label>
              <textarea
                name="enTitle"
                value={data.enTitle}
                className={"tenderTitleInput"}
                onChange={handleInputChange}
                required
              />
            </div>
            <button onClick={() => handleTranslate(data.title, "enTitle")} disabled={isTranslating}>
              {isTranslating ? "Translating..." : "Translate"}
            </button>
          </div>

          <div className="form-row">
            <div className="input-group width-100">
              <label className="bold">Arabic Content</label>
              <textarea
                type="text"
                name="content"
                className={"tenderContentInput ar"}
                value={data.content}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group width-100">
              <label className="bold">English Content</label>
              <textarea
                type="text"
                name="enContent"
                className={"tenderContentInput"}
                value={data.enContent}
                onChange={handleInputChange}
                required
              />
            </div>
            <button onClick={() => handleTranslate(data.content, "enContent")} disabled={isTranslating}>
              {isTranslating ? "Translating..." : "Translate"}
            </button>
          </div><div className="form-row">
            {/* <div className="input-group width-50">
              <label className="bold">Language</label>
              <select
                name="language"
                value={data.language}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Language</option>{" "}
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div> */}
          </div>

          {/* <div className="form-row">
            <div className="input-group width-50">
              <label className="bold">Download Material</label>
              <input
                type="file"
                name="tender_paper"
                className={"media-input width-50"}
                accept="application/*"
                onChange={handleInputChange}
              />
            </div>
          </div> */}

          <div className="form-row">
            <div className="input-group width-50">
              <label className="bold">News Cover Image</label>
              <input
                type="file"
                name="coverImg"
                className={"media-input width-50"}
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group width-50">
              <label className="bold">Image</label>
              <input
                type="file"
                name="image"
                className={"media-input width-50"}
                accept="image/*"
                multiple
                onChange={handleImageInputChange}
              />
            </div>
          </div>

          <div className="submit flex center">
            <Button
              text={"Post"}
              className={"button post-submit-btn pointer"}
              onClick={handlePost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;

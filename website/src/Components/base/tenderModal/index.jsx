import React, { useEffect, useState } from "react";
import Button from "../button";
import axios from "axios";
import "./styles.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const TenderModal = ({ isOpen, onClose, books, setBooks }) => {
  const token = JSON.parse(localStorage.getItem("userToken"));
  const user_id = localStorage.getItem("id");
  const [data, setData] = useState({
    title: "",
    sub_title: "",
    language: "",
    tender_paper: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" || name === "tender_paper") {
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
    formData.append("title", data.title);
    if (data.sub_title) {
      formData.append("sub_title", data.sub_title);
    }
    if (data.image) {
      formData.append("image", data.image);
      formData.append("imageName", data.image.name);
    }
    console.log("t: " + token);
    formData.append("token", token);
    if (data.tender_paper) {
      formData.append("tender_paper", data.tender_paper);
    }
    formData.append("language", data.language);

    try {
      console.log([...formData.entries()]);

      const response = await axios.post(
        "http://localhost:8000/api/addTender",
        formData
      );

      console.log(response.data);

      if (response.data.status === "Success") {
        const responseData = response.data.data;
        delete responseData.token;
        if (data.image) {
          responseData.imageName = data.image.name;
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
      sub_title: "",
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
            <h2>Add a New Tender</h2>
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
              <label className="bold">Title</label>
              <textarea
                name="title"
                value={data.title}
                className={"tenderTitleInput"}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group width-50">
              <label className="bold">Sub-Title</label>
              <input
                type="text"
                name="sub_title"
                value={data.sub_title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group width-50">
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
            </div>
          </div>

          <div className="form-row">
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

            <div className="input-group width-50">
              <label className="bold">Image</label>
              <input
                type="file"
                name="image"
                className={"media-input width-50"}
                accept="image/*"
                onChange={handleInputChange}
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

export default TenderModal;

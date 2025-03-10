import React, { useEffect, useState } from "react";
import Button from "../button";
import axios from "axios";
import "./styles.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const PostModal = ({ isOpen, onClose, books, setBooks }) => {
  const token = JSON.parse(localStorage.getItem("userToken"));
  const user_id = localStorage.getItem("id");
  const [data, setData] = useState({
    page: "",
    title: "",
    sub_title: "",
    content: "",
    language: "",
    dwnld_material: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" || name === "dwnld_material") {
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
    formData.append("page", data.page.toLowerCase());
    formData.append("title", data.title);
    if (data.sub_title) {
      formData.append("sub_title", data.sub_title);
    }
    formData.append("content", data.content);
    if (data.image) {
      formData.append("image", data.image);
      formData.append("imageName", data.image.name);
    }
    console.log("t: " + token);
    formData.append("token", token);
    if (data.dwnld_material) {
      formData.append("dwnld_material", data.dwnld_material);
    }
    formData.append("language", data.language);

    try {
      console.log([...formData.entries()]);

      const response = await axios.post(
        "http://localhost:8000/api/addData",
        formData
      );

      console.log(response.data);

      if (response.data.message === "Posted") {
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
      page: "",
      title: "",
      sub_title: "",
      content: "",
      language: "",
      dwnld_material: null,
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
            <h2>Add New Data</h2>
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
            <div className="input-group width-50">
              <label className="bold">Page</label>
              <input
                type="text"
                name="page"
                // className="book-input"
                value={data.page}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group width-50">
              <label className="bold">Title</label>
              <input
                type="text"
                name="title"
                value={data.title}
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
              />
            </div>

            <div className="input-group width-50">
              <label className="bold">Language</label>
              <input
                type="text"
                name="language"
                value={data.language}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group width-100">
              <label className="bold">Content</label>
              <textarea
                type="text"
                name="content"
                value={data.content}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group width-50">
              <label className="bold">Download Material</label>
              <input
                type="file"
                name="dwnld_material"
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

export default PostModal;

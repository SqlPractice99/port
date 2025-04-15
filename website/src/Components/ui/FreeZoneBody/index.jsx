import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../../Components/base/image";
import freeZoneImg from "../../../assets/images/about.png";
import ReactDOMServer from "react-dom/server";
import AutoResizeTextarea from "../../base/autoResizeTextArea";
import axios from "axios";
import DOMPurify from "dompurify";
import FreeZoneSection from "../../base/freeZoneSection";

const FreeZoneBody = (data) => {
  const token = JSON.parse(localStorage.getItem("userToken"));
  const [activeContent, setActiveContent] = useState("1");
  const [isEditing, setIsEditing] = useState(false);
  const language = useSelector((state) => state.language.language);
  const en = language === "en";

  const filteredData = data.data
    .filter((item) => item.title === "Rules and Regulations")
    .map((item) => ({
      id: item.id,
      sub_title: item.sub_title,
      arSub_title: item.arSub_title,
      content: item.content,
      arContent: item.arContent,
    }));

  const [originalData, setOriginalData] = useState(filteredData);
  const [editedData, setEditedData] = useState([...originalData]);

  const [li, setLi] = useState(false);
  const [br, setBr] = useState([]);

  // const [editedTitle, setEditedTitle] = useState(filteredSubTitles);
  // const [editedContent, setEditedContent] = useState(filteredContents);

  // const [originalContent, setOriginalContent] = useState(data.data.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    // setEditedTitle(data.data.sub_title);
    // setEditedContent(data.data.content);
    setEditedData([...originalData]);
    setIsEditing(false);
  };

  // const handleSaveClick = async () => {
  //     try {
  //         const response = await axios.post("http://localhost:8000/editData", {
  //             id: editedData[].id,
  //             title: editedData[].title,
  //             content: editedData[].content,
  //         });

  //         if (response.status === 200) {
  //             console.log("Updated successfully!");
  //             // setOriginalContent(editedContent);
  //             setIsEditing(false);
  //         }
  //     } catch (error) {
  //         console.error("Error updating news:", error);
  //     }
  // };

  const handleSaveClick = () => {
    const changes = editedData.reduce((acc, item, index) => {
      let updatedFields = {};

      if (item.sub_title !== originalData[index].sub_title) {
        updatedFields.sub_title = item.sub_title;
        console.log("updatedFields.sub_title: " + updatedFields.sub_title);
      }
      if (item.content !== originalData[index].content) {
        updatedFields.content = item.content;
        console.log("updatedFields.content: " + updatedFields.content);
      }

      if (Object.keys(updatedFields).length > 0) {
        acc.push({ id: item.id, ...updatedFields });
        console.log("acc");
        console.log(acc);
      }

      return acc;
    }, []);

    if (changes.length > 0) {
      console.log("changes");
      console.log(changes);
      sendDataToAPI(changes);
    }

    setIsEditing(false);
  };

  const sendDataToAPI = async (updatedItems) => {
    try {
      if (updatedItems.length === 0) {
        console.error("No data to send");
        return;
      }

      // const formData = new FormData();

      // formData.append("token", token);

      // Append updated fields dynamically
      // updatedItems.forEach((item, index) => {
      //     formData.append(`items[${index}][id]`, item.id);
      //     if (item.sub_title) formData.append(`items[${index}][sub_title]`, item.sub_title);
      //     if (item.content) formData.append(`items[${index}][content]`, item.content);
      // });

      // console.log("whaaaaattttt")
      // console.log(formData)
      const response = await axios.post("http://localhost:8000/api/editData", {
        items: updatedItems,
        token: token,
      });

      console.log("Response:", response.data);

      if (response.status === 200) {
        console.log("Data updated successfully!");
        setOriginalData([...editedData]); // Update the original data
      } else {
        console.error("Error updating data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTabClick = (contentId) => {
    setActiveContent(contentId);
  };

  const handleTitleClick = (id) => {
    const elements = document.querySelectorAll(`[id='${id}']`); // Get all matching elements

    if (elements.length > 1) {
    //   console.warn("Content ID ", id);
      elements[1].scrollIntoView({ behavior: "smooth" }); // Scroll to the second match
    } else if (elements.length === 1) {
    //   console.warn("Content ID ", id);
      elements[0].scrollIntoView({ behavior: "smooth" }); // Scroll to the first match if no second exists
    // } else {
    //   console.warn("Content ID not found:", id);
    }
  };

  // const handleDataChange = (id, value) => {
  //     setEditedData((prev) => ({ ...prev, [id]: value }));
  // };

  const handleInputChange = (id, field, value) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  useEffect(() => {
    // console.log(editedContent);
    // console.log(data.data)
  }, []);

  return (
    <>
      <div className={`aboutContainer width-100 flex ${en ? "" : "reverse"}`}>
        <div className="aboutContainerLeft width-50 flex center">
          <div className={`aboutContainerText flex ${en ? "" : "almarai"}`}>
            {en ? "Free Zone" : "المنطقة الحرة"}
          </div>
        </div>

        <div className="aboutContainerRight width-50">
          <Image
            src={freeZoneImg}
            alt="History of Port of Beirut"
            title="PORT OF BEIRUT"
            className="aboutPageImg flex center"
          />
        </div>
      </div>

      <div className="freeZoneContainer width-100 flex center">
        <div className="freeZoneContent flex column center">
          <div className="freeZoneListContainer width-100 flex center">
            <ul
              className={`freeZoneList flex space-between c-gap-10 ${
                en ? "montserrat" : "reverse almarai"
              }`}
            >
              <li
                className={`flex1 nowrap flex justify-content ${
                  activeContent === "1" ? "freeZoneActiveList" : ""
                }`}
                onClick={() => handleTabClick("1")}
              >
                {en ? "Hint" : "مقدمة"}
              </li>
              <li
                className={`flex1 nowrap flex justify-content ${
                  activeContent === "2" ? "freeZoneActiveList" : ""
                }`}
                onClick={() => handleTabClick("2")}
              >
                {en ? "Rules and Regulations" : "القوانين والانظمة"}
              </li>
              <li
                className={`flex1 nowrap flex justify-content ${
                  activeContent === "3" ? "freeZoneActiveList" : ""
                }`}
                onClick={() => handleTabClick("3")}
              >
                {en ? "Buildings & Equipments" : "المباني والتجهيزات"}
              </li>
              <li
                className={`flex1 nowrap flex justify-content ${
                  activeContent === "4" ? "freeZoneActiveList" : ""
                }`}
                onClick={() => handleTabClick("4")}
              >
                {en ? "Duty Free Market" : "السوق الحرة"}
              </li>
              <li
                className={`flex1 nowrap flex justify-content ${
                  activeContent === "5" ? "freeZoneActiveList" : ""
                }`}
                onClick={() => handleTabClick("5")}
              >
                {en ? "The Logistic Free Zone" : "المنطقة الحرة اللوجستية"}
              </li>
              <li
                className={`flex1 nowrap flex justify-content ${
                  activeContent === "6" ? "freeZoneActiveList" : ""
                }`}
                onClick={() => handleTabClick("6")}
              >
                {en ? "Taxes & Cost" : "الرسوم والتكاليف"}
              </li>
            </ul>
          </div>

          <div className="freeZoneTitleContent width-100 flex center">
            <div className="flex column fit-width button-group">
              {isEditing ? (
                <div className="width-20 flex c-gap-10">
                  <button onClick={handleSaveClick} className="save-btn">
                    Save
                  </button>
                  <button onClick={handleCancelClick} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              ) : activeContent === "2" && token ? (
                <div className="width-20">
                  <button onClick={handleEditClick} className="edit-btn">
                    Edit
                  </button>
                </div>
              ) : (
                <></>
              )}

              {data.data.map((item) => {
                if (item.title === "Hint" && activeContent === "1") {
                  return (
                    <>
                        <FreeZoneSection item={item} special={false} activeContent={activeContent} activeNumber='1' editedData={editedData} handleTitleClick={handleTitleClick}/>
                    </>
                  );
                }

                if (item.title === "Rules and Regulations" && activeContent === "2") {
                  return (
                    <>
                    <FreeZoneSection item={item} special={true} activeContent={activeContent} activeNumber='2' editedData={editedData} handleTitleClick={handleTitleClick}/>
                    </>
                  );
                }

                if (item.title === "Buildings & Equipments" && activeContent === "3") {
                  return (
                    <>
                        <FreeZoneSection item={item} special={false} activeContent={activeContent} activeNumber='3' editedData={editedData} handleTitleClick={handleTitleClick}/>
                    </>
                  );
                }

                if (item.title === "Duty Free Market" && activeContent === "4") {
                  return (
                    <>
                        <FreeZoneSection item={item} special={false} activeContent={activeContent} activeNumber='4' editedData={editedData} handleTitleClick={handleTitleClick}/>
                    </>
                  );
                }

                if (item.title === "The Logistic Free Zone" && activeContent === "5") {
                  return (
                    <>
                        <FreeZoneSection item={item} special={false} activeContent={activeContent} activeNumber='5' editedData={editedData} handleTitleClick={handleTitleClick}/>
                    </>
                  );
                }

                if (item.title === "Taxes & Cost" && activeContent === "6") {
                  return (
                    <>
                    {/* {console.warn("itemmmm", item)} */}
                        <FreeZoneSection item={item} special={false} activeContent={activeContent} activeNumber='6' editedData={editedData} handleTitleClick={handleTitleClick}/>
                    </>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeZoneBody;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import "./styles.css";
import "./styles.css";
import Image from "../../../Components/base/image";
import aboutImg from "../../../assets/images/about.png";
import ReactDOMServer from "react-dom/server";
import axios from "axios";

const AboutBody = (data) => {
  const [dataa, setData] = useState(data.data);
  const [originalData, setOriginalData] = useState([]);
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const language = useSelector((state) => state.language.language);
  const token = JSON.parse(localStorage.getItem("userToken"));
  // const [title, setTitle] = useState(data.data.title);
  // const [enTitle, setEnTitle] = useState(data.data.arTitle);
  const [changedItems, setChangedItems] = useState({}); // track by ID or index
  // const [content, setContent] = useState(news.content);
  // const [enContent, setEnContent] = useState(news.enContent);
  // const [originalData, setOriginalData] = useState({
  //   title: news.title,
  //   enTitle: news.enTitle,
  //   content: news.content,
  //   enContent: news.enContent,
  //   images: JSON.parse(news.image) || [],
  // });

  //   const selectedTab = useSelector((state) => state.selectedTab.selectedTab);

  // useEffect(() => {
  // const preventDragHandler = (e) => {
  //   if (e.target.tagName === "IMG") {
  //     e.preventDefault();
  //   }
  // };
  // document.addEventListener("dragstart", preventDragHandler);
  // return () => {
  //   document.removeEventListener("dragstart", preventDragHandler);
  // };
  // }, []);

  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://127.0.0.1:8000/api/data");
  //       console.log("Fetched data:");
  //       console.log(response.data);
  //       setData(response.data);
  //       if (data.length != 0) {
  //         console.log("Data:");
  //         console.log(data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  // useEffect(() => {
    // console.log("dataaaaaa:", dataa);
    // console.log("data:", data);
  // }, [dataa]);

  // useEffect(() => {
  // if (data.length != 0) {
  // console.log("Data:");
  // console.log(data);
  // }
  // }, [data]);

  const parseContent = (content) => {
    // console.log("Raw content:", content); // Debugging content before processing

    const elements = [];
    let currentList = [];
    let tempText = "";
    let nestedList = null; // Variable to handle nested <ul> lists
    let breakText = ""; // Variable to store the text after the <br> tag
    let encounteredBr = false; // Flag to track if <br> is encountered

    // Process the content piece by piece
    let regex = /<li>.*?<\/li>|<sub-li>.*?<\/sub-li>|<br\s*\/?>|[^<]+/g; // Match <li>, <sub-li>, <br>, and regular text
    let matches = content.match(regex);

    matches.forEach((segment, index) => {
      // console.log(`Processing segment [${index}]:`, segment); // Debugging each segment

      // Handle <li> tags
      if (segment.startsWith("<li>") && segment.endsWith("</li>")) {
        const listItemText = segment.replace(/<\/?li>/g, "").trim(); // Remove <li> tags
        // console.log("List item found:", listItemText);

        // Check if there are nested <sub-li> elements inside the <li>
        const subItems = listItemText.match(/<sub-li>.*?<\/sub-li>/g);
        if (subItems) {
          // Process the <li> without the <sub-li> items
          currentList.push(
            <li key={`li-${index}`}>
              {listItemText.replace(/<sub-li>.*?<\/sub-li>/g, "").trim()}
              <ul>
                {subItems.map((subItem, i) => {
                  // Process each <sub-li> as a nested <li> item inside the nested <ul>
                  const subListText = subItem
                    .replace(/<\/?sub-li>/g, "")
                    .trim();
                  return <li key={`sub-li-${index}-${i}`}>{subListText}</li>;
                })}
              </ul>
            </li>
          );
        } else {
          currentList.push(<li key={`li-${index}`}>{listItemText}</li>);
        }
      }
      // Handle <sub-li> tags as sub-items under the current <li> element
      else if (
        segment.startsWith("<sub-li>") &&
        segment.endsWith("</sub-li>")
      ) {
        const subListText = segment.replace(/<\/?sub-li>/g, "").trim();
        // console.log("Sub-list item found:", subListText);

        // If there is no current nested <ul>, create one
        if (!nestedList) {
          nestedList = [];
        }

        nestedList.push(<li key={`sub-li-${index}`}>{subListText}</li>);
      }
      // Handle <br> as a line break (store text after <br>)
      else if (segment.startsWith("<br>") || segment === "") {
        // console.log("Line break found:", segment);

        // console.log("noooo");
        // console.log(tempText.trim());

        elements.push(<br key={`br-before-${index}`} />);

        // If there's any accumulated text, process it before the <br> content
        if (tempText.trim()) {
          elements.push(<p key={`p-${index}`}>{tempText.trim()}</p>);
          // console.log("noooo")
          // console.log(tempText.trim())
          tempText = ""; // Clear accumulated text for the next part
        }

        encounteredBr = true; // Flag that <br> has been encountered
      }
      // If it's regular text (paragraphs), accumulate text until we hit a tag
      else {
        tempText += segment;
      }
    });

    // If we have a nested list, close it by adding it to the current <li> and then to the main list
    if (nestedList) {
      currentList.push(
        <ul className="specialList" key={`nested-ul`}>
          {nestedList}
        </ul>
      );
    }

    // After parsing all segments, check if there's any remaining text to add as a paragraph
    if (tempText.trim()) {
      elements.push(<p key={`p-final`}>{tempText.trim()}</p>);
    }

    // If there are ongoing list items, close them by adding to <ul>
    if (currentList.length > 0) {
      elements.push(<ul key={`ul-final`}>{currentList}</ul>);
    }

    // Now check if there was any <br> encountered
    if (encounteredBr && breakText.trim()) {
      elements.push(<p key={`break-text`}>{breakText.trim()}</p>);
    }

    // Now shift the elements array, move the last element to the first position
    if (elements.length > 1) {
      let y = elements[elements.length - 1]; // Store the last element
      for (let i = elements.length - 1; i > 0; i--) {
        elements[i] = elements[i - 1]; // Shift the elements to the right
      }
      elements[0] = y; // Move the last element to the first position
    }

    // console.log("Final parsed elements:", elements); // Debug final output
    return elements;
  };

  const handleEditClick = () => {
    // const parsedExistingImages = Array.isArray(existingImages) ? existingImages
    //   : JSON.parse(existingImages || "[]");

    setOriginalData(JSON.parse(JSON.stringify(dataa)));
    setIsEditing(true);
    // setLayout("flex-wrap");
  };

  const handleSaveClick = async () => {
    console.log("Changed items:", changedItems);

    const formData = new FormData();
    let i = 0;

    for (const [id, item] of Object.entries(changedItems)) {
      formData.append(`items[${i}][id]`, id);

      // Loop over each field in the item (excluding id)
      Object.entries(item).forEach(([key, value]) => {
        if (key === "id") return;

        if (key === "image" && typeof value === "object") {
          formData.append(`items[${i}][image]`, value);
        } else if (key !== "image") {
          formData.append(`items[${i}][${key}]`, value);
        }
      });

      i++;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/editData",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated successfully:", response.data);
      setIsEditing(false);
      setChangedItems({});
    } catch (error) {
      console.error("Error updating items:", error);
    }
  };

  const handleCancelClick = () => {
    // setTitle(originalData.title);
    // setEnTitle(originalData.enTitle);
    // setContent(originalData.content);
    // setEnContent(originalData.enContent);
    // console.log(originalData);
    setData(originalData);
    setIsEditing(false);
  };

  const handleDataChange = (field, e, index) => {
    const updatedValue = e.target.value;
    const originalItem = data.data[index];
    const updatedItem = {
      ...changedItems[originalItem.id],
      id: originalItem.id,
    };

    if (originalItem[field] !== updatedValue) {
      updatedItem[field] = updatedValue;
    } else {
      delete updatedItem[field];
    }

    // Clean up if nothing changed
    if (Object.keys(updatedItem).length > 1) {
      setChangedItems((prev) => ({
        ...prev,
        [originalItem.id]: updatedItem,
      }));
    } else {
      const { [originalItem.id]: _, ...rest } = changedItems;
      setChangedItems(rest);
    }

    // update UI
    const updatedData = [...data.data];
    updatedData[index][field] = updatedValue;
    setData(updatedData);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const itemId = data.data[index].id;
    const updatedItem = { ...changedItems[itemId], id: itemId, image: file };

    setChangedItems((prev) => ({
      ...prev,
      [itemId]: updatedItem,
    }));

    // update UI
    const updatedData = [...data.data];
    updatedData[index].image = file;
    setData(updatedData);
  };

  const aboutContent = [
    <div
      key="left"
      className="aboutContainerLeft width-50 flex justify-content-end align-items"
    >
      <div className="aboutContainerText width-80 flex">
        {language === "en" ? "About Port of Beirut" : "عن المرفأ"}
      </div>
    </div>,

    <div key="right" className="aboutContainerRight width-50">
      <Image
        src={aboutImg}
        alt="ِAbout of Port of Beirut"
        title={"PORT OF BEIRUT"}
        className="aboutPageImg flex center"
      />
    </div>,
  ];

  const aboutContentBodyEdit = (item, index) => [
    <div
      key="left"
      className={`img-content-left width-50 flex column center r-gap-20 ${
        (language === "ar" && index % 2 === 0) ||
        (language === "en" && index % 2 !== 0)
          ? "justify-content-end"
          : ""
      }`}
    >
      {/* <Image
        src={`http://127.0.0.1:8000/${item.image}`}
        className="aboutNewsImg"
      /> */}

      <Image
        src={
          item.image instanceof File
            ? URL.createObjectURL(item.image)
            : `http://127.0.0.1:8000/${item.image}`
        }
        className="aboutNewsImg"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e, index)}
      />
    </div>,

    <div key="right" className="img-content-right flex align-items">
      <div
        className={`about-title-content width-100 flex column ${
          language === "ar" ? "ar" : "en"
        }`}
      >
        <div className="aboutNewsTitle">
          <textarea
            type="text"
            value={language === "en" ? item.title : item.arTitle}
            onChange={(e) =>
              handleDataChange(
                language === "en" ? "title" : "arTitle",
                e,
                index
              )
            }
            className={`editInput-about height-60 ${
              language === "en" ? "en" : "ar"
            }`}
          />
        </div>
        <div className="aboutNewsContent">
          {/* {console.log("now")}
          {console.log(item.title)} */}
          <textarea
            type="text"
            value={language === "en" ? item.content : item.arContent}
            onChange={(e) =>
              handleDataChange(
                language === "en" ? "content" : "arContent",
                e,
                index
              )
            }
            className={`editInput-about ${language === "en" ? "en" : "ar"}`}
          />
        </div>
      </div>
    </div>,
  ];

  const aboutContentBody = (item, index) => [
    <div
      key="left"
      className={`img-content-left width-50 flex ${
        (language === "ar" && index % 2 === 0) ||
        (language === "en" && index % 2 !== 0)
          ? "justify-content-end"
          : ""
      }`}
    >
      <Image
        src={
          item.image instanceof File
            ? URL.createObjectURL(item.image)
            : `http://127.0.0.1:8000/${item.image}`
        }
        className="aboutNewsImg"
      />
    </div>,

    <div key="right" className="img-content-right flex align-items">
      <div
        className={`about-title-content width-100 flex column ${
          language === "ar" ? "ar" : "en"
        }`}
      >
        <div className="aboutNewsTitle">
          {language === "en" ? item.title : item.arTitle}
        </div>
        <div className="aboutNewsContent">
          {parseContent(language === "en" ? item.content : item.arContent)}
        </div>
      </div>
    </div>,
  ];

  return (
    <>
      <div className="aboutContainer width-100 flex">
        {language === "ar" ? aboutContent.reverse() : aboutContent}
      </div>

      <div className="editButtons flex center">
        {isEditing ? (
          <>
            <button className="saveBtn" onClick={handleSaveClick}>
            {language==='en' ? 'Save' : 'حفظ'}
            </button>
            <button className="cancelBtn" onClick={handleCancelClick}>
              {language==='en' ? 'Cancel' : 'إلغاء'}
            </button>
          </>
        ) : (
          token && (
            <button className="editBtn" onClick={handleEditClick}>
              {language==='en' ? 'Edit' : 'تعديل'}
            </button>
          )
        )}
      </div>
      {/* {console.log(dataa)} */}
      {dataa.length !== 0 ? (
        <div className="aboutBody width-100 flex center column">
          {dataa.map((item, index) => {
            return (
              <div
                key={index}
                className={`aboutContentBody width-100 flex center ${
                  index % 2 === 0 ? "white-bg" : "grey-bg"
                }`}
              >
                <div className="aboutNews width-100 flex space-between">
                  {(language === "en" && index % 2 === 0) ||
                  (language === "ar" && index % 2 !== 0) ? (
                    isEditing ? (
                      <>{aboutContentBodyEdit(item, index)}</>
                    ) : (
                      <>{aboutContentBody(item, index)}</>
                    )
                  ) : isEditing ? (
                    <>{aboutContentBodyEdit(item, index).reverse()}</>
                  ) : (
                    <>{aboutContentBody(item, index).reverse()}</>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AboutBody;

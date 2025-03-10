import React, { useEffect, useState } from "react";
import "./styles.css";
import Image from "../../../Components/base/image";
import freeZoneImg from "../../../assets/images/about.png";
import ReactDOMServer from "react-dom/server";
import AutoResizeTextarea from "../../base/autoResizeTextArea";
import axios from "axios";
import DOMPurify from "dompurify";

const FreeZoneBody = (data) => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    const [activeContent, setActiveContent] = useState("1");
    const [isEditing, setIsEditing] = useState(false);

    const filteredData = data.data
        .filter((item) => item.title === "Rules and Regulations")
        .map((item) => ({
            id: item.id,
            sub_title: item.sub_title,
            content: item.content
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
                console.log("updatedFields.sub_title: " + updatedFields.sub_title)
            }
            if (item.content !== originalData[index].content) {
                updatedFields.content = item.content;
                console.log("updatedFields.content: " + updatedFields.content)
            }

            if (Object.keys(updatedFields).length > 0) {
                acc.push({ id: item.id, ...updatedFields });
                console.log("acc")
                console.log(acc)
            }

            return acc;
        }, []);

        if (changes.length > 0) {
            console.log("changes")
            console.log(changes)
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
            const response = await axios.post("http://localhost:8000/api/editData", { items: updatedItems, token: token });

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
    }

    const handleTitleClick = (id) => {

        const elements = document.querySelectorAll(`[id='${id}']`); // Get all matching elements

        if (elements.length > 1) {
            console.warn("Content ID ", id);

            elements[1].scrollIntoView({ behavior: 'smooth' }); // Scroll to the second match
        } else if (elements.length === 1) {
            console.warn("Content ID ", id);
            elements[0].scrollIntoView({ behavior: 'smooth' }); // Scroll to the first match if no second exists
        } else {
            console.warn("Content ID not found:", id);
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
    }, [])

    return (
        <>
            <div className="aboutContainer width-100 flex">
                <div className="aboutContainerLeft width-50 flex center">
                    <div className="aboutContainerText flex">Free Zone</div>
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
                        <ul className="freeZoneList flex space-between">
                            <li className={`${activeContent === "1" ? "freeZoneActiveList" : ""}`} onClick={() => handleTabClick("1")}>Hint</li>
                            <li className={`${activeContent === "2" ? "freeZoneActiveList" : ""}`} onClick={() => handleTabClick("2")}>Rules and Regulations</li>
                            <li className={`${activeContent === "3" ? "freeZoneActiveList" : ""}`} onClick={() => handleTabClick("3")}>Buildings & Equipments</li>
                            <li className={`${activeContent === "4" ? "freeZoneActiveList" : ""}`} onClick={() => handleTabClick("4")}>Duty Free Market</li>
                            <li className={`${activeContent === "5" ? "freeZoneActiveList" : ""}`} onClick={() => handleTabClick("5")}>The Logistic Free Zone</li>
                            <li className={`${activeContent === "6" ? "freeZoneActiveList" : ""}`} onClick={() => handleTabClick("6")}>Taxes & Cost</li>
                        </ul>
                    </div>

                    <div className="freeZoneTitleContent width-100 flex center">
                        {/* Buttons */}
                        <div className="flex column fit-width button-group">
                            {isEditing ? (
                                <div className="width-20 flex c-gap-10">
                                    <button onClick={handleSaveClick} className="save-btn">OK</button>
                                    <button onClick={handleCancelClick} className="cancel-btn">Cancel</button>
                                </div>
                            ) : activeContent === '2' && token ? (
                                <div className="width-20">
                                    <button onClick={handleEditClick} className="edit-btn">Edit</button>
                                </div>
                            ) : (<></>)}

                            {data.data.map((item) => {
                                if (item.title === "Hint") {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`content ${activeContent === "1" ? "show" : ""}`}
                                        >
                                            <div className="flex column">
                                                {item.sub_title && <h2 className="freeZoneSubTitle">{item.sub_title}</h2>}

                                                <div id={item.id}>
                                                    <div>
                                                        {item.content.split("<br>").map((line, index) => {
                                                            if (line === " " || line === "") {
                                                                return <div key={index} className="empty-line"></div>;
                                                            }

                                                            const redRegex = /<red>(.*?)<\/red>/g;
                                                            const blRegex = /<bl>(.*?)<\/bl>/g;
                                                            const blLightRegex = /<bl-light>(.*?)<\/bl-light>/g;
                                                            const liRegex = /<li>(.*?)<\/li>/g;

                                                            let lineContent = line;

                                                            lineContent = lineContent.replace(redRegex, (match, p1) => {
                                                                return `<span class="red-color">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blRegex, (match, p1) => {
                                                                return `<span class="bl-color">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blLightRegex, (match, p1) => {
                                                                return `<span class="bl-light-color">${p1}</span>`;
                                                            });

                                                            let content = [];
                                                            let listItems = [];
                                                            let isInList = false;

                                                            let parts = lineContent.split(liRegex);

                                                            parts.forEach((part, idx) => {
                                                                if (idx % 2 === 1) {
                                                                    listItems.push(<li key={`li-${idx}`}>{part}</li>);
                                                                    isInList = true;
                                                                } else {
                                                                    if (part.trim() !== "") {
                                                                        // if (isInList) {
                                                                        //     content.push(
                                                                        //         <ul key={`ul-${idx}`} className="freeZoneContentList line-ht-10">
                                                                        //             {listItems}
                                                                        //         </ul>
                                                                        //     );

                                                                        // }
                                                                        // console.log(listItems)
                                                                        listItems = []; // Reset the list
                                                                        isInList = false;

                                                                        const sanitizedPart = DOMPurify.sanitize(part);

                                                                        content.push(<div key={`text-${idx}`} dangerouslySetInnerHTML={{ __html: sanitizedPart }} />);
                                                                    }
                                                                }
                                                            });

                                                            // If list items are still left at the end, wrap them in a <ul>
                                                            if (listItems.length > 0) {
                                                                content.push(
                                                                    <ul key="last-ul" className="freeZoneContentList">
                                                                        {listItems}
                                                                    </ul>
                                                                );
                                                            }

                                                            return content;
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                // {console.log(editedData)}
                                if (item.title === "Rules and Regulations") {
                                    return (
                                        <div key={item.id} className={`content special-width ${activeContent === "2" ? "show" : ""}`}>
                                            <div className="flex center">

                                                <div className="flex column width-100">
                                                    {/* Find the correct item in editedData */}
                                                    {editedData.find((entry) => entry.id === item.id) && (
                                                        <>
                                                            {/* Title Section */}
                                                            {/* {console.log(editedData.find((entry) => entry.id === item.id))} */}
                                                            <div id={item.id}>
                                                                {isEditing ? (
                                                                    <AutoResizeTextarea
                                                                        type="text"
                                                                        id={item.id}
                                                                        field="sub_title"
                                                                        value={editedData.find((entry) => entry.id === item.id)?.sub_title ?? ""}
                                                                        placeholder="Sub-Title"
                                                                        onChange={handleInputChange}
                                                                        className="freeZoneSubTitle edit-input"
                                                                    />
                                                                ) : (
                                                                    <h2 className="freeZoneSubTitle">
                                                                        {editedData.find((entry) => entry.id === item.id)?.sub_title}
                                                                    </h2>
                                                                )}
                                                            </div>

                                                            {/* Content Section */}
                                                            <div id={item.id}>
                                                                {isEditing ? (
                                                                    <AutoResizeTextarea
                                                                        id={item.id}
                                                                        field="content"
                                                                        value={editedData.find((entry) => entry.id === item.id)?.content ?? ""}
                                                                        onChange={handleInputChange}
                                                                        className="edit-textarea"
                                                                    />
                                                                ) : (
                                                                    <div>
                                                                        {editedData.find((entry) => entry.id === item.id)?.content
                                                                            .split("<br>")
                                                                            .map((line, index) => {
                                                                                if (line.trim() === "") {
                                                                                    // if(li){
                                                                                    // setBr([line])
                                                                                    // }
                                                                                    // console.log(line)
                                                                                    return <div key={index} className="empty-line"></div>;
                                                                                }

                                                                                // Chapter Matching
                                                                                const chapterRegex = /<red>Chapter\s(\d+|\w+):?\s?(.*?)<\/red>/gi;
                                                                                const blLightRegex = /<bl-light>(.*?)<\/bl-light>/gi;

                                                                                const chapterMatch = chapterRegex.exec(line);
                                                                                const blLightMatch = blLightRegex.exec(line);

                                                                                if (chapterMatch) {
                                                                                    const blLightTitle = blLightMatch?.[1]
                                                                                        ? blLightMatch[1].toLowerCase().trim().replace(/'/g, "’").replace(/\s+/g, "-")
                                                                                        : "";
                                                                                    const chapterId = blLightTitle
                                                                                        ? `chapter-${chapterMatch[1].toLowerCase().trim().replace(/\s+/g, "-")}-${blLightTitle}`
                                                                                        : `chapter-${chapterMatch[1].toLowerCase().trim().replace(/\s+/g, "-")}`;

                                                                                    return (
                                                                                        <div
                                                                                            id={chapterId}
                                                                                            key={index}
                                                                                            onClick={() => handleTitleClick(chapterId)}
                                                                                            className="chapter-section flex fit-width"
                                                                                        >
                                                                                            <span className={`red-color ${!blLightMatch?.[1] ? "pointer" : ""}`}>
                                                                                                Chapter {chapterMatch[1]}:
                                                                                            </span>
                                                                                            {blLightMatch?.[1] && (
                                                                                                <span className="bl-light-color pointer">&nbsp;{blLightMatch[1]}</span>
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                }

                                                                                // Apply Tag Formatting
                                                                                line = line.replace(/<red>(.*?)<\/red>/g, `<span class="red-color">$1</span>`);
                                                                                line = line.replace(/<bl>(.*?)<\/bl>/g, `<span class="bl-color">$1</span>`);
                                                                                line = line.replace(/<bl-light>(.*?)<\/bl-light>/g, `<span class="bl-light-color">$1</span>`);

                                                                                // Handle List Items
                                                                                const liRegex = /<li>([\s\S]*?)<\/li>/g;

                                                                                let parts = line.split(liRegex);
                                                                                let content = [];
                                                                                let listItems = [];
                                                                                // console.log(parts)

                                                                                parts.forEach((part, idx) => {
                                                                                    if (idx % 2 === 1) {
                                                                                        // setLi(false)
                                                                                        // console.log(part)
                                                                                        listItems.push(<li key={`li-${index}-${idx}`}>{part}</li>);
                                                                                    } else if (part.trim() !== "") {
                                                                                        if (listItems.length > 0) {
                                                                                            content.push(
                                                                                                <ul key={`ul-${index}`} className="freeZoneContentList">
                                                                                                    {listItems}
                                                                                                </ul>
                                                                                            );
                                                                                            listItems = [];
                                                                                            // setLi(false);
                                                                                        }

                                                                                        const sanitizedPart = DOMPurify.sanitize(part);

                                                                                        content.push(<div key={`text-${index}-${idx}`} dangerouslySetInnerHTML={{ __html: sanitizedPart }} />);
                                                                                    }
                                                                                });

                                                                                if (listItems.length > 0) {
                                                                                    content.push(
                                                                                        <ul key={`last-ul-${index}`} className="freeZoneContentList">
                                                                                            {listItems}
                                                                                        </ul>
                                                                                    );
                                                                                }

                                                                                return content;
                                                                            })}
                                                                    </div>
                                                                )}
                                                            </div>

                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }



                                if (item.title === "Buildings & Equipments") {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`content ${activeContent === "3" ? "show" : ""}`}
                                        >
                                            <div className="flex column">
                                                {item.sub_title && <h2 className="freeZoneSubTitle">{item.sub_title}</h2>}

                                                <div id={item.id}>
                                                    <div>
                                                        {item.content.split("<br>").map((line, index) => {
                                                            if (line === " " || line === "") {
                                                                return <div key={index} className="empty-line"></div>;
                                                            }

                                                            const redRegex = /<red>(.*?)<\/red>/g;
                                                            const blRegex = /<bl>(.*?)<\/bl>/g;
                                                            const blLightRegex = /<bl-light>(.*?)<\/bl-light>/g;
                                                            const liRegex = /<li>(.*?)<\/li>/g;

                                                            let lineContent = line;

                                                            lineContent = lineContent.replace(redRegex, (match, p1) => {
                                                                return `<span class="red-color">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blRegex, (match, p1) => {
                                                                return `<span class="bl-color">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blLightRegex, (match, p1) => {
                                                                return `<span class="bl-light-color">${p1}</span>`;
                                                            });

                                                            let content = [];
                                                            let listItems = [];
                                                            let isInList = false;

                                                            let parts = lineContent.split(liRegex);

                                                            parts.forEach((part, idx) => {
                                                                if (idx % 2 === 1) {
                                                                    listItems.push(<li key={`li-${idx}`}>{part}</li>);
                                                                    isInList = true;
                                                                } else {
                                                                    if (part.trim() !== "") {
                                                                        // if (isInList) {
                                                                        //     content.push(
                                                                        //         <ul key={`ul-${idx}`} className="freeZoneContentList line-ht-10">
                                                                        //             {listItems}
                                                                        //         </ul>
                                                                        //     );

                                                                        // }
                                                                        // console.log(listItems)
                                                                        listItems = []; // Reset the list
                                                                        isInList = false;

                                                                        const sanitizedPart = DOMPurify.sanitize(part);

                                                                        content.push(<div key={`text-${idx}`} dangerouslySetInnerHTML={{ __html: sanitizedPart }} />);
                                                                    }
                                                                }
                                                            });

                                                            // If list items are still left at the end, wrap them in a <ul>
                                                            if (listItems.length > 0) {
                                                                content.push(
                                                                    <ul key="last-ul" className="freeZoneContentList">
                                                                        {listItems}
                                                                    </ul>
                                                                );
                                                            }

                                                            return content;
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                if (item.title === "Duty Free Market") {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`content ${activeContent === "4" ? "show" : ""}`}
                                        >
                                            <div className="flex column">
                                                {item.sub_title && <h2 className="freeZoneSubTitle">{item.sub_title}</h2>}

                                                <div id={item.id}>
                                                    <div>
                                                        {item.content.split("<br>").map((line, index) => {
                                                            if (line === " " || line === "") {
                                                                return <div key={index} className="empty-line"></div>;
                                                            }

                                                            const redRegex = /<red>(.*?)<\/red>/g;
                                                            const blRegex = /<bl>(.*?)<\/bl>/g;
                                                            const blLightRegex = /<bl-light>(.*?)<\/bl-light>/g;
                                                            const liRegex = /<li>(.*?)<\/li>/g;

                                                            let lineContent = line;

                                                            lineContent = lineContent.replace(redRegex, (match, p1) => {
                                                                return `<span class="red-color bold freeZoneTitle">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blRegex, (match, p1) => {
                                                                return `<span class="bl-color">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blLightRegex, (match, p1) => {
                                                                return `<span class="bl-light-color">${p1}</span>`;
                                                            });

                                                            let content = [];
                                                            let listItems = [];
                                                            let isInList = false;

                                                            let parts = lineContent.split(liRegex);

                                                            parts.forEach((part, idx) => {
                                                                if (idx % 2 === 1) {
                                                                    listItems.push(<li key={`li-${idx}`}>{part}</li>);
                                                                    isInList = true;
                                                                } else {
                                                                    if (part.trim() !== "") {
                                                                        // if (isInList) {
                                                                        //     content.push(
                                                                        //         <ul key={`ul-${idx}`} className="freeZoneContentList line-ht-10">
                                                                        //             {listItems}
                                                                        //         </ul>
                                                                        //     );

                                                                        // }
                                                                        // console.log(listItems)
                                                                        listItems = []; // Reset the list
                                                                        isInList = false;

                                                                        const sanitizedPart = DOMPurify.sanitize(part);

                                                                        content.push(<div key={`text-${idx}`} dangerouslySetInnerHTML={{ __html: sanitizedPart }} />);
                                                                    }
                                                                }
                                                            });

                                                            // If list items are still left at the end, wrap them in a <ul>
                                                            if (listItems.length > 0) {
                                                                content.push(
                                                                    <ul key="last-ul" className="freeZoneContentList">
                                                                        {listItems}
                                                                    </ul>
                                                                );
                                                            }

                                                            return content;

                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                if (item.title === "The Logistic Free Zone") {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`content ${activeContent === "5" ? "show" : ""}`}
                                        >
                                            <div className="flex column">
                                                {item.sub_title && <h2 className="freeZoneSubTitle">{item.sub_title}</h2>}

                                                <div id={item.id}>
                                                    <div>
                                                        {item.content.split("<br>").map((line, index) => {
                                                            if (line === " " || line === "") {
                                                                return <div key={index} className="empty-line"></div>;
                                                            }

                                                            const redRegex = /<red>(.*?)<\/red>/g;
                                                            const blRegex = /<bl>(.*?)<\/bl>/g;
                                                            const blLightRegex = /<bl-light>(.*?)<\/bl-light>/g;
                                                            const liRegex = /<li>(.*?)<\/li>/g;

                                                            let lineContent = line;

                                                            lineContent = lineContent.replace(redRegex, (match, p1) => {
                                                                return `<span class="red-color bold freeZoneTitle">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blRegex, (match, p1) => {
                                                                return `<span class="bl-color">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blLightRegex, (match, p1) => {
                                                                return `<span class="bl-light-color">${p1}</span>`;
                                                            });

                                                            let content = [];
                                                            let listItems = [];
                                                            let isInList = false;

                                                            let parts = lineContent.split(liRegex);

                                                            parts.forEach((part, idx) => {
                                                                if (idx % 2 === 1) {
                                                                    listItems.push(<li key={`li-${idx}`}>{part}</li>);
                                                                    isInList = true;
                                                                } else {
                                                                    if (part.trim() !== "") {
                                                                        // if (isInList) {
                                                                        //     content.push(
                                                                        //         <ul key={`ul-${idx}`} className="freeZoneContentList line-ht-10">
                                                                        //             {listItems}
                                                                        //         </ul>
                                                                        //     );

                                                                        // }
                                                                        // console.log(listItems)
                                                                        listItems = []; // Reset the list
                                                                        isInList = false;

                                                                        const sanitizedPart = DOMPurify.sanitize(part);

                                                                        content.push(<div key={`text-${idx}`} dangerouslySetInnerHTML={{ __html: sanitizedPart }} />);
                                                                    }
                                                                }
                                                            });

                                                            // If list items are still left at the end, wrap them in a <ul>
                                                            if (listItems.length > 0) {
                                                                content.push(
                                                                    <ul key="last-ul" className="freeZoneContentList">
                                                                        {listItems}
                                                                    </ul>
                                                                );
                                                            }

                                                            return content;
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                if (item.title === "Taxes & Cost") {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`content ${activeContent === "6" ? "show" : ""}`}
                                        >
                                            <div className="flex column">
                                                {item.sub_title && <h2 className="freeZoneSubTitle">{item.sub_title}</h2>}

                                                <div id={item.id}>
                                                    <div>
                                                        {item.content.split("<br>").map((line, index) => {
                                                            if (line === " " || line === "") {
                                                                return <div key={index} className="empty-line"></div>;
                                                            }

                                                            const redRegex = /<red>(.*?)<\/red>/g;
                                                            const blRegex = /<bl>(.*?)<\/bl>/g;
                                                            const blLightRegex = /<bl-light>(.*?)<\/bl-light>/g;
                                                            const liRegex = /<li>(.*?)<\/li>/g;

                                                            let lineContent = line;

                                                            lineContent = lineContent.replace(redRegex, (match, p1) => {
                                                                return `<span class="red-color bold freeZoneTitle">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blRegex, (match, p1) => {
                                                                return `<span class="bl-color">${p1}</span>`;
                                                            });

                                                            lineContent = lineContent.replace(blLightRegex, (match, p1) => {
                                                                return `<span class="bl-light-color">${p1}</span>`;
                                                            });

                                                            let content = [];
                                                            let listItems = [];
                                                            let isInList = false;

                                                            let parts = lineContent.split(liRegex);

                                                            parts.forEach((part, idx) => {
                                                                if (idx % 2 === 1) {
                                                                    listItems.push(<li key={`li-${idx}`}>{part}</li>);
                                                                    isInList = true;
                                                                } else {
                                                                    if (part.trim() !== "") {
                                                                        // if (isInList) {
                                                                        //     content.push(
                                                                        //         <ul key={`ul-${idx}`} className="freeZoneContentList line-ht-10">
                                                                        //             {listItems}
                                                                        //         </ul>
                                                                        //     );

                                                                        // }
                                                                        // console.log(listItems)
                                                                        listItems = []; // Reset the list
                                                                        isInList = false;

                                                                        const sanitizedPart = DOMPurify.sanitize(part);

                                                                        content.push(<div key={`text-${idx}`} dangerouslySetInnerHTML={{ __html: sanitizedPart }} />);
                                                                    }
                                                                }
                                                            });

                                                            // If list items are still left at the end, wrap them in a <ul>
                                                            if (listItems.length > 0) {
                                                                content.push(
                                                                    <ul key="last-ul" className="freeZoneContentList">
                                                                        {listItems}
                                                                    </ul>
                                                                );
                                                            }

                                                            return content;
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </div>

                        {/* <div
                            id="1"
                            className={`content ${activeContent === "1" ? "show" : ""}`}
                        >
                            <p>This is the content for Title 1.</p>
                        </div>
                        <div
                            id="2"
                            className={`content ${activeContent === "2" ? "show" : ""}`}
                        >
                            <p>This is the content for Title 2.</p>
                        </div>
                        <div
                            id="3"
                            className={`content ${activeContent === "3" ? "show" : ""}`}
                        >
                            <p>This is the content for Title 3.</p>
                        </div> */}
                    </div>
                </div>
            </div>


            {/* {data.length !== 0 ? (
        <div className="aboutBody width-100 flex center column">
          {data.data.map((item, index) => {
            return (
              <div
                key={index}
                className={`aboutContentBody width-100 flex center ${
                  index % 2 === 0 ? "white-bg" : "grey-bg"
                }`}
              >
                <div className="aboutNews width-100 flex space-between">
                  {index % 2 === 0 ? (
                    <>
                      <div className="img-content-left width-50 flex">
                        <Image
                          src={`http://127.0.0.1:8000/${item.image}`}
                          className="aboutNewsImg"
                        />
                      </div>
                      <div className="img-content-right flex align-items">
                        <div className="about-title-content flex column">
                          <div className="aboutNewsTitle">{item.title}</div>
                          <div className="aboutNewsContent">
                            {parseContent(item.content)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="img-content-right flex align-items">
                        <div className="about-title-content flex column">
                          <div className="aboutNewsTitle">{item.title}</div>
                          <div className="aboutNewsContent">
                            {parseContent(item.content)}
                          </div>
                        </div>
                      </div>
                      <div className="img-content-left width-50 flex justify-content-end">
                        <Image
                          src={`http://127.0.0.1:8000/${item.image}`}
                          className="aboutNewsImg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )} */}
        </>
    );
};

export default FreeZoneBody;
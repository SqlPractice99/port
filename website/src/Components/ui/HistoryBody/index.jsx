import React, { useEffect, useState } from "react";
import "./styles.css";
import Image from "../../../Components/base/image";
import historyImg from "../../../assets/images/history.png";
import ReactDOMServer from "react-dom/server";
// import axios from "axios";

const HistoryBody = (data) => {
  const parseContent = (content) => {
    console.log("Raw content:", content); // Debugging content before processing

    const elements = [];
    let currentList = [];
    let tempText = "";
    let nestedList = null; // Variable to handle nested <ul> lists
    let breakText = ""; // Variable to store the text after the <br> tag
    let encounteredBr = false; // Flag to track if <br> is encountered

    // Process the content piece by piece
    let regex = /<li>.*?<\/li>|<sub-li>.*?<\/sub-li>|<\/?br\s*\/?>|[^<]+/g; // Match <li>, <sub-li>, <br>, and regular text
    let matches = content.match(regex);

    matches.forEach((segment, index) => {
      console.log(`Processing segment [${index}]:`, segment); // Debugging each segment

      // Handle <li> tags
      if (segment.startsWith("<li>") && segment.endsWith("</li>")) {
        const listItemText = segment.replace(/<\/?li>/g, "").trim(); // Remove <li> tags
        console.log("List item found:", listItemText);

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
        console.log("Sub-list item found:", subListText);

        // If there is no current nested <ul>, create one
        if (!nestedList) {
          nestedList = [];
        }

        nestedList.push(<li key={`sub-li-${index}`}>{subListText}</li>);
      }
      // Handle <br> as a line break (store text after <br>)
      else if (segment.startsWith("</br>") || segment === "") {
        console.log("Line break found:", segment);
        console.log("mmmmmmmmmmmmmmmm");

        // elements.push(<br key={`br-before-${index}`} />);

        // If there's any accumulated text, process it before the <br> content
        if (tempText.trim()) {
          console.log("noooo");
          console.log(tempText.trim());
          //   elements.push(<p key={`p-${index}`}>{tempText.trim()}</p>);
          // console.log("noooo")
          // console.log(tempText.trim())
          console.log("Text before line break:", tempText.trim());
          elements.push(<p key={`p-${index}`}>{tempText.trim()}</p>);
          tempText = ""; // Clear accumulated text for the next part
        }

        // elements.push(<br key={`br-${index}`} />);

        encounteredBr = true; // Flag that <br> has been encountered
      }
      // If it's regular text (paragraphs), accumulate text until we hit a tag
      else {
        console.log("whattttttttt");

        tempText += segment;
      }
    });
    console.log("shuuuuuuuuu");

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
        console.log("zzzzzzzzzzzzzzzzzz");
        console.log(tempText.trim())
      elements.push(<p key={`p-final`}>{tempText.trim()}</p>);
    }

    // If there are ongoing list items, close them by adding to <ul>
    if (currentList.length > 0) {
        console.log("llllllllllllllllllllllllllllllll");

      elements.push(<ul key={`ul-final`}>{currentList}</ul>);
    }

    // Now check if there was any <br> encountered
    if (encounteredBr && breakText.trim()) {
      console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
      elements.push(<p key={`break-text`}>{breakText.trim()}</p>);
    }

    // Now shift the elements array, move the last element to the first position
    if (elements.length > 1) {
        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");

      let y = elements[elements.length - 1]; // Store the last element
      for (let i = elements.length - 1; i > 0; i--) {
        elements[i] = elements[i - 1]; // Shift the elements to the right
      }
      elements[0] = y; // Move the last element to the first position
    }
    console.log("zzzzzzzzzzzzzzzzzz");

    console.log("Final parsed elements:", elements); // Debug final output
    return elements;
  };

  return (
    <>
      <div className="aboutContainer width-100 flex">
        <div className="aboutContainerLeft width-50 flex center">
          <div className="aboutContainerText flex">History</div>
        </div>

        <div className="aboutContainerRight width-50">
          <Image
            src={historyImg}
            alt="History of Port of Beirut"
            title="PORT OF BEIRUT"
            className="aboutPageImg flex center"
          />
        </div>
      </div>

      {data.length !== 0 ? (
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
      )}
    </>
  );
};

export default HistoryBody;

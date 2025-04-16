import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../../Components/base/image";
import freeZoneImg from "../../../assets/images/about.png";
import ReactDOMServer from "react-dom/server";
import AutoResizeTextarea from "../../base/autoResizeTextArea";
import axios from "axios";
import DOMPurify from "dompurify";

const FreeZoneSection = ({ item, special=false, activeContent, activeNumber, editedData, handleTitleClick }) => {
    const language = useSelector((state) => state.language.language);
    const en = (language==='en');

  return (
    <div
      key={item.id}
      className={`content ${special ? (en ? 'special-width' : '') : ''} ${
        activeContent === activeNumber &&
        (en ||
          (item.arSub_title?.trim() ||
            item.arContent?.trim()))
          ? "show"
          : ""
      }`}
    >
      <div className={`flex center ${en ? '' : 'width-100'} `}>
        <div className="flex column width-100">
          {item &&
            (en
              ? item.content
              : item.arContent
              ) && (
              <>
                <div id={item.id}>
                  {/* {isEditing ? (
                    <AutoResizeTextarea
                      type="text"
                      id={item.id}
                      field="sub_title"
                      value={
                        editedData.find((entry) => entry.id === item.id)?.[
                          en ? item.sub_title : item.arSub_title
                        ] ?? ""
                      }
                      placeholder="Sub-Title"
                      onChange={handleInputChange}
                      className="freeZoneSubTitle edit-input"
                    />
                  ) : ( */}
                    <h2
                      className={`freeZoneSubTitle ${en ? "" : "ar timesNewRoman"} ${
                        !en && !item.arSub_title ? "content" : ""
                      }`}
                    >
                      {(item &&
                        (en
                          ? item
                              ?.sub_title
                          : item
                              ?.arSub_title)) ??
                        ""}
                    </h2>
                  {/* )} */}
                </div>

                <div id={item.id}>
                  {/* {isEditing ? (
                    <AutoResizeTextarea
                      id={item.id}
                      field="content"
                      value={
                        editedData.find((entry) => entry.id === item.id)?.[
                          en ? item.content : item.arContent
                        ] ?? ""
                      }
                      onChange={handleInputChange}
                      className="edit-textarea"
                    />
                  ) : ( */}
                    <div
                      className={`${en ? "" : "ar timesNewRoman"} ${
                        !en && !item.arContent ? "content border" : ""
                      }`}
                    >
                      {(
                        item &&
                        (en
                          ? item
                              ?.content
                          : item
                              ?.arContent ?? "")
                      )
                        ?.split("<br>")
                        .map((line, index) => {
                          if (line.trim() === "") {
                            return (<div key={index} className="empty-line"></div>);
                          }

                          const chapterRegex =
                            /<red>Chapter\s(\d+|\w+):?\s?(.*?)<\/red>/gi;
                          const blLightRegex = /<bl-light>(.*?)<\/bl-light>/gi;

                          const chapterMatch = chapterRegex.exec(line);
                          const blLightMatch = blLightRegex.exec(line);

                          if (chapterMatch) {
                            const blLightTitle = blLightMatch?.[1]
                              ? blLightMatch[1]
                                  .toLowerCase()
                                  .trim()
                                  .replace(/'/g, "’")
                                  .replace(/\s+/g, "-")
                              : "";
                            const chapterId = blLightTitle
                              ? `chapter-${chapterMatch[1]
                                  .toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, "-")}-${blLightTitle}`
                              : `chapter-${chapterMatch[1]
                                  .toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, "-")}`;

                            return (
                              <div
                                id={chapterId}
                                key={index}
                                onClick={() => handleTitleClick(chapterId)}
                                className="chapter-section flex fit-width"
                              >
                                <span
                                  className={`red-color ${
                                    !blLightMatch?.[1] ? "pointer" : ""
                                  }`}
                                >
                                  Chapter {chapterMatch[1]}:
                                </span>
                                {blLightMatch?.[1] && (
                                  <span className="bl-light-color pointer">
                                    &nbsp;{blLightMatch[1]}
                                  </span>
                                )}
                              </div>
                            );
                          }

                          line = line.replace(
                            /<red>(.*?)<\/red>/g,
                            `<span class="red-color">$1</span>`
                          );
                          line = line.replace(
                            /<bl>(.*?)<\/bl>/g,
                            `<span class="bl-color">$1</span>`
                          );
                          line = line.replace(
                            /<bl-light>(.*?)<\/bl-light>/g,
                            `<span class="bl-light-color">$1</span>`
                          );

                          const liRegex = /<li>([\s\S]*?)<\/li>/g;

                          let parts = line.split(liRegex);
                          let content = [];
                          let listItems = [];

                          parts.forEach((part, idx) => {
                            if (idx % 2 === 1) {
                              listItems.push(
                                <li key={`li-${index}-${idx}`}>{part}</li>
                              );
                            } else if (part.trim() !== "") {
                              if (listItems.length > 0) {
                                content.push(
                                  <ul
                                    key={`ul-${index}`}
                                    className="freeZoneContentList"
                                  >
                                    {listItems}
                                  </ul>
                                );
                                listItems = [];
                              }

                              const sanitizedPart = DOMPurify.sanitize(part);

                              content.push(
                                <div
                                  key={`text-${index}-${idx}`}
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizedPart,
                                  }}
                                />
                              );
                            }
                          });

                          if (listItems.length > 0) {
                            content.push(
                              <ul
                                key={`last-ul-${index}`}
                                className="freeZoneContentList"
                              >
                                {listItems}
                              </ul>
                            );
                          }

                          return content;
                        })}
                    </div>
                  {/* )} */}
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default FreeZoneSection;

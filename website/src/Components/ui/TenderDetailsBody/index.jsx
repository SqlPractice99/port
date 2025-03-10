import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";
import Image from "../../../Components/base/image";
import tenderImg from "../../../assets/images/tender.png";
import TenderCover from "../../../assets/images/tenderCover.png";
import ReactDOMServer from "react-dom/server";
import FontFaceObserver from "fontfaceobserver";
// import axios from "axios";

const TenderDetailsBody = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const location = useLocation();
  const tender = location.state?.tender;

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected option:", event.target.value);
  };

  // useEffect(() => {
  //   // Log the data to console
  //   // console.log(data);

  //   // Font loading check
  //   const font = new FontFaceObserver("Almarai"); // Replace 'YourFontFamily' with the name of the font you want to check

  //   font
  //     .load()
  //     .then(() => {
  //       console.log("Font has been loaded and applied!");
  //     })
  //     .catch(() => {
  //       console.log("Font failed to load");
  //     });

  //   // Optionally, check the applied font using window.getComputedStyle
  //   const element = document.querySelector(".tenderListTitle"); // or any other element where you expect the font to be applied
  //   const fontFamily = window.getComputedStyle(element).fontFamily;
  //   console.log("Applied font on tenderListTitle:", fontFamily);
  // }, []);

  useEffect(() => {
    console.log(tender.title);
    console.log("what");
    console.log(tender);
  }, []);

  return (
    <>
      <div className="tenderDetailsContainer width-100 flex column center">
        <div className="tenderDetailsSection flex column center">
          <div className="tenderDetails flex">
            <div className="tenderDetailsLeft flex column width-50">
              <div className="tenderDetailsLeftContent">
                <div className="tenderDetailsDateContainer flex column align-items-end">
                  <div className="tenderDetailsDate flex">
                    {new Intl.DateTimeFormat("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(tender.created_at))}
                  </div>
                </div>

                <div className="tenderDetailsTitle">{tender.title}</div>

                <div className="tenderDetailsSubTitle">{tender.sub_title}</div>
              </div>
            </div>

            <div className="tenderDetailsRight flex column width-50">
              <Image
                src={TenderCover}
                alt="Tenders of Port of Beirut"
                title="PORT OF BEIRUT"
                className="tenderDetailsCoverImg flex center"
              />
            </div>
          </div>

          <div className="tenderDetailsDownload width-100 flex column r-gap-30 align-items-end">
            <a
              href={`http://localhost:8000/${tender.tender_paper}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
            <div className="tenderDetailsDownloadText">
              للاطلاع على دفتر الشروط اضغط على كلمة: Download PDF (اعلاه باللون
              الازرق)
            </div>
          </div>

          <div className="tenderDetailsImg flex center">
            <Image
              src={`http://localhost:8000/${tender.image}`}
              alt={tender.image}
              title="PORT OF BEIRUT"
              className="tenderDetailsImg flex center pointer"
              fullImage="true"
              display='true'
            />
          </div>
        </div>
      </div>

      {/* {data.length !== 0 ? (
        <div className="width-100 flex center">
          <div className="tenderBody flex align-items-start column">
            <ul className="tenderList width-100 flex wrap">
              {data.data.map((item, index) => (
                <li key={index}>
                  <div className="tenderListSection">
                    <Image
                      src={TenderCover}
                      alt="Tender Cover"
                      title="Tender Cover"
                      className="tenderListImg pointer"
                    />

                    <div className="tenderListDate flex">
                      {new Intl.DateTimeFormat("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}).format(new Date(item.created_at))}
                    </div>

                    <div className="tenderListTitle pointer">{item.title}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )} */}
    </>
  );
};

export default TenderDetailsBody;

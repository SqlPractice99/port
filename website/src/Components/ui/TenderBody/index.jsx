import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css";
import Image from "../../../Components/base/image";
import tenderImg from "../../../assets/images/tender.png";
import TenderCover from "../../../assets/images/tenderCover.png";
import ReactDOMServer from "react-dom/server";
import FontFaceObserver from "fontfaceobserver";
// import axios from "axios";

const TenderBody = (data) => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected option:", event.target.value);
  };

  const handleTenderClick = (item) => {
    console.log("pressed.")
    console.log(item)
    navigate("/TenderDetails", { state: { tender: item, from: location.pathname } });
  };

  // useEffect(() => {
  //   // Log the data to console
  //   console.log(data);

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

  return (
    <>
      <div className="aboutContainer width-100 flex">
        <div className="aboutContainerLeft width-50 flex center">
          <div className="aboutContainerText flex">Tenders</div>
        </div>

        <div className="aboutContainerRight flex center column width-50">
          <Image
            src={tenderImg}
            alt="Tenders of Port of Beirut"
            title="PORT OF BEIRUT"
            className="aboutPageImg flex center"
          />
        </div>
      </div>

      {data.length !== 0 ? (
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
                      onClick={() => handleTenderClick(item)}
                    />

                    <div className="tenderListDate flex">
                      {new Intl.DateTimeFormat("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}).format(new Date(item.created_at))}
                    </div>

                    <div className="tenderListTitle pointer" onClick={() => handleTenderClick(item)}>{item.title}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TenderBody;

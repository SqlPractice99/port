import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../../Components/base/image";
import fact1 from "../../../assets/images/fact1.png";
import fact2 from "../../../assets/images/fact2.png";
import fact3 from "../../../assets/images/fact3.png";
import fact4 from "../../../assets/images/fact4.png";

const FactsHolder = () => {
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    const preventDragHandler = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("dragstart", preventDragHandler);

    return () => {
      document.removeEventListener("dragstart", preventDragHandler);
    };
  }, []);

  return (
    <div className="factsHolder flex center">
      <div className={`factsHolderContent flex space-between ${language === "en" ? "" : "reverse"}`}>
        <div className={`fact flex c-gap-15 ${language === "en" ? "" : "reverse"}`}>
          <div className="factImgContainer">
            <Image src={fact1} className="factImg" />
          </div>

          <div className={`factRight flex justify-content start column ${language === "en" ? "" : "ar"}`}>
            <div className="factSmallText">Nearly</div>
            <div className="factLargeText">6M</div>
            <div className="factSmallText">Tons/year</div>
          </div>
        </div>

        <div className={`fact flex c-gap-15 ${language === "en" ? "" : "reverse"}`}>
          <div className="factImgContainer">
            <Image src={fact2} className="factImg" />
          </div>

          <div className={`factRight flex justify-content start column ${language === "en" ? "" : "ar"}`}>
            <div className="factSmallText">Nearly</div>
            <div className="factLargeText">1M</div>
            <div className="factSmallText">TEU/year</div>
          </div>
        </div>

        <div className={`fact flex c-gap-15 ${language==='en' ? '' : 'reverse'}`}>
          <div className="factImgContainer">
            <Image src={fact3} className="factImg" />
          </div>

          <div className={`factRight flex justify-content start column ${language === "en" ? "" : "ar"}`}>
            <div className="factSmallText">Nearly</div>
            <div className="factLargeText">3K</div>
            <div className="factSmallText">Ships/year</div>
          </div>
        </div>

        <div className={`fact flex c-gap-15 ${language==='en' ? '' : 'reverse'}`}>
          <div className="factImgContainer">
            <Image src={fact4} className="factImg" />
          </div>

          <div className={`factRight flex justify-content start column ${language === "en" ? "" : "ar"}`}>
            <div className="factSmallText">Nearly</div>
            <div className="factLargeText">200K</div>
            <div className="factSmallText">SQM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactsHolder;

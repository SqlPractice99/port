import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import "../../../styles/utilities.css";
import Image from "../../base/image";
import iso from "../../../assets/images/iso.png";

const FooterTop = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const language = useSelector((state) => state.language.language);
  const listItems = [
    { text: "Shipping Agencies", arText: "الوكالات البحرية", href: "" },
    {
      text: "CMA Beirut Terminal",
      arText: "",
      href: "https://cma-beirut.com/",
    },
    {
      text: "Container Tracking",
      arText: "",
      href: "https://cma-beirut.com/trackAndTrace",
    },
    { text: "CAMA", arText: "", href: "https://cama.portdebeyrouth.com/CAMA/" },
    { text: "Banks", arText: "المصارف", href: "" },
  ];

  useEffect(() => {
    const preventDragHandler = (e) => {
      if (e.target.tagName === "IMG" || e.target.tagName === "A") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("dragstart", preventDragHandler);

    return () => {
      document.removeEventListener("dragstart", preventDragHandler);
    };
  }, []);

  const orderedList = language === "en" ? listItems : listItems.reverse();

  const FooterTopContent = () => [
    <div
      key="left"
      className={`leftFooterTop width-90 flex column ${
        language === "en" ? "" : "align-items-end"
      }`}
    >
      <div className="leftFooterTopUp">
        {language === "en" ? "Client Services" : "خدمة الزبائن"}
      </div>
      <div className={`leftFooterTopDown ${language==='en' ? '' : 'width-60'}`}>
        <ul className={`leftFooterTopList flex space-between ${language==='en' ? 'width-70' : 'width-100'}`}>
          {orderedList.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                target={item.href ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                {language === "ar" && item.arText !== ""
                  ? item.arText
                  : item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,

    <div key="right" className="rightFooterTop width-15">
      <div className="rightFooterTopContainer flex end">
        <Image src={iso} className="rightFooterTopImg" />
      </div>
    </div>,
  ];

  return (
    <div className="footerTop width-100">
      <div className="newSafeArea flex">
        {language === "en" ? FooterTopContent() : FooterTopContent().reverse()}
      </div>
    </div>
  );
};

export default FooterTop;

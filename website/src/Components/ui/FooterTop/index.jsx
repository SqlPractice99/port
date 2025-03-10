import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import "../../../styles/utilities.css";
import Image from "../../base/image";
import iso from "../../../assets/images/iso.png";

const FooterTop = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

  return (
    <div className="footerTop width-100">
      <div className="newSafeArea flex">
        <div className="leftFooterTop width-90 flex column">
          <div className="leftFooterTopUp">Client Services</div>
          <div className="leftFooterTopDown">
            <ul className="leftFooterTopList width-70 flex space-between">
              <li>
                <a href="" target="_self" rel="noopener noreferrer">Shipping Agencies</a>
              </li>
              <li>
                <a href="https://cma-beirut.com/" target="_blank" rel="noopener noreferrer">CMA Beirut Terminal</a>
              </li>
              <li>
                <a href="https://cma-beirut.com/trackAndTrace" target="_blank" rel="noopener noreferrer">Container Tracking</a>
              </li>
              <li>
                <a href="https://cama.portdebeyrouth.com/CAMA/" target="_blank" rel="noopener noreferrer">CAMA</a>
              </li>
              <li>
                <a href="" target="_self" rel="noopener noreferrer">Banks</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="rightFooterTop width-15">
          <div className="rightFooterTopContainer flex end">
            <Image src={iso} className="rightFooterTopImg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;

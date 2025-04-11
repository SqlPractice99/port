import React, { useState, useEffect } from "react";
import "./style.css";
import Image from "../../base/image";

import phone from "../../../assets/images/phone.png";
import location from "../../../assets/images/location.png";
import email from "../../../assets/images/email.png";
import socialMedia from "../../../assets/images/socialMedia.png";
import twitter from "../../../assets/images/twitter.png";
import facebook from "../../../assets/images/facebook.png";
import instagram from "../../../assets/images/instagram.png";
import linkedin from "../../../assets/images/linkedin.png";
import "../../../styles/utilities.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "../../../redux/selectedTab/selectedTabSlice";

import {
  clearDropDown,
  setDropDown,
} from "../../../redux/dropDown/dropDownSlice";

const Dropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);
  const language = useSelector((state) => state.language.language);
  // const [activeTab, setActiveTab] = useState(selectedTab);

  const handleTabClick = (tab, label) => {
    console.log("active: " + label);
    // setActiveTab(tab);
    const tabForRedux = label.replace(/-/g, " ");
    const tabForNavigate = tab.replace(/-/g, "");

    dispatch(setSelectedTab(tabForRedux));
    // console.log("selected: " + tabForRedux);
    // console.log("tab: " + tabForNavigate);
    navigate(`/${tabForNavigate}`);
  };

  // const selectedTab = useSelector((state) => state.selectedTab.selectedTab);

  // const openEmailOptions = (email) => {
  //   const options = [
  //     { name: "Gmail", url: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}` },
  //     { name: "Outlook", url: `https://outlook.office.com/mail/deeplink/compose?to=${email}` },
  //     { name: "Default Mail App", url: `mailto:${email}` }
  //   ];

  //   let choice = prompt("Choose an email client:\n1. Gmail\n2. Outlook\n3. Default Mail App");

  //   if (choice === "1") {
  //     window.open(options[0].url, "_blank");
  //   } else if (choice === "2") {
  //     window.open(options[1].url, "_blank");
  //   } else if (choice === "3") {
  //     window.location.href = options[2].url;
  //   }
  // };

  useEffect(() => {
    document.title = selectedTab
      ? `Port of Beirut | ${selectedTab}`
      : "Port of Beirut";
  }, [selectedTab]);

  // useEffect(() => {
  //   const preventDragHandler = (e) => {
  //     if (e.target.tagName === "IMG") {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener("dragstart", preventDragHandler);

  //   return () => {
  //     document.removeEventListener("dragstart", preventDragHandler);
  //   };
  // }, []);

  useEffect(() => {
    dispatch(setDropDown(true));

    return () => {
      dispatch(setDropDown(false));
    };
  }, []);

  const tabs = [
    { en: "Home", ar: "الصفحة الرئيسية" },
    { en: "About", ar: "عن المرفأ" },
    { en: "History", ar: "تاريخ المرفأ" },
    { en: "Tariffs", ar: "التعريفات" },
    { en: "Free-Zone", ar: "المنطقة الحرة" },
    { en: "Statistics", ar: "إحصائيات" },
    { en: "News", ar: "نشاطات المرفأ" },
    { en: "Tenders", ar: "المناقصات" },
    { en: "Contact-Us", ar: "اتصل بنا" },
  ];

  const Location = () => ({
    en: (
      <>
        Quarantaine region
        <br />
        POBOX. 1490
        <br />
        Beirut - Lebanon
      </>
    ),
    ar: (
      <>
        منطقة الكرنتينا
        <br />
        ص.ب: 1490
        <br />
        بيروت، لبنان
      </>
    ),
  });

  return (
    <div className="dropdown flex center">
      <div
        className={`dropdown-content flex width-100 ${
          language === "en" ? "" : "reverse"
        }`}
      >
        <div
          className={`dropdown-options width-45 ${
            language === "en" ? "borderRight" : "ar borderLeft"
          }`}
        >
          <ul>
            {tabs.map((tab, index) => {
              const label = language === "ar" ? tab.ar : tab.en;
              return (
                <li
                  key={index}
                  className={
                    selectedTab === label.replace(/-/g, " ")
                      ? "active-tab pointer"
                      : "pointer"
                  }
                  onClick={() => handleTabClick(tab.en, label)}
                >
                  {label.replace(/-/g, " ")}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="dropdown-info flex width-55 center">
          <ul
            className={`flex width-80 align-items-start space-between ${
              language === "en" ? "" : "reverse"
            }`}
          >
            <li className="flex column r-gap-20 center">
              <div className="info-imgs">
                <Image src={phone} className="info-phone" />
              </div>
              <div className="info-text">
                <div className="flex">
                  TEL: &nbsp;
                  <a
                    href="tel:+961 1 580211"
                    className="info-select info-phone-number pointer"
                  >
                    +961 1 580211
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="flex column r-gap-20 center">
                <div className="info-imgs flex">
                  <Image src={location} className="info-location" />
                </div>
                <div className="info-text">
                  <div>{Location()[language]}</div>
                </div>
              </div>
            </li>
            <li>
              <div className="flex column r-gap-20 center">
                <div className="info-imgs flex">
                  <Image src={email} className="info-email" />
                </div>
                <div className="info-text info-select pointer">
                  <a
                    href="mailto:info@portdebeyrouth.com"
                    target="_blank"
                    className="info-email-address"
                  >
                    info@portdebeyrouth.com
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="flex column r-gap-20 center">
                <div className="info-imgs flex width-100 center">
                  <Image src={socialMedia} className="info-socialMedia" />
                </div>
                <div className="info-socialMedia-imgs flex width-70 space-between">
                  <div className="socialMedia-imgs flex">
                    <a
                      href="https://x.com/portdebeyrouth?t=BHTIaQ4JR9l5qxe22TZf1Q"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-twitter flex"
                    >
                      <Image src={twitter} className="info-twitter" />
                    </a>
                  </div>
                  <div className="socialMedia-imgs flex">
                    <a
                      href="https://www.facebook.com/portdebeyrouth?mibextid=LQQJ4d"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-facebook flex"
                    >
                      <Image src={facebook} className="info-facebook" />
                    </a>
                  </div>
                  <div className="socialMedia-imgs flex">
                    <a
                      href="https://www.instagram.com/portdebeyrouth/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-instagram flex"
                    >
                      <Image src={instagram} className="info-instagram" />
                    </a>
                  </div>
                  <div className="socialMedia-imgs flex">
                    <a
                      href="https://www.linkedin.com/company/port-of-beirut"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-linkedin flex"
                    >
                      <Image src={linkedin} className="info-linkedin" />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import "../../../styles/utilities.css";
import Image from "../../base/image";
import fb from "../../../assets/images/footer/footer-fb.png";
import twitter from "../../../assets/images/footer/footer-twitter.png";
import instagram from "../../../assets/images/footer/footer-instagram.png";
import linkedin from "../../../assets/images/footer/footer-linkedin.png";
// import { useDispatch } from "react-redux";
// import { clearSelectedTab } from "../../../redux/selectedTab/selectedTabSlice";
// import axios from "axios";
import FooterTop from "../FooterTop";

const Footer = ({ removeFooterTop = false }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    // const token = localStorage.getItem("userToken");
    // setIsLoggedIn(!!token);

    const preventDragHandler = (e) => {
      if (e.target.tagName === "IMG" || e.target.tagName === "A") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("dragstart", preventDragHandler);

    const interval = setInterval(() => {
      setCurrentYear(new Date().getFullYear());
    }, 3600000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("dragstart", preventDragHandler);
    };
  }, []);

  return (
    <>
      {!removeFooterTop && <FooterTop />}
      <div className={`footer flex center ${removeFooterTop ? "fixed-bottom" : ""}`}>
        <div className={`footer-content flex ${language === "en" ? "" : "reverse"}`}>
          <div className={`leftFooter width-50 flex align-items ${language === "en" ? "" : "ar"}`}>
            {language === "en" ? (
              <>
                © {currentYear} Port of Beirut. All Rights Reserved. |{"\u00A0"}
              </>
            ) : (
              <>
                © {currentYear} مرفأ بيروت. كل الحقوق محفوظة. |{"\u00A0"}
              </>
            )}

            <a href="" className="pointer">
              {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
            </a>
          </div>

          <div className={`rightFooter width-50 flex ${language === "en" ? "end" : ""}`}>
            <ul className={`socialMediaListFooter width-20 flex space-between ${language === "en" ? "" : "reverse"}`}>
              <li>
                <a
                  href="https://www.facebook.com/portdebeyrouth?mibextid=LQQJ4d"
                  target="_blank"
                  className="footer-socialMedia-link"
                >
                  <div className="footer-socialMedia-container">
                    <Image
                      src={fb}
                      alt="FaceBook"
                      className="footer-socialMedia"
                    />
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/portdebeyrouth?t=BHTIaQ4JR9l5qxe22TZf1Q"
                  target="_blank"
                  className="footer-socialMedia-link"
                >
                  <div className="footer-socialMedia-container">
                    <Image
                      src={twitter}
                      alt="Twitter"
                      className="footer-socialMedia"
                    />
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/portdebeyrouth?igshid=MTIzZWMxMTBkOA=="
                  target="_blank"
                  className="footer-socialMedia-link"
                >
                  <div className="footer-socialMedia-container">
                    <Image
                      src={instagram}
                      alt="Instagram"
                      className="footer-socialMedia"
                    />
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/port-of-beirut"
                  target="_blank"
                  className="footer-socialMedia-link"
                >
                  <div className="footer-socialMedia-container">
                    <Image
                      src={linkedin}
                      alt="Linkedin"
                      className="footer-socialMedia"
                    />
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

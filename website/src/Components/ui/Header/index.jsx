import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import Image from "../../base/image";
import headerLogo from "../../../assets/images/port-logo.png";
import menuLogo from "../../../assets/images/menu.png";
import xMenuLogo from "../../../assets/images/x-menu.png";
import Dropdown from "../../ui/Dropdown";
import phone from "../../../assets/images/phone.png";
import location from "../../../assets/images/location.png";
import email from "../../../assets/images/email.png";
import socialMedia from "../../../assets/images/socialMedia.png";
import "../../../styles/utilities.css";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedTab } from "../../../redux/selectedTab/selectedTabSlice";
import {
  setDropDown,
  clearDropDown,
} from "../../../redux/dropDown/dropDownSlice";
import { setLanguage, clearLanguage } from "../../../redux/language/languageSlice";
import axios from "axios";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropDown = useSelector((state) => state.dropDown.dropDown);
  const language = useSelector((state) => state.language.language);

  const toggleMenu = () => {
    // console.log("hello");
    // console.log("dropDown is now changing to " + !dropDown)
    dispatch(setDropDown(!dropDown));
    setIsMenuOpen((prevState) => !prevState);
  };

  const toggleLanguage = () => {
    // console.log("hello");
    // setIsEnglish(language==='en' ? 'ar' : 'en');
    dispatch(setLanguage(language==='en' ? 'ar' : 'en'));
  };

  const handleAdminClick = async () => {
    if (isLoggedIn) {
      try {
        const userTokenJSON = localStorage.getItem("userToken");
        const userToken = JSON.parse(userTokenJSON);
        await axios.get("http://localhost:8000/api/logout", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        // if (response.data.status === "success") {
          localStorage.removeItem("userData");
          localStorage.removeItem("userToken");
          setIsLoggedIn(false);
          if (location.pathname !== "/Home") {
            navigate("/Home");
          }
        // }
        // window.location.href = "/Home";
      } catch (error) {
        console.error("Logout failed", error.response?.data || error.message);
      }
    } else {
      window.location.href = "/Login";
    }
  };

  const handleLogoClick = async (e) => {
    e.preventDefault();
    dispatch(clearSelectedTab());
    const userData = JSON.parse(localStorage.getItem("userData"));
    // console.log(userData)
    if (location.pathname === "/Home") {
      if (isLoggedIn) {
        if (userData.admin == 1) {
          navigate("/Admin");
        } else {
          navigate("/Publisher");
        }
      } else {
        window.location.reload();
      }
    } else {
      navigate("/Home");
    }
  };

  // const adjustDropdownHeight = () => {
  //   const header = document.querySelector('.header'); // Select the header
  //   const dropdown = document.querySelector('.dropdown'); // Select the dropdown

  //   if (header && dropdown) {
  //     // Get the height of the header (including padding and borders)
  //     const headerHeight = header.offsetHeight;

  //     // Set the dropdown height to 100vh minus the header height
  //     dropdown.style.height = `calc(100vh - ${headerHeight}px)`;
  // console.log(`calc(100vh - ${headerHeight}px)`)

  //   }
  // };

  // useEffect(() => {
  //   adjustDropdownHeight(); // Adjust on initial render
  //   window.addEventListener('resize', adjustDropdownHeight); // Adjust on resize
  //   // Clean up the event listener when the component is unmounted
  //   return () => {
  //     window.removeEventListener('resize', adjustDropdownHeight);
  //   };
  // }, [isMenuOpen]); // Re-run the effect when the menu opens/closes

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    // console.log("tokennnnnnn: " + token)
    setIsLoggedIn(!!token);

    const preventDragHandler = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("dragstart", preventDragHandler);

    return () => {
      document.removeEventListener("dragstart", preventDragHandler);
    };
  }, []);

  // useEffect(() => {
  //   console.log("Language is: " + language)
  // }, [language])

  return (
    <div className="header flex center">
      <div className="header-content flex center">
        <div className="login width-10 pointer" onClick={handleAdminClick}>
          {isLoggedIn ? "Logout" : "Login"}
        </div>
        <div className="flex width-55 end">
          <a
            href="localhost:3000/Home"
            target="_self"
            className="header-logo-link flex justify-content"
            onClick={handleLogoClick}
          >
            <div className="header-logo-container">
              <Image
                src={headerLogo}
                alt="Header Logo PortDeBeyrouth"
                className="header-logo"
              />
            </div>
          </a>
        </div>
        <div className="Lang-Menu flex width-45 end">
          <div className="lang flex align-items">
            <h4 className="pointer" onClick={toggleLanguage}>
              {language==='en' ? "AR" : "EN"}
            </h4>
          </div>
          <div className="menu">
            <div className="menuIcon" onClick={toggleMenu}>
              <Image
                src={isMenuOpen ? xMenuLogo : menuLogo}
                alt="Menu"
                className="menu-img pointer"
              />
            </div>
            {isMenuOpen && <Dropdown />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Header from "../../Components/ui/Header";
import axios from "axios";
import Footer from "../../Components/ui/Footer";
import {
  setSelectedTab,
} from "../../redux/selectedTab/selectedTabSlice";
import ContactUsBody from "../../Components/ui/ContactUsBody";

const ContactUs = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);
  const language = useSelector((state) => state.language.language);

  const tabLabel = language === "en" ? "Contact Us" : "اتصل بنا";

  useEffect(() => {
    document.title = selectedTab
      ? `Port of Beirut | ${tabLabel}`
      : "Port of Beirut";
    dispatch(setSelectedTab(tabLabel));
    // const preventDragHandler = (e) => {
    //   if (e.target.tagName === "IMG") {
    //     e.preventDefault();
    //   }
    // };

    // document.addEventListener("dragstart", preventDragHandler);

    // return () => {
    //   document.removeEventListener("dragstart", preventDragHandler);
    // };
  }, [tabLabel]);

  const fetchData = async () => {
    try {
      const formData = new FormData();
      formData.append("page", "home");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/data",
        formData
      );
      // console.log("Fetched data:");
      // console.log(response.data);
      setData(response.data);
      // if (data.length !== 0) {
      //   console.log("Data:");
      //   console.log(data.data);
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (data.length !== 0) {
  //       console.log("Data:");
  //       console.log(data.data[0]);
  //   }
  // }, [data]);

  return (
    <div className={`homeContainer flex column ${dropDown ? 'scrollbar' : ''}`}>
      <Header />
      <div className="pageLocationContainer width-100 flex center">
      <div
          className={`pageLocation flex justify-content-start ${
            language === "en" ? "" : "reverse"
          }`}
        >
          <div
            className="pageLocationHome flex"
            onClick={() => navigate("/Home")}
          >
            <div className="pointer">
              {language === "en" ? "Home" : "الصفحة الرئيسية"}
            </div>
          </div>
          &nbsp;.&nbsp;
          <div className="pageLocationTab">{selectedTab}</div>
        </div>
      </div>
      {data.length !== 0 ? (
        <div className="homeContent flex column">
          <ContactUsBody />
          {/* <FactsHolder /> */}
          {/* <FooterTop /> */}
        </div>
      ) : (
        <div className="loading flex center">Loading...</div>
      )}
      <Footer />
    </div>
  );
};

export default ContactUs;
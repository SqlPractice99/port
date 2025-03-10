import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Header from "../../Components/ui/Header";
// import axios from "axios";
// import FooterTop from "../../Components/ui/FooterTop";
import Footer from "../../Components/ui/Footer";
// import FactsHolder from "../../Components/ui/FactsHolder";
import TenderDetailsBody from "../../Components/ui/TenderDetailsBody";
import {
  setSelectedTab,
} from "../../redux/selectedTab/selectedTabSlice";

const TenderDetails = (item) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const tender = location.state?.tender;
  const from = location.state?.from;

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);

  useEffect(() => {
    if (!tender) {
      navigate("/");
    }
  }, [tender, navigate]);

  useEffect(() => {
    document.title = selectedTab ? `Port of Beirut | Tenders` : "Port of Beirut";
    dispatch(setSelectedTab("Tenders"));
    // const preventDragHandler = (e) => {
    //   if (e.target.tagName === "IMG") {
    //     e.preventDefault();
    //   }
    // };

    // document.addEventListener("dragstart", preventDragHandler);

    // return () => {
    //   document.removeEventListener("dragstart", preventDragHandler);
    // };
  }, [dispatch, selectedTab]);

  // const fetchData = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("language", "ar");

  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/tenders",
  //       formData
  //     );
  //     // console.log("Fetched data:");
  //     console.log(response.data.data);
  //     setData(response.data);
  //     // if (data.length !== 0) {
  //     //   console.log("Data:");
  //     //   console.log(data.data);
  //     // }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // useEffect(() => {
    // if (data.length !== 0) {
      //   console.log("Data:");
      //   console.log(data.data[0]);
    // }
  // }, [data]);

  // if (true)
  //   console.log(location.state?.tender)
  // console.log(location.state?.from)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!tender) return null;

  return (
    <div className={`homeContainer flex column ${dropDown ? 'scrollbar' : ''}`}>
      <Header />
      <div className="pageLocationContainer width-100 flex center">
        <div className="pageLocation width-95 flex">
          <div
            className="pageLocationHome pointer"
            onClick={() => navigate("/Home")}
          >
            Home .&nbsp;
          </div>
          <div className="pageLocationTab">{selectedTab}</div>
        </div>
      </div>
      {item.length !== 0 ? (
        <div className="homeContent flex column">
          <TenderDetailsBody item={item} />
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

export default TenderDetails;
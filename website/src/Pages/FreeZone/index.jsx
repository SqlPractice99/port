import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Header from "../../Components/ui/Header";
import FreeZoneBody from "../../Components/ui/FreeZoneBody";
import axios from "axios";
import Footer from "../../Components/ui/Footer";
import FactsHolder from "../../Components/ui/FactsHolder";
import {
  setSelectedTab,
} from "../../redux/selectedTab/selectedTabSlice";

const FreeZone = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);

  useEffect(() => {
    document.title = selectedTab ? `Port of Beirut | Free Zone` : "Port of Beirut";
    dispatch(setSelectedTab("Free Zone"));
    // const preventDragHandler = (e) => {
    //   if (e.target.tagName === "IMG") {
    //     e.preventDefault();
    //   }
    // };

    // document.addEventListener("dragstart", preventDragHandler);

    // return () => {
    //   document.removeEventListener("dragstart", preventDragHandler);
    // };
  }, []);

  const fetchData = async () => {
    try {
      const formData = new FormData();
      formData.append("page", "free zone");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/data",
        formData
      );
      // console.log("Fetched data:");
      // console.log(response.data.data);
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
    // if (data.length !== 0) {
      //   console.log("Data:");
      //   console.log(data.data[0]);
    // }
        // console.log(selectedTab);

  // }, []);

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
      {data.length !== 0 ? (
        <div className="homeContent flex column">
          <FreeZoneBody data={data.data} />
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

export default FreeZone;
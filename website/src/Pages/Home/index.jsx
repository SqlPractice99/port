import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Header from "../../Components/ui/Header";
import axios from "axios";
import FooterTop from "../../Components/ui/FooterTop";
import Footer from "../../Components/ui/Footer";
import FactsHolder from "../../Components/ui/FactsHolder";
import HomeBody from "../../Components/ui/HomeBody";
import {
  setSelectedTab,
} from "../../redux/selectedTab/selectedTabSlice";
import LoadingText from "../../Components/base/loadingText";

const Home = () => {
  const [data, setData] = useState([]);
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);

  useEffect(() => {
    document.title = selectedTab ? `Port of Beirut | Home` : "Port of Beirut";
    dispatch(setSelectedTab("Home"));
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
      formData.append('page', 'home');
      
      const response = await axios.post("http://127.0.0.1:8000/api/data", formData);
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
  //   console.log(dropDown);
  // }, [dropDown]);

  // useEffect(() => {
  //   if (data.length !== 0) {
  //     console.log("Data:");
  //     console.log(data.data[0]);
  //   }
  // }, [data]);

  return (
    <div className={`homeContainer flex column ${dropDown ? 'scrollbar' : ''}`}>
      <Header />
      {data.length !== 0 ? (
        <div className="homeContent flex column">
          <HomeBody data={data.data} />
          <FactsHolder />
          {/* <FooterTop /> */}
        </div>
      ) : (
        <LoadingText className={'loading'} />
      )}
      <Footer />
    </div>
  );
};

export default Home;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Header from "../../Components/ui/Header";
import axios from "axios";
import FooterTop from "../../Components/ui/FooterTop";
import Footer from "../../Components/ui/Footer";
import FactsHolder from "../../Components/ui/FactsHolder";
import NewsBody from "../../Components/ui/NewsBody";
import { setSelectedTab } from "../../redux/selectedTab/selectedTabSlice";

const News = () => {
  // const [visibleNews, setVisibleNews] = useState(6);
  // const [loading, setLoading] = useState(false);
  // const observer = useRef(null);
  // const lastNewsRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);
  const language = useSelector((state) => state.language.language);

  const tabLabel = language === "en" ? "News" : "نشاطات المرفأ";

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

  // Lazy loading function
  // useEffect(() => {
  //   if (!filteredNews || filteredNews.length <= visibleNews) return;

  //   const loadMoreNews = (entries) => {
  //     const target = entries[0];
  //     if (target.isIntersecting && !loading) {
  //       setLoading(true);
  //       setTimeout(() => {
  //         setVisibleNews((prev) => prev + 5); // Load 5 more news items
  //         setLoading(false);
  //       }, 1000);
  //     }
  //   };

  //   observer.current = new IntersectionObserver(loadMoreNews, {
  //     root: null,
  //     rootMargin: "0px",
  //     threshold: 1.0,
  //   });

  //   if (lastNewsRef.current) {
  //     observer.current.observe(lastNewsRef.current);
  //   }

  //   return () => observer.current?.disconnect();
  // }, [filteredNews, visibleNews]);

  // Lazy loading observer

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // useEffect(() => {
  // if (data.length !== 0) {
  // console.log("Data:");
  // console.log(data.data[0]);
  // }
  // }, [data]);

  useEffect(() => {
    // if ("scrollRestoration" in window.history) {
    //   window.history.scrollRestoration = "manual";
    // }

    window.scrollTo(0, 0);

    // console.log(data.data);
  }, []);

  return (
    <div className={`homeContainer flex column ${dropDown ? "scrollbar" : ""}`}>
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
      <div className="homeContent flex column">
        <NewsBody />
      </div>
      <Footer />
    </div>
  );
};

export default News;

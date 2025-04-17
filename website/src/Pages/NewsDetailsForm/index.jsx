import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Header from "../../Components/ui/Header";
import axios from "axios";
import Footer from "../../Components/ui/Footer";
import NewsDetailsFormBody from "../../Components/ui/NewsDetailsFormBody";
import {
  setSelectedTab,
} from "../../redux/selectedTab/selectedTabSlice";


import { Helmet } from "react-helmet-async";

const NewsDetailsForm = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [news, setNews] = useState(location.state?.news || null);

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);
  const language = useSelector((state) => state.language.language);
  const en = language==='en';
  const tabLabel = language === "en" ? "News" : "نشاطات المرفأ";

  useEffect(() => {
    document.title = selectedTab
      ? `Port of Beirut | ${tabLabel}`
      : "Port of Beirut";
    dispatch(setSelectedTab(tabLabel));
  }, [dispatch, selectedTab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

//   useEffect(() => {
//     console.log(encodedNews)
//     if (!location.state?.news) {
//       try {
//         const base64 = encodedNews.replace(/-/g, "+").replace(/_/g, "/"); 
//         const binaryString = atob(base64);
//         const utf8Bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
//         const now = JSON.parse(new TextDecoder().decode(utf8Bytes));
//         console.log("now:", now);

//         setNews(now);
//         sessionStorage.setItem("news", JSON.stringify(now));
//       } catch (error) {
//         console.error("Invalid news data:", error);
//       }
//     }
//   }, [encodedNews]);


  useEffect(() => {
    console.log('location.state?.news')
    console.log(location.state?.news)
  }, [])

  return (
    <div className={`homeContainer flex column ${dropDown ? 'scrollbar' : ''}`}>
      <Header />
      {news && (
      <Helmet>
        <meta property="og:title" content={news.enTitle || news.title} />
        <meta property="og:description" content={news.enContent || news.content} />
        <meta property="og:image" content={`http://localhost:8000/api/${news.coverImg}`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      )}
      <div className="pageLocationContainer width-100 flex center">
        <div className={`pageLocation width-95 flex ${language === 'ar' ? 'justify-content-end' : ''}`}>
          <div className={`${language === 'ar' ? 'ar' : ''} flex`}>
            <div
              className="pageLocationHome pointer"
              onClick={() => navigate("/Home")}
            >
              {language === 'en' ? 'Home' : 'الصفحة الرئيسية'}.&nbsp;
            </div>
            <div className="pageLocationTab">{en ? selectedTab : 'أخبار'}</div>
          </div>
        </div>
      </div>
      {news && news.length !== 0 ? (
        <div className="homeContent flex column">
          <NewsDetailsFormBody />
        </div>
      ) : (
        <div className="loading flex center">Loading...</div>
      )}
      <Footer />
    </div>
  );
};

export default NewsDetailsForm;
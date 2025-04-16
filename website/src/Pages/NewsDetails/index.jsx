import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import Header from "../../Components/ui/Header";
import axios from "axios";
// import FooterTop from "../../Components/ui/FooterTop";
import Footer from "../../Components/ui/Footer";
// import FactsHolder from "../../Components/ui/FactsHolder";
import NewsDetailsBody from "../../Components/ui/NewsDetailsBody";
import {
  setSelectedTab,
} from "../../redux/selectedTab/selectedTabSlice";


import { Helmet } from "react-helmet-async"; // or use react-helmet

const NewsDetails = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [news, setNews] = useState(location.state?.news || null);
  // const { slug } = useParams();
  const { encodedNews } = useParams(); // Get encoded news from URL

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dropDown = useSelector((state) => state.dropDown.dropDown);
  const language = useSelector((state) => state.language.language);
  const en = language==='en';
  const tabLabel = language === "en" ? "News" : "نشاطات المرفأ";

  // const base64UrlDecode = (str) => {
  //   if (!str) return null;
  //   str = str.replace(/-/g, "+").replace(/_/g, "/"); // Convert back to standard Base64
  //   try {
  //     return decodeURIComponent(atob(str));
  //   } catch (error) {
  //     console.error("Decoding error:", error);
  //     return null;
  //   }
  // };

  // const decodedNews = JSON.parse(base64UrlDecode(encodedNews));


  // useEffect(() => {
  // console.log("news")
  // console.log(news)
  // if (!news) {
  //   navigate("/");
  // }
  // }, [news, navigate]);

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
  }, [dispatch, selectedTab]);

  // const fetchData = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("language", "ar");

  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/news",
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
  //   console.log(location.state?.news)
  // console.log(location.state?.from)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //   useEffect(() => {
  //     axios.get(`/api/news/${slug}`)
  //         .then(response => setNews(response.data))
  //         .catch(error => console.error("Error fetching news:", error));

  //         console.log("slug")
  //         console.log(slug)
  // }, [slug]);

  useEffect(() => {
    console.log(encodedNews)
    if (!location.state?.news) {
      try {
        const base64 = encodedNews.replace(/-/g, "+").replace(/_/g, "/"); // Convert back to Base64
        const binaryString = atob(base64); // Decode Base64
        const utf8Bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0)); // Convert to UTF-8
        const now = JSON.parse(new TextDecoder().decode(utf8Bytes)); // Parse JSON
        // First decode the URL encoding
        // const urlDecoded = decodeURIComponent(encodedNews);
        console.log("now:", now);

        // Second decode the URL-encoded string (which should now be Base64)
        // const secondUrlDecoded = decodeURIComponent(urlDecoded);
        // console.log("Double URL-decoded:", secondUrlDecoded);

        // Now Base64 decode
        // const base64Decoded = atob(secondUrlDecoded);
        // console.log("Base64-decoded:");
        // console.log(typeof (base64Decoded));

        // Finally, parse JSON
        // const parsedNews = JSON.parse(decodeURIComponent(base64Decoded));
        // console.log("Parsed JSON:", parsedNews);

        setNews(now);
        sessionStorage.setItem("news", JSON.stringify(now));
      } catch (error) {
        console.error("Invalid news data:", error);
      }
    }
  }, [encodedNews]);


  useEffect(() => {
    console.log('location.state?.news')
    console.log(location.state?.news)
  }, [])

  // if (!news) return null;

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
          <NewsDetailsBody />
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

export default NewsDetails;
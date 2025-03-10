import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../base/image";
import NewsImg from "../../../assets/images/news.png";
// import NewsCover from "../../../assets/images/tenderCover.png";
import ReactDOMServer from "react-dom/server";
import FontFaceObserver from "fontfaceobserver";
import axios from "axios";
import { useInView } from "react-intersection-observer"; // Lazy loading
import _ from "lodash"; // Lodash for debouncing

const NewsBody = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [originalData, setOriginalData] = useState(null); // Store the initial data
  const navigate = useNavigate();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("userToken"));
  const language = useSelector((state) => state.language.language);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    // console.log("Selected option:", event.target.value);
  };

  useEffect(() => {
    if (data.length > 0 && originalData === null && searchQuery === "") {
      setOriginalData(data);
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    }
  }, [data]);

  // useEffect(() => {
  // console.log(Object.keys(originalData).length)

  // }, [originalData]);

  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };
  let lastRequestTime = useRef(null);


  // Debounce function using Lodash (better optimization)
  const debouncedSearch = _.debounce(async (query) => {
    // console.log(query)
    const currentTime = Date.now(); // Get current timestamp in milliseconds

    if (lastRequestTime.current) {
      const timeDiff = currentTime - lastRequestTime.current;
      console.log(`Time since last request: ${timeDiff / 1000} s`);
    }
    // console.log('nooooooo: ' + lastRequestTime.current);

    lastRequestTime.current = currentTime; // Update last request time
    // console.log('yes now: ' + lastRequestTime.current);
    if (query.trim() === "") {
      if (originalData && originalData.length > 0) {
        setData(originalData); // Restore only if data exists
        console.log("originalData"); // Restore only if data exists
        console.log(originalData); // Restore only if data exists
        console.log('page: ' + page); // Restore only if data exists
        console.log('hasmore: ' + hasMore); // Restore only if data exists
      }

      setPage(2);
      setHasMore(true);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("language", language);
      formData.append("title", query);

      const response = await axios.post("http://127.0.0.1:8000/api/search", formData);
      setData(response.data.data); // Update news list with search results
      // console.log('eeeeeeeeeeeeee')
      // console.log(response.data.data)
      setHasMore(false); // Disable infinite scroll for search
    } catch (error) {
      console.error("Error fetching search results:", error);
    }

    setLoading(false);
  }, 1500); // Wait 500ms before making an API request

  // Call debounced function when `searchQuery` changes
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel(); // Cleanup function to avoid unnecessary calls
  }, [searchQuery]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setLoading(true);
    setSearchQuery(query);
    // setData([]); // Clear current news
    // setPage(1); // Reset pagination
    // setHasMore(true); // Enable fetching

    // if (query.trim() === "") return; // Avoid empty queries

    // try {
    //   const formData = new FormData();
    //   formData.append("language", language);
    //   formData.append("title", query);

    //   const response = await fetch("http://127.0.0.1:8000/api/search", {
    //     method: "POST",
    //     body: formData,
    //   });

    //   const result = await response.json();
    //   setData(result.data); // Update with new search results
    //   console.log('result.data')
    //   console.log(result.data)
    //   setHasMore(false); // Disable infinite scrolling since it's a search result
    // } catch (error) {
    //   console.error("Error fetching search results:", error);
    // }
  };

  const handleNewsClick = (item) => {
    // console.log("pressed.");
    // console.log(item);
    navigate("/NewsDetails", {
      state: { news: item, from: location.pathname },
    });
    // console.log("transferred");
  };

  useEffect(() => {
    // if ("scrollRestoration" in window.history) {
    //   window.history.scrollRestoration = "manual";
    // }

    // window.scrollTo(0, 0);

    // console.log(data.data);
  }, []);

  useEffect(() => {
    console.log('dataaaaaa');
    console.log(data);
  }, [data]);

  // let filteredNews = [];
  // useEffect(() => {
  //   // console.log("searchQuery", searchQuery.trim() === "");
  //   console.log(data);
  //   if (searchQuery.trim() !== "") {
  //     filteredNews = data?.filter((item) =>
  //     (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.enTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  //     );
  //   } else {
  //     filteredNews = data;
  //   }
  // }, [searchQuery])

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const fetchData = async (page) => {
    if (!hasMore) return;

    try {
      const formData = new FormData();
      formData.append("language", "ar");
      formData.append("page", page);
      formData.append("per_page", 6); // Request only 6 items

      const response = await axios.post(
        "http://127.0.0.1:8000/api/news",
        formData
      );

      // Append new data while keeping previous ones
      setData((prevNews) => [...prevNews, ...response.data.data]);

      // Stop fetching if there's no more data
      setHasMore(response.data.next_page_url !== null);

      // console.log("Fetched data:");
      // console.log(response.data.data);

      // setData(response.data);

      //     // if (data.length !== 0) {
      //     //   console.log("Data:");
      //     //   console.log(data.data);
      //     // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when `page` changes
  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Increase page number when user scrolls to the bottom
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]);

  // useEffect(() => {

  //   // Font loading check
  //   const font = new FontFaceObserver("Almarai"); // Replace 'YourFontFamily' with the name of the font you want to check

  //   font
  //     .load()
  //     .then(() => {
  //       console.log("Font has been loaded and applied!");
  //     })
  //     .catch(() => {
  //       console.log("Font failed to load");
  //     });

  //   // Optionally, check the applied font using window.getComputedStyle
  //   const element = document.querySelector(".newsListTitle"); // or any other element where you expect the font to be applied
  //   const fontFamily = window.getComputedStyle(element).fontFamily;
  //   console.log("Applied font on newsListTitle:", fontFamily);
  // }, []);

  const aboutContent = [
    <div key='left' className="aboutContainerLeft width-50 flex center">
      <div className="aboutContainerText flex">{language === 'en' ? "News" : "نشاطات المرفأ"}</div>
    </div>,

    <div key='right' className="aboutContainerRight flex center column width-50">
      <Image
        src={NewsImg}
        alt="News of Port of Beirut"
        title={"PORT OF BEIRUT"}
        className="aboutPageImg flex center"
      />
    </div>,
  ]

  return (
    <>
      <div className="aboutContainer width-100 flex">
        {language === "ar" ? aboutContent : aboutContent.reverse()}
      </div>

      <div className="width-100 flex center">
        <div className="newsBody flex align-items column">
          <div className="newsButtonContainer">
            <div className="newsButton pointer">
              {language === 'en' ? "News" : "نشاطات المرفأ"}
            </div>
          </div>

          {/* Search Bar */}
          {token ? (
            <input
              type="text"
              placeholder={language === 'en' ? "Search news by title..." : "...البحث من خلال العنوان"}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e)}
              className={`newsSearchBar ${language === 'ar' ? 'ar' : ''}`}
            />
          ) : <></>}

          <div className={`width-100 ${language === 'ar' ? 'ar' : ''}`}>
            {Array.isArray(data) && data.length && !loading > 0 ? (
              <ul className="newsList width-100 flex wrap r-gap-30">
                {data
                  .filter(item => language === 'en' ? (item.enTitle && item.enContent) : (item.title && item.content)) // Filter based on language
                  .map((item, index) => (
                    <li key={index}>
                      <div className="newsListSection">
                        <Image
                          src={`http://localhost:8000/${item.coverImg}`}
                          alt="News Cover"
                          title={language === 'en' ? item.enTitle : item.title}
                          className="newsListImg pointer"
                          onClick={() => handleNewsClick(item)}
                        />

                        <div className="newsListDate flex">
                          {new Intl.DateTimeFormat("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(new Date(item.created_at))}
                        </div>

                        <div
                          className="newsListTitle pointer"
                          onClick={() => handleNewsClick(item)}
                        >
                          {language === 'en' ? item.enTitle : item.title}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <></>
            )}
          </div>

          {/* Lazy Load Trigger */}
          {hasMore && !loading && <div ref={ref} className="loadingNews flex justify-content">{language === 'en' ? 'Loading more news...' : '...تحميل المزيد من الأخبار'}</div>}
          {loading && <div className="noNews flex justify-content">{language === 'en' ? 'Searching for news...' : '...تحميل المزيد من الأخبار'}</div>}
          {data.length === 0 && !loading && <div className="noNews flex justify-content">{language === 'en' ? 'No news found' : 'لم يتم العثور على أخبار'}</div>}
        </div>
      </div>
    </>
  );
};

export default NewsBody;
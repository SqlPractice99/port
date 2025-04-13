import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../base/image";
import NewsImg from "../../../assets/images/news.png";
import ReactDOMServer from "react-dom/server";
import FontFaceObserver from "fontfaceobserver";
import axios from "axios";
import { useInView } from "react-intersection-observer"; 
import _ from "lodash";
import LoadingText from "../../base/loadingText";

const NewsBody = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("userToken"));
  const language = useSelector((state) => state.language.language);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  let lastRequestTime = useRef(null);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    if (data.length > 0 && originalData === null && searchQuery === "") {
      setOriginalData(data);
    }
  }, [data]);

  const debouncedSearch = _.debounce(async (query, SearchPage = 1) => {
    const currentTime = Date.now();

    if (lastRequestTime.current) {
      const timeDiff = currentTime - lastRequestTime.current;
      console.log(`Time since last request: ${timeDiff / 1000} s`);
    }

    lastRequestTime.current = currentTime;
    if (query.trim() === "") {
      if (originalData && originalData.length > 0) {
        setData(originalData);
      }

      setPage(2);
      setHasMore(true);
      setSearching(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("language", language);
      formData.append("title", query);
      formData.append("page", SearchPage);
      formData.append("per_page", 6);

      const response = await axios.post("http://127.0.0.1:8000/api/search", formData);
      
      setData((prevNews) => [...prevNews, ...response.data.data.data]);

      console.warn('hasMore', response.data.data.next_page_url)
      setHasMore(response.data.data.next_page_url !== null);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }

    setSearching(false);
  }, 1000);

  useEffect(() => {
    setSearchPage(1);
    debouncedSearch(searchQuery, 1);
    return () => debouncedSearch.cancel(); 
  }, [searchQuery]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setData([]);
    setSearching(true);
    setSearchQuery(query);
  };

  const handleNewsClick = (item) => {
    navigate("/NewsDetails", {
      state: { news: item, from: location.pathname },
    });
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const fetchData = async (page) => {
    if (!hasMore) return;

    if(data.length === 0){
      setLoading(true);
    }

    try {
      const formData = new FormData();
      formData.append("language", "ar");
      formData.append("page", page);
      formData.append("per_page", 6);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/news",
        formData
      );

      setData((prevNews) => [...prevNews, ...response.data.data]);

      setHasMore(response.data.next_page_url !== null);
      
      if(response.status === 200){
        setLoading(false);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    if (inView && hasMore) {
      if (searchQuery.trim()) {
        setSearchPage((prev) => {
          const nextPage = prev + 1;
          debouncedSearch(searchQuery, nextPage);
          return nextPage;
        });
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [inView, hasMore]);

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
            {Array.isArray(data) && data.length > 0 && !loading ? (
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
              <>
                {searching && <div className="noNews flex justify-content">{language === 'en' ? 'Searching for news...' : '...تحميل المزيد من الأخبار'}</div>}
                {data.length === 0 && !loading && !hasMore && !searching && <div className="noNews flex justify-content">{language === 'en' ? 'No news found' : 'لم يتم العثور على أخبار'}</div>}
                {loading && (<LoadingText className={'loading'} />)}
              </>
            )}
          </div>

          {hasMore && !loading && !searching && <div ref={ref} className="loadingNews flex justify-content">{language === 'en' ? 'Loading more news...' : '...تحميل المزيد من الأخبار'}</div>}
        </div>
      </div>
    </>
  );
};

export default NewsBody;
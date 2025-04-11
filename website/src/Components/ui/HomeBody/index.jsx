import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../../Components/base/image";
import homeImg from "../../../assets/images/porthome.jpg";
import homeList from "../../../assets/images/home-list.png";
import axios from "axios";

const HomeBody = (data) => {
  //   const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [news, setNews] = useState([]);
  let contentLang0;
  let contentLang1;
  const language = useSelector((state) => state.language.language);

  //   const dispatch = useDispatch();

  //   const selectedTab = useSelector((state) => state.selectedTab.selectedTab);

  // useEffect(() => {
  // const preventDragHandler = (e) => {
  //   if (e.target.tagName === "IMG") {
  //     e.preventDefault();
  //   }
  // };
  // document.addEventListener("dragstart", preventDragHandler);
  // return () => {
  //   document.removeEventListener("dragstart", preventDragHandler);
  // };
  // }, []);

  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://127.0.0.1:8000/api/data");
  //       console.log("Fetched data:");
  //       console.log(response.data);
  //       setData(response.data);
  //       if (data.length != 0) {
  //         console.log("Data:");
  //         console.log(data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  useEffect(() => {
    fetchNews();
  }, []);

  // useEffect(() => {
  // if (data.length != 0) {
  // console.log("Data:");
  // console.log(data);
  // }
  // }, [data]);

  const fetchNews = async () => {
    try {
      const formData = new FormData();
      formData.append("language", "ar");
      formData.append("page", 1);
      formData.append("per_page", 3);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/news",
        formData
      );

      setNews(response.data.data);

      console.log("Fetched data:");
      // console.log(response.data.data);
      console.log(data);

      // setData(response.data);

      //     // if (data.length !== 0) {
      //     //   console.log("Data:");
      //     //   console.log(data.data);
      //     // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNewsClick = (item) => {
    navigate("/NewsDetails", {
      state: { news: item, from: location.pathname },
    });
  };

  const items = [
    {
      en: "Cama",
      ar: "كاما",
      type: "external",
      link: "https://cama.portdebeyrouth.com/CAMA/",
    },
    {
      en: "News",
      ar: "النشاطات",
      type: "internal",
      route: "/News",
    },
    {
      en: "Tenders",
      ar: "المناقصات",
      type: "internal",
      route: "/Tenders",
    },
    {
      en: "Statistics",
      ar: "احصائيات",
      type: "internal",
      route: "/Statistics",
    },
  ];

  return (
    <>
      <div className="imgContainer flex align-items-start justify-content">
        <Image
          src={homeImg}
          alt="Port Of Beirut"
          title="PORT OF BEIRUT"
          className="homePageImg flex center"
        />

        <div className="list-img flex align-items-end c-gap-20">
          <div className="homeListImgContainer flex align-items">
            <Image src={homeList} className="homeListImg" />
          </div>

          <div className="optionsListContainer flex">
            <ul
              className={`optionsList pointer ${language === "en" ? "" : "ar"}`}
            >
              {items.map((item, i) => (
                <li key={i}>
                  {item.type === "external" ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer"
                    >
                      {language === "ar" ? item.ar : item.en}
                    </a>
                  ) : (
                    <span
                      className="pointer"
                      onClick={() => navigate(item.route)}
                    >
                      {language === "ar" ? item.ar : item.en}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {data.length != 0 ? (
        <div className="homeContentBody">
          <div
            className={`news flex column center ${
              language === "en" ? "" : "ar"
            }`}
          >
            <div className="news flex column center">
              <div className="newsTitle">
                {language === "en" ? data.data[0].title : data.data[0].arTitle}
              </div>
              <div className="newsSubTitle">
                {language === "en"
                  ? data.data[0].sub_title
                  : data.data[0].arSub_title}
              </div>
              <div className="newsContent">
                {data.data[0][
                  `${language === "en" ? "content" : "arContent"}`
                ] &&
                  data.data[0][`${language === "en" ? "content" : "arContent"}`]
                    .split(/ - /)
                    .map((segment, index, arr) => {
                      if (index === arr.length - 1 && arr.length > 1) {
                        return (
                          <React.Fragment key={index}>
                            <a
                              href={`http://127.0.0.1:8000/${data.data[0].dwnld_material}`}
                              target="_blank"
                              className="content2 pointer"
                            >
                              {segment}
                            </a>
                            <br />
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment key={index}>
                            {segment}
                            {index !== arr.length - 1 && <br />}
                            {index !== arr.length - 1 && (
                              <>
                                <div className="dashContainer">
                                  <a
                                    href={`http://127.0.0.1:8000/${data.data[0].dwnld_material}`}
                                    target="_blank"
                                    className="dash"
                                  >
                                    -
                                  </a>
                                </div>
                              </>
                            )}
                          </React.Fragment>
                        );
                      }
                    })}
                <div className="learnMoreBtn">
                  <a
                    href={`http://127.0.0.1:8000/${data.data[0].dwnld_material}`}
                    className="learnMore"
                  >
                    {language === "en" ? "Learn More" : "للمزيد"}
                  </a>
                </div>
              </div>
              <Image
                src={`http://127.0.0.1:8000/${data.data[0].image}`}
                className="newsImg"
              />
            </div>
            <div className="news flex column center">
              <div className="newsTitle">
                {language === "en" ? data.data[1].title : data.data[1].arTitle}
              </div>
              <div className="newsSubTitle">
                {language === "en"
                  ? data.data[1].sub_title
                  : data.data[1].arSub_title}
              </div>
              <div className="newsContent2">
                {data.data[1][
                  `${language === "en" ? "content" : "arContent"}`
                ] &&
                  data.data[1][`${language === "en" ? "content" : "arContent"}`]
                    .replace(/\. /g, ".<br/>")
                    .split("<br/>")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
              </div>
            </div>

            <div className="homeNews flex column justify-content-start">
              <h2 className="homeNewsTitle">
                {language === "en" ? "News" : "الأخبار"}
              </h2>

              {Array.isArray(news) && news.length > 0 ? (
                <ul className="newsList width-100 flex wrap r-gap-30">
                  {news
                    .filter((item) =>
                      language === "en"
                        ? item.enTitle && item.enContent
                        : item.title && item.content
                    ) // Filter based on language
                    .map((item, index) => (
                      <li key={index}>
                        <div className="newsListSection">
                          <Image
                            src={`http://localhost:8000/${item.coverImg}`}
                            alt="News Cover"
                            title={
                              language === "en" ? item.enTitle : item.title
                            }
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
                            {language === "en" ? item.enTitle : item.title}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <></>
              )}

              <div className="allNewsBtn flex justify-content">
                <a href='/news'>
                  {language==='en' ? 'See All' : 'مشاهدة الكل'}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default HomeBody;

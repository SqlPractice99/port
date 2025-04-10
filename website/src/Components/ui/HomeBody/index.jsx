import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";
import Image from "../../../Components/base/image";
import homeImg from "../../../assets/images/porthome.jpg";
import homeList from "../../../assets/images/home-list.png";
import axios from "axios";

const HomeBody = (data) => {
  //   const [data, setData] = useState([]);
  const navigate = useNavigate();
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

  //   useEffect(() => {
  //     fetchData();
  //   }, []);

  // useEffect(() => {
  // if (data.length != 0) {
  // console.log("Data:");
  // console.log(data);
  // }
  // }, [data]);

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
            <ul className="optionsList pointer">
              <li>
                <a
                  href="https://cama.portdebeyrouth.com/CAMA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer"
                >
                  Cama
                </a>
              </li>
              <li>
                <span className="pointer" onClick={() => navigate("/News")}>
                  News
                </span>
              </li>
              <li>
                <span className="pointer" onClick={() => navigate("/Tenders")}>
                  Tenders
                </span>
              </li>
              <li><span className="pointer" onClick={() => navigate("/Statistics")}>
                Statistics
              </span></li>
            </ul>
          </div>
        </div>
      </div>

      {data.length != 0 ? (
        <div className="homeContentBody">
          <div className="news flex column center">
            <div className="news flex column center">
              <div className="newsTitle">{language==='en' ? data.data[0].title : data.data[0].arTitle}</div>
              <div className="newsSubTitle">{language==='en' ? data.data[0].sub_title : data.data[0].arSub_title}</div>
              <div className="newsContent">
                {contentLang0 = language==='en' ? data.data[0].content : data.data[0].arContent}
                {contentLang0 &&
                  contentLang0
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
                    {language==='en' ? 'Learn More' : 'للمزيد'}
                  </a>
                </div>
              </div>
              <Image
                src={`http://127.0.0.1:8000/${data.data[0].image}`}
                className="newsImg"
              />
            </div>
            <div className="news flex column center">
              <div className="newsTitle">{language==='en' ? data.data[1].title : data.data[1].arTitle}</div>
              <div className="newsSubTitle">{language==='en' ? data.data[1].sub_title : data.data[1].arSub_title}</div>
              <div className="newsContent2">
              {contentLang1 = language==='en' ? data.data[1].content : data.data[1].arContent}
                {contentLang1 &&
                  contentLang1
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
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default HomeBody;
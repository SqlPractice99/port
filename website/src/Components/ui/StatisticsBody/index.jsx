import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import "./styles.css";
import Image from "../../../Components/base/image";
import statisticsImg from "../../../assets/images/statistics.png";
import ReactDOMServer from "react-dom/server";
// import axios from "axios";

const StatisticsBody = (data) => {
  const [choices] = useState(
    data.data[0].content
      .split("<op>")
      .map((choice) => choice.trim())
      .filter((choice) => choice !== "")
  );
  const [selectedOption, setSelectedOption] = useState("");
  const language = useSelector((state) => state.language.language);
  const en = (language==='en');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected option:", event.target.value);
  };

  useEffect(() => {
    console.log(choices);
  }, []);

  return (
    <>
      <div className={`aboutContainer width-100 flex ${en ? '' : 'reverse'}`}>
        <div className="aboutContainerLeft width-50 flex center">
          <div className="aboutContainerText flex">{en ? 'Statistics' : 'إحصائيات'}</div>
        </div>

        <div className="aboutContainerRight width-50">
          <Image
            src={statisticsImg}
            alt="Statistics of Port of Beirut"
            title="PORT OF BEIRUT"
            className="aboutPageImg flex center"
          />
        </div>
      </div>

      {data.length !== 0 ? (
        <div className="width-100 flex center">
          <div className={`statisticsBody flex column ${en ? 'align-items-start' : 'align-items-end'}`}>
            <label className="statisticsOptionsLabel">{en ? 'Report Type' : 'نوع التقرير'}</label>
            <div className={`flex c-gap-10 ${en ? '' : 'reverse'}`}>
              <select
                name="statisticsOptions"
                className={`statisticsOptionsSelect width-75 ${en ? '' : 'ar'}`}
                value={selectedOption}
                onChange={handleChange}
                required
              >
                <option value="" className="statisticsOptionsList">
                  {en ? 'Select Report Type' : 'اختر نوع التقرير'}
                </option>
                {choices.map((choice, index) => (
                  <option
                    key={index}
                    value={choice}
                    className="statisticsOptionsList"
                  >
                    {choice}
                  </option>
                ))}
              </select>

              <div className="statisticsSearch pointer">{en ? 'Search' : 'بحث'}</div>
            </div>

            {/* {data.data.map((item, index) => {
            return (
              <div
                key={index}
                className={`aboutContentBody width-100 flex center ${
                  index % 2 === 0 ? "white-bg" : "grey-bg"
                }`}
              >
                <div className="aboutNews width-100 flex space-between">
                  {index % 2 === 0 ? (
                    <>
                      <div className="img-content-left width-50 flex">
                        <Image
                          src={`http://127.0.0.1:8000/${item.image}`}
                          className="aboutNewsImg"
                        />
                      </div>
                      <div className="img-content-right flex align-items">
                        <div className="about-title-content flex column">
                          <div className="aboutNewsTitle">{item.title}</div>
                          <div className="aboutNewsContent">
                            {parseContent(item.content)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="img-content-right flex align-items">
                        <div className="about-title-content flex column">
                          <div className="aboutNewsTitle">{item.title}</div>
                          <div className="aboutNewsContent">
                            {parseContent(item.content)}
                          </div>
                        </div>
                      </div>
                      <div className="img-content-left width-50 flex justify-content-end">
                        <Image
                          src={`http://127.0.0.1:8000/${item.image}`}
                          className="aboutNewsImg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })} */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default StatisticsBody;

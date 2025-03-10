import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
// import Image from "../../Components/base/image";
import LoginForm from "../../Components/ui/LoginForm";
// import homeImg from "../../assets/images/porthome.jpg";
// import homeList from "../../assets/images/home-list.png";
import {
  clearSelectedTab,
  setSelectedTab,
} from "../../redux/selectedTab/selectedTabSlice";
import axios from "axios";

const Login = ({ userD, setUserD, userT, setUserT }) => {
  //   const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);

  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://127.0.0.1:8000/api/show");
  //       console.log("Fetched data:", response.data);
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  useEffect(() => {
    document.title = selectedTab ? `Port of Beirut | Login` : "Port of Beirut";
    dispatch(setSelectedTab("Login"));
  }, []);

//   useEffect(() => {
//     fetchData();
//   }, []);

  return (
    <div className="loginContainer flex">
        {/* <LoginForm /> */}
        <LoginForm userD={userD} setUserD={setUserD} userT={userT} setUserT={setUserT} />
    </div>
  );
};

export default Login;
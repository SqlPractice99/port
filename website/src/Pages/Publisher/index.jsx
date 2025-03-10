import React, { useState, useEffect } from "react";
// import Input from "../../base/input";
import "./styles.css";
import Header from "../../Components/ui/Header";
// import Image from "../../base/image";
// import logoPic from "../../../assets/images/login-logo.png";
// import Button from "../../base/button";
// import visible from "../../../assets/images/visible.png";
// import notVisible from "../../../assets/images/notVisible.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import { setUser, setUserToken } from "../../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import {
    clearSelectedTab,
    setSelectedTab,
  } from "../../redux/selectedTab/selectedTabSlice";
import LoginForm from "../../Components/ui/LoginForm";
import Footer from "../../Components/ui/Footer";

const Publisher = () => {
  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  // const [inputValues, setInputValues] = useState({});
  // const [passwordVisible, setPasswordVisible] = useState(false);
  // const [eye, setEye] = useState(notVisible);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const togglePasswordVisibility = () => {
  //   if (!passwordVisible) {
  //     setEye(visible);
  //   } else {
  //     setEye(notVisible);
  //   }

  //   setPasswordVisible(!passwordVisible);
  // };

  // const handleLogin = async () => {
  //   try {
  //     const dataForm = {
  //       username: inputValues["username"],
  //       password: inputValues["password"],
  //     };
  //     const response = await axios.post(
  //       "http://localhost:8000/api/login",
  //       dataForm
  //     );

  //     const userData = response.data.data;
  //     const userToken = response.data.data.token;
  //     if (response.data.data.role != 3) {
  //       const userDataJSON = JSON.stringify(userData);
  //       const userTokenJSON = JSON.stringify(userToken);

  //       localStorage.setItem("userData", userDataJSON);
  //       localStorage.setItem("userToken", userTokenJSON);
  //       dispatch(setUser(userData));
  //       dispatch(setUserToken(userToken));

  //       navigate("/Home");
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  // const handleInputChange = (label, value) => {
  //   setInputValues((prevInputValues) => {
  //     const updatedInputValues = { ...prevInputValues, [label]: value };
  //     return updatedInputValues;
  //   });
  // };

  useEffect(() => {
    document.title = selectedTab ? `Port of Beirut | Publisher` : 'Port of Beirut';
    dispatch(setSelectedTab("Publisher"));
  }, []);

  return (
    <div className="publisherContainer flex column">
      <Header />
      <div className="flex center">
        <h2>Hello Publisher</h2>
      </div>
      <Footer />
    </div>
  );
};

export default Publisher;
import React, { useState, useEffect, useRef } from "react";
import Input from "../../base/input";
import "./styles.css";
import Image from "../../base/image";
import logoPic from "../../../assets/images/login-logo.png";
import Button from "../../base/button";
import visible from "../../../assets/images/visible.png";
import notVisible from "../../../assets/images/notVisible.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserToken } from "../../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ userD, setUserD, userT, setUserT }) => {
  const [inputValues, setInputValues] = useState({});
  // const [passwordVisible, setPasswordVisible] = useState(false);
  const [eye, setEye] = useState(notVisible);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user =  useSelector((state) => state.user);
  const passwordInputRef = useRef(null);

  // const togglePasswordVisibility = () => {
  //   if (!passwordVisible) {
  //     setEye(visible);
  //   } else {
  //     setEye(notVisible);
  //   }

  //   setPasswordVisible(!passwordVisible);
  // };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log(e.target.name);
      if (e.target.name === "Username") {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      } else {
        handleLogin();
      }
    }
  };

  const handleLogin = async () => {
    try {
      const dataForm = {
        username: inputValues["Username"],
        password: inputValues["Password"],
      };
      const response = await axios.post(
        "http://localhost:8000/api/login",
        dataForm
      );

      const userData = response.data.data;
      const userToken = response.data.data.token;
      const userDataJSON = JSON.stringify(userData);
      const userTokenJSON = JSON.stringify(userToken);
        console.log("userData.admin:");
        console.log(response.data.data);

      localStorage.setItem("userData", userDataJSON);
      localStorage.setItem("userToken", userTokenJSON);
      setUserD(userData);
      setUserT(userToken);
      dispatch(setUser(userData));
      dispatch(setUserToken(userToken));

      console.log("userDataaaa: " + userData.admin);
      if (userData.admin == 1) {
        console.log("admin");
        navigate("/Admin");
        console.log("wh");
      } else if (userData.admin == 0) {
        console.log("publisher");
        console.log(userToken);
        navigate("/Publisher");
        console.log("whattttt");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLoginLogoClick = () => {
    navigate('/Home');
  }

  const handleInputChange = (label, value) => {
    setInputValues((prevInputValues) => {
      const updatedInputValues = { ...prevInputValues, [label]: value };
      return updatedInputValues;
    });
  };

  useEffect(() => {
    if (userT != null) {
      if (userD.admin == 1) {
        navigate("/Admin");
      } else if (userD.admin == 0) {
        navigate("/Publisher");
      }
    } else {
      console.log("Failed");
    }

    const preventDragHandler = (e) => {
      console.log(e.target.tagName);
      if (e.target.tagName === "IMG" || e.target.tagName === "A") {
        e.preventDefault();
      }
    };

    document.addEventListener("dragstart", preventDragHandler);

    return () => {
      document.removeEventListener("dragstart", preventDragHandler);
    };
  }, []);

  return (
    <div className="width-100 flex center">
      <div className="loginCard flex column align-items">
        <div className="logo flex center">
          <Image src={logoPic} alt="ParkCatch Logo" className="logoPic pointer" onClick={handleLoginLogoClick}/>
        </div>
        <div className="welcome">
          <h3>Welcome Back</h3>
        </div>
        <div className="Inputs flex column center">
          <Input
            type="text"
            placeholder="Username"
            value={inputValues["Username"]}
            state={inputValues}
            classProp="loginInput"
            onKeyDown={handleKeyDown}
            onChange={(newValue) => handleInputChange("Username", newValue)}
            name="Username"
          />
          <div className="password-input width-100 flex center">
            <Input
              ref={passwordInputRef}
              type={"password"}
              placeholder="Password"
              value={inputValues["Password"]}
              state={inputValues}
              classProp="loginInput"
              onKeyDown={handleKeyDown}
              onChange={(newValue) => handleInputChange("Password", newValue)}
              name="Password"
            />
            {/* <button
              type="button"
              className="passwordToggle pointer"
              onClick={togglePasswordVisibility}
            > */}
              {/* <Image
                src={eye}
                alt="Toggle password visibility"
                className="eyeToggle"
              /> */}
            {/* </button> */}
          </div>
        </div>
        <div className="loginButton width-85 flex center">
          <Button text="Login" onClick={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

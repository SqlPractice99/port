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
import { login, getUser } from "../../../api";

const LoginForm = ({ userD, setUserD, userT, setUserT }) => {
  const [inputValues, setInputValues] = useState({});
  // const [passwordVisible, setPasswordVisible] = useState(false);
  const [eye, setEye] = useState(notVisible);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user =  useSelector((state) => state.user);
  const passwordInputRef = useRef(null);

  axios.defaults.baseURL = "http://localhost:8000/api";
  axios.defaults.withCredentials = true; // Allows cookies to be sent automatically

  // const togglePasswordVisibility = () => {
  //   if (!passwordVisible) {
  //     setEye(visible);
  //   } else {
  //     setEye(notVisible);
  //   }

  //   setPasswordVisible(!passwordVisible);
  // };

  // Define the getCookie function
  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  // }

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

  const decryptToken = async () => {
    let xsrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    let r = await axios.post(
      "/decrypt",
      {},
      {
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken), // ✅ Explicitly send CSRF token
        },
      }
    );

    console.log("Logged-in User:", r);
    return r;
  };

  const users = async () => {
    // let xsrfToken = document.cookie
    //     .split("; ")
    //     .find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];

    // axios
    //   .get("/test-auth", { withCredentials: true })
    //   .then((res) => console.log(res.data))
    //   .catch((err) =>
    //     console.error("Auth check failed:", err.response?.data || err.message)
    //   );

    await axios.get("/user", { withCredentials: true })
    .then(res => console.log(res.data))
    .catch(err => console.error("Unauthorized:", err.response?.data || err.message));
  

      decryptToken();
    // console.log("tokennnnn: ", token);
    // let r = await axios.get(
    //   "/user",
    //   {},
    //   {
    //     headers: {
    //       "X-XSRF-TOKEN": token, // ✅ Explicitly send CSRF token
    //     },
    //   }
    // );

    // console.log("Logged-in User:", r);
  };

  const handleLogin = async () => {
    try {
      // Step 1: Get CSRF token
      await axios.get("/sanctum/csrf-cookie"); // ✅ No need to set headers manually

      let xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      console.log("XSRF Token for /api/loginnnn:", xsrfToken);

      // Step 2: Send login request
      const response = await axios.post(
        "/login",
        {
          username: inputValues["Username"],
          password: inputValues["Password"],
        },
        {
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken), // ✅ Explicitly send CSRF token
          },
        },
        { withCredentials: true }
      );

      console.log("Login Response:", response.data);

      // await axios.get("/sanctum/csrf-cookie"); // ✅ No need to set headers manually

      // xsrfToken = document.cookie
      //   .split("; ")
      //   .find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];

      console.log("XSRF Token for /api/hi:", xsrfToken);

      // Step 3: Fetch authenticated user
      const tt = await decryptToken(); // ✅ Await the function

      users(tt.data.decryptedToken);
      // Step 4: Save user data
      // setUserD(userResponse.data);
      // dispatch(setUser(userResponse.data));

      // navigate("/Home");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }

    // try {
    //   // Step 1: Get CSRF token
    //   await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    //     withCredentials: true, // ✅ Important!
    //   });

    //   const dataForm = {
    //     username: inputValues["Username"],
    //     password: inputValues["Password"],
    //   };

    //   const xsrfToken = document.cookie
    //     .split("; ")
    //     .find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];

    //   // Step 2: Send login request
    //   const response = await axios.post(
    //     "http://localhost:8000/api/login",
    //     dataForm,
    //     {
    //       headers: {
    //         "X-XSRF-TOKEN": decodeURIComponent(xsrfToken), // ✅ Explicitly send CSRF token
    //       },
    //     }
    //   );

    //   console.log("Login Response: ");
    //   console.log(response.data);

    //   // Step 3: Fetch authenticated user
    //   const userResponse = await axios
    //     .get("http://localhost:8000/api/user", {
    //       headers: {
    //         "X-XSRF-TOKEN": decodeURIComponent(xsrfToken), // 🔥 Send CSRF token
    //       },
    //       withCredentials: true,
    //     })
    //     .then((response) => console.log("User data:", response.data))
    //     .catch((error) =>
    //       console.error("Not authenticated:", error)
    //     );

    //   const userData = userResponse;

    //   console.log("Logged-in User:", userData);

    //   // Step 4: Save user data in state
    //   // setUserD(userResponse);
    //   // dispatch(setUser(userResponse));

    //   navigate("/Home");
    //   // Step 1: Get CSRF token
    //   // await axios.get("/sanctum/csrf-cookie");

    //   // Step 2: Send login request
    //   // const response = await axios.post("/login", {
    //   //   username: inputValues["Username"], // Ensure backend expects "email" not "username"
    //   //   password: inputValues["Password"],
    //   // });

    //   // Step 3: Fetch authenticated user
    //   // const userResponse = await axios.get("/user");
    //   // const userData = userResponse.data;

    //   // console.log("Logged-in User:", userData);

    //   // Step 4: Save user data in state & Redux store
    //   // setUserD(userData);
    //   // dispatch(setUser(userData));

    //   // Step 5: Redirect user based on role
    //   // if (userData.admin === 1) {
    //   //   console.log("Admin Login");
    //   //   navigate("/Admin");
    //   // } else if (userData.admin === 0) {
    //   //   console.log("Publisher Login");
    //   //   navigate("/Publisher");
    //   // }
    //   // navigate("/Home");
    // } catch (error) {
    //   console.error("Login failed:", error);
    //   // console.error("Login failed:", error.response?.data || error.message);
    // }
  };

  // const handleLogin = async () => {
  //   try {
  //     const dataForm = {
  //       username: inputValues["Username"],
  //       password: inputValues["Password"],
  //     };
  //     const response = await axios.post(
  //       "http://localhost:8000/api/login",
  //       dataForm
  //     );

  //     const userData = response.data.data;
  //     const userToken = response.data.data.token;
  //     const userDataJSON = JSON.stringify(userData);
  //     const userTokenJSON = JSON.stringify(userToken);
  //       console.log("userData.admin:");
  //       console.log(response.data.data);

  //     localStorage.setItem("userData", userDataJSON);
  //     localStorage.setItem("userToken", userTokenJSON);
  //     setUserD(userData);
  //     setUserT(userToken);
  //     dispatch(setUser(userData));
  //     dispatch(setUserToken(userToken));

  //     console.log("userDataaaa: " + userData.admin);
  //     if (userData.admin == 1) {
  //       console.log("admin");
  //       navigate("/Admin");
  //       console.log("wh");
  //     } else if (userData.admin == 0) {
  //       console.log("publisher");
  //       console.log(userToken);
  //       navigate("/Publisher");
  //       console.log("whattttt");
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  const handleLoginLogoClick = () => {
    navigate("/Home");
  };

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
          <Image
            src={logoPic}
            alt="ParkCatch Logo"
            className="logoPic pointer"
            onClick={handleLoginLogoClick}
          />
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
          <Button text="Login" onClick={decryptToken} />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

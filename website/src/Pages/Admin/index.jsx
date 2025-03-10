import React, { useState, useEffect } from "react";
import "./styles.css";
import Header from "../../Components/ui/Header";
import AdminBody from "../../Components/ui/AdminBody";
import Footer from "../../Components/ui/Footer";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "../../redux/selectedTab/selectedTabSlice";

// function hasVerticalScrollbar() {
//   return document.documentElement.scrollHeight > document.documentElement.clientHeight;
// }

const Admin = () => {
  // const [containerWidth, setContainerWidth] = useState("98.6vw");
  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = selectedTab
      ? `Port of Beirut | Admin Panel`
      : "Port of Beirut";
    dispatch(setSelectedTab("Admin"));

    // if (hasVerticalScrollbar()) {
    // console.log("Vertical scrollbar is displayed.");
    // console.log(document.documentElement.clientHeight);
    // console.log(document.documentElement.scrollHeight);
    // } else {
    // console.log("Vertical scrollbar is not displayed.");
    // console.log(document.documentElement.clientHeight);
    // console.log(document.documentElement.scrollHeight);
    // }
  }, []);

  // useEffect(() => {
  //   const checkScrollbar = () => {
  //     if (hasVerticalScrollbar()) {
  //       console.log("Vertical scrollbar is displayed.");
  //       setContainerWidth("98.6vw");
  //       // console.log(document.documentElement.clientHeight);
  //       // console.log(document.documentElement.scrollHeight);
  //     } else {
  //       console.log("Vertical scrollbar is not displayed.");
  //       setContainerWidth("99.85vw");
  //       // console.log(document.documentElement.clientHeight);
  //       // console.log(document.documentElement.scrollHeight);
  //     }
  //   };

  //   checkScrollbar();

  //   window.addEventListener("resize", checkScrollbar);

  //   return () => {
  //     window.removeEventListener("resize", checkScrollbar);
  //   };
  // }, []);

  return (
    <div className="adminContainer flex column align-items">
      <Header />
      <AdminBody />
      <Footer removeFooterTop={true}/>
    </div>
  );
};

export default Admin;
import React, { useState, useEffect } from "react";
import "./styles.css";
// import Header from "../Header";
// import Footer from "../Footer";
import PostModal from "../../base/postModal";
import TenderModal from "../../base/tenderModal";
import NewsModal from "../../base/newsModal";
import Image from "../../base/image";
// import Button from "../../base/button";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import ManagePublishers from "../../../assets/images/manage.png";
import EditContent from "../../../assets/images/edit.png";
import AddContent from "../../../assets/images/add.png";
import AddTender from "../../../assets/images/addTender.png";
// import { setUser, setUserToken } from "../../../redux/user/userSlice";
// import { useNavigate } from "react-router-dom";
// import { clearSelectedTab, setSelectedTab } from "../../../redux/selectedTab/selectedTabSlice";

const AdminBody = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  // const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closeTenderModal = () => {
    setIsTenderModalOpen(false);
  };

  const openTenderModal = () => {
    setIsTenderModalOpen(true);
  };

  const closeNewsModal = () => {
    setIsNewsModalOpen(false);
  };

  const openNewsModal = () => {
    setIsNewsModalOpen(true);
  };

  // const preventDragHandler = (e) => {
  //   if (e.target.tagName === "IMG") {
  //     e.preventDefault();
  //   }
  // };

  // document.addEventListener("dragstart", preventDragHandler);

  // [('W1', 'B'), ('W2', 'W'), ('GY', 'O'), ('L', 'G')], lllllllllllll
  // [('W1', 'O'), ('W2', 'W'), ('GY', 'B'), ('L', 'G')], llllllllllllll

//   useEffect(() => {
    // return () => {
    //   document.removeEventListener("dragstart", preventDragHandler);
    // };
//   }, []);

  return (
    <div className="adminSectionContainer width-100 flex center c-gap-30">
      {/* <div className="flex center">
        <div className="adminSection flex column center pointer">
          <div className="adminSectionImgContainer">
            <Image
              src={ManagePublishers}
              alt="Manage Publishers"
              className="adminSectionImg"
              onClick={openPostModal}
            />
          </div>
          <h4>Manage Publishers</h4>
        </div>
      </div> */}
      <div className="flex center">
        <div className="adminSection flex column center pointer">
          <div className="adminSectionImgContainer">
            <Image
              src={EditContent}
              alt="Edit Content"
              className="adminSectionImg"
              onClick={openPostModal}
            />
          </div>
          <h4>Edit Content</h4>
        </div>
      </div>
      <div className="flex center">
        <div className="adminSection flex column center pointer">
          <div className="adminSectionImgContainer">
            <Image
              src={AddContent}
              alt="Add Content"
              className="adminSectionImg"
              onClick={openPostModal}
            />
          </div>
          <h4>Add Content</h4>
        </div>
      </div>
      <div className="flex center">
        <div className="adminSection flex column center pointer">
          <div className="adminSectionImgContainer">
            <Image
              src={AddTender}
              alt="Add Tender"
              className="adminSectionImg"
              onClick={openTenderModal}
            />
          </div>
          <h4>Add Tender</h4>
        </div>
      </div>
      <div className="flex center">
        <div className="adminSection flex column center pointer">
          <div className="adminSectionImgContainer">
            <Image
              src={EditContent}
              alt="Add News"
              className="adminSectionImg"
              onClick={openNewsModal}
            />
          </div>
          <h4>Add News</h4>
        </div>
      </div>
      <PostModal
        isOpen={isPostModalOpen}
        setIsOpen={setIsPostModalOpen}
        onClose={closePostModal}
      />
      <TenderModal
        isOpen={isTenderModalOpen}
        setIsOpen={setIsTenderModalOpen}
        onClose={closeTenderModal}
      />
      <NewsModal
        isOpen={isNewsModalOpen}
        setIsOpen={setIsNewsModalOpen}
        onClose={closeNewsModal}
      />
    </div>
  );
};

export default AdminBody;
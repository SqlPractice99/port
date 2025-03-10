import React, { useEffect, useState } from "react";
import Button from "../button";
import axios from "axios";
import "./styles.css";

const MessageSentAlert = ({ isOpen, onClose }) => {
  const handleClickOutside = (e) => {
    if (!e.target.closest("opened")) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${isOpen ? "opened" : "closed" }`}>
      <div className="message-alert-form-container flex column">
          <div className="message-close-btn width-100 flex justify-content-end">
            <Button
              text={"Close"}
              classProp="message-close-button width-10 pointer"
              onClick={onClose}
            />
          </div>

          <div className="title-text flex center">
            <h3>The Message was Sent Successfully</h3>
          </div>
      </div>
    </div>
  );
};

export default MessageSentAlert;

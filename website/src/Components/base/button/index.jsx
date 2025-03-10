import React from "react";
import "./styles.css";
import "../../../styles/utilities.css";

const Button = ({ text, onClick, classProp }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const className = `buttonContainer flex center width-60 pointer ${
    classProp || ""
  }`;

  return (
    <div className={className} onClick={handleClick}>
      {text}
    </div>
  );
};

export default Button;

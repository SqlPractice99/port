import React from "react";
import "./styles.css";

const Input = React.forwardRef(
  ({ type, placeholder=null, value, state, classProp, onKeyDown, onChange, name }, ref) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const className = `input ${classProp || ''}`;
  return (
    // <div className="inputContainer width-100 flex column center">
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className={className}
        name={name}
      />
    // </div>
  );
}
);

export default Input;

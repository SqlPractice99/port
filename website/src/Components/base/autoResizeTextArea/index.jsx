import { useState, useEffect, useRef } from "react";

const AutoResizeTextarea = ({ id, field, value, placeholder, onChange, className }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
        }
    }, [value]); // Runs whenever value changes

    return (
        <textarea
            ref={textareaRef}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(id, field, e.target.value)}
            className={`edit-textarea ${className}`}
            style={{
                overflow: "hidden",
                resize: "none",
            }}
        />
    );
};

export default AutoResizeTextarea;
import React from "react";
import { useSelector } from 'react-redux';

const ShareButton = ({ news }) => {
    const language = useSelector((state) => state.language.language);
    const en = language==='en';
    const jsonString = JSON.stringify(news); // Convert to JSON string
  const utf8Bytes = new TextEncoder().encode(jsonString); // Encode to UTF-8
  const base64String = btoa(String.fromCharCode(...utf8Bytes));

    // const encodedNews = btoa(encodeURIComponent(JSON.stringify(news))); // Proper encoding
    const shareUrl = `${window.location.origin}/news/${base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied!");
    };

    return (
        <div>
            {/* <input type="text" value={shareUrl} readOnly style={{ width: "100%", border: "none" }} /> */}
            <button className='editBtn pointer' onClick={copyToClipboard}>{en ? 'Copy Link' : 'نسخ الرابط'}</button>
        </div>
    );
};

export default ShareButton;
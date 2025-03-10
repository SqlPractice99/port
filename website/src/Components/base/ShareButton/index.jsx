import React from "react";

const ShareButton = ({ news }) => {
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
            <input type="text" value={shareUrl} readOnly style={{ width: "100%" }} />
            <button onClick={copyToClipboard}>Copy Link</button>
        </div>
    );
};

export default ShareButton;

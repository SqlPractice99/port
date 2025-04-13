import { useEffect, useState } from "react";

const LoadingText = ({ className=null }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div className={`${className} flex center`}>Loading{dots}</div>;
};

export default LoadingText;
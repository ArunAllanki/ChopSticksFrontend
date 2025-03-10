import React, { useEffect, useState } from "react";
import "./Splash.css"; // Add styles here
import logo from "../images/Logo.png";

const Splash = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Show for 2 seconds
  }, []);

  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <img src={logo} alt="Chopsticks Food Court" />
    </div>
  );
};

export default Splash;

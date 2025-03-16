import React from "react";
import "./Success.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ClockLoader } from "react-spinners";

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { Id } = location.state || {};

  if (Id) {
    return (
      <div className="success">
        <div className="Success-Overlay">
          <span>Thank you!</span>
          <span>Your order has been placed</span>
          <span>successfully.</span>
          <span id="IdNo">Order Id : {Id}</span>
        </div>
        <button className="HomeButton" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  } else {
    return (
      <div className="loader">
        <ClockLoader color="white" />
        <p>Hold on...</p>
        <p>Your order is getting placed</p>
      </div>
    );
  }
}

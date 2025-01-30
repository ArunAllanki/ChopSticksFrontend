import React from "react";
import Veg from "../images/Veg.png";
import nonVeg from "../images/NonVeg.png";
import "./EditMenuCard.css";

export default function EditMenuCard({
  id,
  name,
  active,
  price,
  veg,
  openDel,
  openPause,
  sendName,
  sendId,
  PauseOrResume,
}) {
  if (active) {
    return (
      <div className="EditItemCard">
        <div className="Item">
          <img src={veg ? Veg : nonVeg} alt="Veg" />
          <h4>{name}</h4>
          <h4>{price} &#x20B9;</h4>
        </div>
        <div className="bottom">
          <button
            onClick={() => {
              PauseOrResume("pause");
              openPause();
              sendName(name);
              sendId(id);
            }}
            className="PauseButton"
          >
            Pause
          </button>
          <button
            onClick={() => {
              openDel();
              sendName(name);
              sendId(id);
            }}
            className="DeleteButton"
          >
            Delete
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="EditItemCard inActive ">
        <div className="Item  ">
          <img src={veg ? Veg : nonVeg} alt="Veg" />
          <h4>{name}</h4>
          <h4>{price} &#x20B9;</h4>
        </div>
        <div className="bottom">
          <button
            onClick={() => {
              PauseOrResume("resume");
              openPause();
              sendName(name);
              sendId(id);
            }}
            className="PauseButton"
          >
            Resume
          </button>
          <button
            onClick={() => {
              openDel();
              sendName(name);
              sendId(id);
            }}
            className="DeleteButton"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

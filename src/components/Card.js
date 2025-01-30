import React from "react";
import Veg from "../images/Veg.png";
import nonVeg from "../images/NonVeg.png";
import "./Card.css";

export default function Card({ id, name, active, price, veg, onclick }) {
  if (active) {
    return (
      <div className="card">
        <div className="info">
          <div className="item-name">
            <img src={veg ? Veg : nonVeg} alt="Veg" />
            <h5>{name}</h5>
          </div>
          <h5>{price} &#x20B9;</h5>
        </div>
        <div className="Button">
          <button onClick={() => onclick(id, name, price)}>+</button>
        </div>
      </div>
    );
  }
}

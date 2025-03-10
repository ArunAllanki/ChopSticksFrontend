import React from "react";
import "./Home.css";
import Card from "../components/Card";
import Cart from "../components/Cart";
import Splash from "../screens/Splash";
import { useState, useEffect } from "react";
import logo from "../images/Logo.png";

export default function Home() {
  const backend = process.env.REACT_APP_BACKEND_URL;
  let [items, setItems] = useState([]);
  let [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${backend}/all-items`);
      const result = await response.json();
      setItems(result);
      console.log(items);
    };

    fetchData();
  }, []);

  const handleSelect = async (id, name, price) => {
    console.log(`clicked card of id ${id}`);
    // await selected.push(id);
    const newItem = [id, name, price];
    // await selected.push(newItem);

    await setSelected((selected) => [...selected, newItem]);
    console.log(selected);
  };

  const clearSelected = () => {
    setSelected([]);
  };

  return (
    <>
      <Splash />
      <div className="home">
        <img id="logo" src={logo}></img>
        {/* <div className="header"><h1>RCE ChopSticks</h1> </div> */}
        <div className="container">
          {items.map((item) => (
            <Card
              key={item._id}
              id={item._id}
              name={item.name}
              active={item.active}
              price={item.price}
              veg={item.veg}
              onclick={handleSelect}
            />
          ))}
        </div>

        <Cart selectedItems={selected} clearSelected={clearSelected} />
      </div>
    </>
  );
}

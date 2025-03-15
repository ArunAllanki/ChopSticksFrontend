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
  const [filter, setFilter] = useState("All");

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
  console.log(items);

  let filteredItems = [];
  let all = "active";
  let veg = "";
  let nonVeg = "";

  if (filter === "All") {
    filteredItems = items;
    veg = "";
    nonVeg = "";
  } else if (filter === "Veg") {
    filteredItems = items.filter((item) => item.veg === true);
    veg = "active";
    all = "";
    nonVeg = "";
  } else if (filter === "Non-Veg") {
    filteredItems = items.filter((item) => item.veg === false);
    veg = "";
    all = "";
    nonVeg = "active";
  }

  return (
    <>
      <Splash />
      <div className="home">
        <img id="logo" src={logo}></img>
        <div className="container">
          <div className="filters">
            <button className={all} onClick={() => setFilter("All")}>
              All
            </button>
            <button className={veg} onClick={() => setFilter("Veg")}>
              Veg
            </button>
            <button className={nonVeg} onClick={() => setFilter("Non-Veg")}>
              Non-Veg
            </button>
          </div>
          {filteredItems.map((item) => (
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

import React, { useState, useEffect, act } from "react";
import "./Admin.css";
import OrderCard from "../components/OrderCard";
import CompletedOrderCard from "../components/CompletedOrderCard";
import EditMenuCard from "../components/EditMenuCard";

export default function Admin() {
  const [LoggedIn, setLoggedIn] = useState(localStorage.getItem("password"));
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [id, setId] = useState();
  const [Name, setName] = useState();
  const [showDeleteOverlay, setShowDeleteOverlay] = useState("");
  const [showPauseOverlay, setShowPauseOverlay] = useState("");
  const [showAddOverlay, setShowAddOverlay] = useState("");
  const [show, setShow] = useState("");
  const [curr, setCurr] = useState("dashboard");
  const [pauseResume, setPauseResume] = useState("pause");
  const [password, setPassword] = useState("");
  const backend = process.env.REACT_APP_BACKEND_URL + "/";
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    veg: false,
    active: true,
  });

  const [showClearOverlay, setShowClearOvelray] = useState("");
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  const fetchOrders = async () => {
    const OrdersResponse = await fetch(`${backend}all-orders`);
    const OrdersResult = await OrdersResponse.json();
    setOrders(OrdersResult);
  };
  const fetchItems = async () => {
    const ItemsResponse = await fetch(`${backend}all-items`);
    const ItemsResult = await ItemsResponse.json();
    setItems(ItemsResult);
  };

  const fetchData = async () => {
    fetchOrders();
    fetchItems();
  };

  useEffect(() => {
    if (LoggedIn) {
      fetchData();
    }
  }, [LoggedIn]); //showDeleteOverlay, showPauseOverlay, showAddOverlay
  const handleComplete = async (id) => {
    try {
      console.log(id);
      const response = await fetch(`${backend}complete-order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: id }),
      });
      const result = await response.json();
      console.log(result);
      fetchOrders();
    } catch (error) {
      console.log(`Error with completing request : ${error}`);
      throw error;
    }
    setShow("");
  };

  const IdFromChild = (id) => {
    setId(id);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const Login = async () => {
    try {
      console.log(password);
      const response = await fetch(`${backend}Admin/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attempted: password }),
      });
      const result = await response.json();
      console.log(result);
      if (result == "true") {
        setPassword("");
        localStorage.setItem("password", true);
        setLoggedIn(true);
      } else {
        document.getElementById("wrongPassword").textContent =
          "Entered Incorrect password";
      }
    } catch (error) {
      console.log(`Error while loggin in : ${error}`);
      throw error;
    }
  };

  if (!LoggedIn) {
    return (
      <div id="Password">
        <h3 id="wrongPassword"></h3>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
        />
        <button id="Login" onClick={Login}>
          Log in
        </button>
      </div>
    );
  }

  const handleClear = async () => {
    try {
      console.log(id);
      const response = await fetch(`${backend}clear-comps`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
      //ReLoad items
      fetchOrders();
    } catch (error) {
      console.log(`Error while clearing completed orders : ${error}`);
    }
    setShowClearOvelray("");
  };

  if (LoggedIn) {
    if (curr === "dashboard") {
      const CompletedOrders = orders.filter((order) => order.Completed == true);

      const PendingOrders = orders.filter((order) => order.Completed == false);

      const toBeCooked = [];

      PendingOrders.map((order) =>
        order.OrderList.map((item) => toBeCooked.push(item[1]))
      );

      const counts = toBeCooked.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});

      return (
        <div className="AdminPage">
          <button
            id="Logout"
            onClick={() => {
              localStorage.removeItem("password");
              setLoggedIn(false);
            }}
          >
            LogOut
          </button>
          <div className="Nav">
            <button onClick={() => setCurr("orders")}>Orders</button>
            <button onClick={() => setCurr("editMenu")}>Edit Menu</button>
          </div>
          <h1>Dashboard</h1>
          <div className="Dashboard-inner">
            <div className="dash">
              <h2 className="yellow">
                Pending orders : {PendingOrders.length}
              </h2>
              {/* <h2 className="green">
                Orders fulfilled : {CompletedOrders.length}
              </h2>
              <h2>Total orders : {orders.length}</h2> */}
            </div>
            <div className="toBeCooked">
              <h2>Pending items</h2>
              {Object.entries(counts).length > 0 ? (
                Object.entries(counts).map(([key, value]) => (
                  <div key={key}>
                    <h3>{key}</h3>
                    <h3>{value}</h3>
                  </div>
                ))
              ) : (
                <h3>No pending items</h3>
              )}
            </div>
            <div className="comp-orders">
              <h2>Completed orders</h2>
              <button
                id="clear"
                onClick={() => {
                  setShowClearOvelray("show");
                }}
              >
                Clear
              </button>

              {CompletedOrders.length > 0 ? (
                [...CompletedOrders]
                  .reverse()
                  .map((order) => (
                    <CompletedOrderCard
                      key={order._id}
                      Completed={order.Completed}
                      MobileNo={order.MobileNo}
                      Name={order.Name}
                      OrderId={order.OrderId}
                      OrderDate={order.OrderDate}
                      OrderList={order.OrderList}
                      OrderTime={order.OrderTime}
                      RollNo={order.RollNo}
                    />
                  ))
              ) : (
                <h3>No completed orders</h3>
              )}
              <div className={`overlay ${showClearOverlay}`}>
                <div className="overlay-content">
                  <h3>Confirm to clear all</h3>
                  <h2>Completed Orders</h2>
                  <div className="overlay-btns">
                    <button
                      onClick={() => setShowClearOvelray("")}
                      className="close-btn"
                    >
                      back
                    </button>
                    <button onClick={() => handleClear()} className="ok-btn">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const openCompleteOverlay = () => {
      setShow("show");
    };

    if (curr === "orders") {
      var searchedOrders = [];
      const handleSearchChange = (e) => {
        setSearch(e.target.value);
      };
      searchedOrders = orders.filter(
        (order) =>
          `${order.OrderId}`.includes(search) && order.Completed === false
      );

      return (
        <div className="AdminPage">
          <div className="Nav">
            <button onClick={() => setCurr("dashboard")}>Dashboard</button>
            <button onClick={() => setCurr("editMenu")}>Edit Menu</button>
          </div>
          <h1>Orders</h1>

          <div className="Dashboard-inner">
            <input
              type="search"
              id="search"
              value={search}
              autoComplete="off"
              placeholder="Search"
              onChange={(e) => handleSearchChange(e)}
            />
            <div className="Orders">
              {search.length != 0 ? (
                searchedOrders.length > 0 ? (
                  searchedOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      Completed={order.Completed}
                      MobileNo={order.MobileNo}
                      Name={order.Name}
                      OrderId={order.OrderId}
                      OrderDate={order.OrderDate}
                      OrderList={order.OrderList}
                      OrderTime={order.OrderTime}
                      RollNo={order.RollNo}
                      complete={openCompleteOverlay}
                      getId={IdFromChild}
                    />
                  ))
                ) : (
                  <h3>No search result found</h3>
                )
              ) : orders.filter((order) => order.Completed === false).length >
                0 ? (
                orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    Completed={order.Completed}
                    MobileNo={order.MobileNo}
                    Name={order.Name}
                    OrderId={order.OrderId}
                    OrderDate={order.OrderDate}
                    OrderList={order.OrderList}
                    OrderTime={order.OrderTime}
                    RollNo={order.RollNo}
                    complete={openCompleteOverlay}
                    getId={IdFromChild}
                  />
                ))
              ) : (
                <h3>No active orders found</h3>
              )}
            </div>

            <div className={`overlay ${show}`}>
              <div className="overlay-content">
                <h3>Confirm to complete order no.</h3>
                <h2>{id}</h2>
                <div className="overlay-btns">
                  <button onClick={() => setShow("")} className="close-btn">
                    back
                  </button>
                  <button onClick={() => handleComplete(id)} className="ok-btn">
                    Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const openDeleteOverlay = () => {
      setShowDeleteOverlay("show");
    };

    const openPauseOverlay = () => {
      setShowPauseOverlay("show");
    };

    const NameFromChild = (Name) => {
      setName(Name);
    };

    const PauseOrResume = (x) => {
      setPauseResume(`${x}`);
    };

    const DeleteItem = async (id) => {
      try {
        console.log(id);
        const response = await fetch(`${backend}delete-item`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Id: id }),
        });
        const result = await response.json();
        console.log(result);
        //ReLoad items
        fetchItems();
      } catch (error) {
        console.log(`Error with completing request : ${error}`);
        throw error;
      }
      setShowDeleteOverlay("");
    };

    const PauseItem = async (id) => {
      try {
        console.log(id);
        const response = await fetch(`${backend}${pauseResume}-item`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Id: id }),
        });
        const result = await response.json();
        console.log(result);

        //ReLoad items
        fetchItems();
      } catch (error) {
        console.log(`Error with pausing item : ${error}`);
        throw error;
      }
      setShowPauseOverlay("");
    };

    // const validateInputs = (name, value) => {
    //   const newErrors = { ...errors };
    //   if (name == "name") {
    //     if (/^[A-Za-z\s]+$/.test(value)) {
    //       newErrors.name = "Enter only Letters ";
    //     } else {
    //       delete newErrors.name;
    //     }
    //   }

    //   if (name == "price") {
    //     if (/^\d+$/.test(value)) {
    //       newErrors.price = "Enter only Numbers";
    //     } else {
    //       delete newErrors.price;
    //     }
    //   }
    //   setErrors(newErrors);
    //   console.log(errors);
    // };

    const handleSubmit = async () => {
      const newErrors = {};
      // if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/.test(newItem.name)) {
      //   newErrors.name = "Enter Letters ";
      // } else {
      //   delete newErrors.name;
      // }

      if (!/^\d+$/.test(newItem.price)) {
        newErrors.price = "Enter only Numbers";
      } else {
        delete newErrors.price;
      }

      setErrors(newErrors);
      console.log(errors);

      if (
        Object.keys(errors).length == 0 &&
        newItem.name != "" &&
        newItem.price != ""
      ) {
        try {
          newItem.price = Number(newItem.price);
          console.log(newItem);
          const response = await fetch(`${backend}add-item`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newItem.name,
              price: newItem.price,
              veg: newItem.veg,
              active: newItem.active,
            }),
          });
          const result = await response.json();
          console.log(result);
          fetchItems();
        } catch (error) {
          console.log(`Error with adding item : ${error}`);
          throw error;
        }
        setShowAddOverlay("");
        setErrors({});
        setNewItem({
          name: "",
          price: "",
          veg: false,
          active: true,
        });
      }
    };

    const handleChange = (e) => {
      setNewItem((prevData) => ({
        ...prevData,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
    };

    if (curr === "editMenu") {
      return (
        <div className="AdminPage">
          <div className="Nav">
            <button onClick={() => setCurr("orders")}>Orders</button>
            <button onClick={() => setCurr("dashboard")}>Dashboard</button>
          </div>
          <h1>Edit Menu</h1>
          {console.log(items)}

          <button
            className="add-item"
            onClick={() => setShowAddOverlay("show")}
          >
            Add item
          </button>
          <div className="Dashboard-inner">
            <div className="Edit-items">
              {items.map((item) => (
                <EditMenuCard
                  key={item._id}
                  id={item._id}
                  active={item.active}
                  name={item.name}
                  price={item.price}
                  veg={item.veg}
                  openDel={openDeleteOverlay}
                  openPause={openPauseOverlay}
                  sendName={NameFromChild}
                  sendId={IdFromChild}
                  PauseOrResume={PauseOrResume}
                  // onclick={handleSelect}
                />
              ))}
            </div>
          </div>
          <div className={`overlay ${showAddOverlay}`}>
            <div className="overlay-content">
              <h2>Add Item</h2>

              <form id="ItemForm">
                {errors.name && (
                  <span className="item-error">{errors.name}</span>
                )}
                <input
                  id="EnterName"
                  type="text"
                  placeholder="Enter Item Name"
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                  required
                />
                {errors.price && (
                  <span className="item-error">{errors.price}</span>
                )}
                <input
                  id="EnterPrice"
                  type="text"
                  placeholder="Enter Price in INR"
                  name="price"
                  value={newItem.price}
                  onChange={handleChange}
                  required
                />
                <label>
                  Add Veg label
                  <input
                    type="checkbox"
                    name="veg"
                    checked={newItem.veg}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Active on add
                  <input
                    type="checkbox"
                    name="active"
                    checked={newItem.active}
                    onChange={handleChange}
                  />
                </label>
              </form>

              <div className="overlay-btns">
                <button
                  onClick={() => {
                    setShowAddOverlay("");
                    setNewItem({
                      name: "",
                      price: "",
                      veg: false,
                      active: true,
                    });
                    setErrors({});
                  }}
                  className="close-btn"
                >
                  back
                </button>
                <button
                  onClick={() => handleSubmit()}
                  // onClick={() => console.log(newItem)}
                  className="ok-btn"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className={`overlay ${showDeleteOverlay}`}>
            <div className="overlay-content">
              <h3>Confirm to remove</h3>
              <h2>{Name}</h2>
              <h3>from Menu</h3>
              <div className="overlay-btns">
                <button
                  onClick={() => setShowDeleteOverlay("")}
                  className="close-btn"
                >
                  back
                </button>
                <button onClick={() => DeleteItem(id)} className="ok-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className={`overlay ${showPauseOverlay}`}>
            <div className="overlay-content">
              <h3>Confirm to {pauseResume}</h3>
              <h2>{Name}</h2>
              <h3>from Menu</h3>
              <div className="overlay-btns">
                <button
                  onClick={() => setShowPauseOverlay("")}
                  className="close-btn"
                >
                  back
                </button>
                <button onClick={() => PauseItem(id)} className="ok-btn">
                  {pauseResume}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

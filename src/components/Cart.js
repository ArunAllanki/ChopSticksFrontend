import React, { useContext, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import Success from "../screens/Success";

import { useNavigate } from "react-router-dom";

export default function Cart({ selectedItems, clearSelected }) {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  var Total = 0;
  var [show, setShow] = useState(false);
  const [userErrors, setUserErrors] = useState({});

  const [user, setUser] = useState({
    name: "",
    MobileNo: "",
    RollNo: "",
  });

  const onChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: [e.target.value],
    });
  };

  const handleSubmit = async () => {
    console.log("user", user);
    const newUserErrors = {};
    if (!/^[a-zA-Z\s]+$/.test(user.name)) {
      newUserErrors.name = "Enter Letters ";
    } else {
      delete newUserErrors.name;
    }

    if (!/^\d{10}$/.test(user.MobileNo)) {
      newUserErrors.mobileNo = "Enter valid Mobile number";
    } else {
      delete newUserErrors.mobileNo;
    }

    if (user.RollNo.length == 0) {
      newUserErrors.rollNo = "Enter Roll number";
    } else {
      delete newUserErrors.rollNo;
    }

    setUserErrors(newUserErrors);
    console.log("userErros", userErrors);

    if (
      Object.keys(userErrors).length == 0 &&
      user.name != "" &&
      user.MobileNo != "" &&
      user.RollNo != ""
    ) {
      try {
        var now = new Date();
        var cDate = now.toLocaleDateString();
        console.log(cDate);
        var cTime = now.toLocaleTimeString();
        console.log(cTime);
        const response = fetch(`${backend}/send-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            OrderDate: cDate,
            OrderTime: cTime,
            Name: user.name,
            MobileNo: user.MobileNo,
            RollNo: user.RollNo,
            OrderList: selectedItems,
          }),
        });

        const Res = await response;
        console.log(Res);
        const data = await Res.json();
        console.log(data.ID);
        if (Res.ok === true) {
          navigate("/success", { state: { Id: data.ID } });
          console.log("Order created Successfully:", Response);
        }

        if (!Res.ok) {
          throw new Error("Response is not ok");
        }
      } catch (error) {
        console.log("Error while placing order:", error);
      }
      setShow(true);
      setUserErrors({});
    }
  };

  if (selectedItems.length === 0) {
    return null;
  } else {
    if (show === false) {
      return (
        <div className="cart">
          {
            <ul>
              {selectedItems.map(
                (subArray) => (
                  (Total = Total + subArray[2]),
                  (
                    <li key={subArray[0]}>
                      <ul className="cart-item">
                        <li>{subArray[1]}</li>
                        <li>{subArray[2]} &#x20B9;</li>
                      </ul>
                    </li>
                  )
                )
              )}
            </ul>
          }

          <div className="totalFare">
            <span>Total fare: {Total}&#x20B9;</span>
            <button className="order-btn" onClick={() => setShow(true)}>
              Place order
            </button>
            <button className="cancel-btn" onClick={clearSelected}>
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (show === true) {
      return (
        <div className="cart">
          <form>
            <div className="inputs">
              {userErrors.name && (
                <span className="error">{userErrors.name}</span>
              )}
              <div className="input">
                <input
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={user.name}
                  onChange={onChange}
                />
              </div>
              {userErrors.mobileNo && (
                <span className="error">{userErrors.mobileNo}</span>
              )}
              <div className="input">
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={user.MobileNo}
                  name="MobileNo"
                  onChange={onChange}
                />
              </div>
              {userErrors.rollNo && (
                <span className="error">{userErrors.rollNo}</span>
              )}
              <div className="input">
                <input
                  type="text"
                  placeholder="Enter Roll No"
                  name="RollNo"
                  value={user.RollNo}
                  onChange={onChange}
                />
              </div>
            </div>
          </form>

          <div className="totalFare">
            <hr />
            <button
              className="order-btn"
              onClick={() => {
                handleSubmit();
              }}
            >
              Place order
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                clearSelected();
                setShow(false);
                setUser({
                  name: "",
                  MobileNo: "",
                  RollNo: "",
                });
                setUserErrors({});
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
  }
}

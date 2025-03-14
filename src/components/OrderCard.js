import React, { useState } from "react";
import "./OrderCard.css";

export default function OrderCard({
  Completed,
  MobileNo,
  Name,
  OrderDate,
  OrderId,
  OrderList,
  OrderTime,
  RollNo,
  complete,
  getId,
}) {
  let tFare = 0;
  const [show, setShow] = useState("");
  const [hide, setHide] = useState("");
  const openMore = () => {
    setShow("showMore");
    setHide("hideMore");
  };
  if (Completed == false) {
    return (
      <>
        <div className="OrderCard">
          <div className="top">
            <div className="left">
              <div className="items">
                {OrderList.map(
                  (order) => (
                    <div className="each-item">
                      <span>{order[1]}</span>
                    </div>
                  )
                  // settFare(tFare + order[1])
                )}
              </div>
              <div onClick={openMore} className={`KnowMore ${hide}`}>
                Know more
              </div>
              <div className={`more-info ${show}`}>
                <div className="date-time">
                  <span>{OrderDate}</span>
                  <span>{OrderTime}</span>
                </div>
                <span>{Name}</span>
                <span>{RollNo}</span>
                <span>{MobileNo}</span>
              </div>
            </div>
            {OrderList.map(
              (order) => {
                // console.log(order[2]);
                tFare = tFare + order[2];
              }
              // settFare(tFare + order[1])
            )}
            <div className="right">
              <h3>{OrderId}</h3>
            </div>
          </div>
          <div className="bottom">
            <div
              onClick={() => {
                complete();
                getId(OrderId);
              }}
              className="b-left"
            >
              Complete Order
            </div>
            <div className="b-right">
              <text>{tFare} &#8377;</text>
            </div>
          </div>
        </div>
      </>
    );
  }
}

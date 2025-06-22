import React from "react";
import { useState } from "react";
import axios from "axios";
import { backend_url, currency } from "../App";
import { useEffect } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        backend_url + "/api/order/allorders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching orders");
    }
  };

  const statusUpdate = async(event, orderId)=>{
    try{
      const response = await axios.post(
        backend_url + "/api/order/status",
        {orderId, status:event.target.value},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success("Order status updated successfully");
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch(error){
      console.log(error);
      toast.error(error.message || "An error occurred while updating order status");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div>
      <h2>Orders</h2>
      <div className="">
        {orders.map((order, index) => (
          <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700" key={index}>
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div className="">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p className="py-0.5" key={index}>
                        {item.name} X {item.quantity} <span>{item.size}</span>
                      </p>
                    );
                  } else {
                    return (
                      <p className="py-0.5" key={index}>
                        {item.name} X {item.quantity} <span>{item.size}</span>,{" "}
                      </p>
                    );
                  }
                })}
              </div>
              <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.zipcode +
                    ", " +
                    order.address.country}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div className="">
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
            <select onChange={(event)=>statusUpdate(event, order._id)} value={order.status} className="p-2 font-semibold border border-gray-300 rounded-md" >
              <option value="Order Placed">Order Placed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;

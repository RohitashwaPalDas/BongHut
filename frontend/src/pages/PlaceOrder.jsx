import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../contexts/ShopContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {toast} from 'react-toastify';

const PlaceOrder = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let [method, setMethod] = useState("cod");

  const {
    navigate,
    backendUrl,
    token,
    cartItem,
    setCartItem,
    delivery_fee,
    products,
    getCartAmount,
    isProductBuy,
    updateIsProductBuy,
    productPrice,
    productQuantity,
    productSize,
    updateproductSize,
    updateproductPrice,
    updateproductQuantity,
    user,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: user.firstname || "",
    lastName: user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    street: user.street || "",
    city: user.city || "",
    state: user.state || "",
    country: user.country || "",
    zipcode: user.zipcode || "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };


  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyrazorpay",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
            setCartItem({});
            updateIsProductBuy(false);
            updateproductPrice(0);
            updateproductQuantity(0);
            updateproductSize("");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const placeOrderHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      if (!isProductBuy) {
        for (const items in cartItem) {
          for (const item in cartItem[items]) {
            if (cartItem[items][item] > 0) {
              let itemInfo = structuredClone(
                products.find((product) => product._id === items)
              );
              if (itemInfo) {
                itemInfo.size = item;
                itemInfo.quantity = cartItem[items][item];
                orderItems.push(itemInfo);
              }
            }
          }
        }
      } else {
        const productId = searchParams.get("product_id");
        console.log(productId);
        let itemInfo = products.find((product) => product._id === productId);
        if (itemInfo) {
          itemInfo.quantity = productQuantity;
          itemInfo.size = productSize;
          orderItems.push(itemInfo);
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: !isProductBuy
          ? getCartAmount() + delivery_fee
          : productPrice * productQuantity + delivery_fee,
      };

      switch (method) {
        case "cod":
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          console.log(res.data);
          if (res.data.success) {
            toast.success("Order placed successfully!");
            setCartItem({});
            updateIsProductBuy(false);
            updateproductPrice(0);
            updateproductQuantity(0);
            updateproductSize("");
            navigate("/orders");
          } else {
            toast.error(message);
          }
          break;

        case "razorpay":
          const resRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (resRazorpay.data.success) {
            initPay(resRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={placeOrderHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >
      {/* Left Side  */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 px-3.5 py-1.5 w-full"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-300 px-3.5 py-1.5 w-full"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="ZIP Code"
            className="number-input required border border-gray-300 px-3.5 py-1.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone Number"
          className="number-input required border border-gray-300 px-3.5 py-1.5 w-full"
        />
      </div>

      {/* Right Side  */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => {
                setMethod("razorpay");
              }}
              className="flex items-center gap-3 border border-slate-400 rounded-md p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border border-gray-500 rounded-full ${
                  method === "razorpay" ? "bg-green-500" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
            </div>
            <div
              onClick={() => {
                setMethod("cod");
              }}
              className="flex items-center gap-3 border border-slate-400 rounded-md p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border border-gray-500 rounded-full ${
                  method === "cod" ? "bg-green-500" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
        </div>
        <div className="w-full text-end mt-8">
          <button
            type="submit"
            className="bg-black text-white text-sm px-16 py-3 active:bg-gray-700"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

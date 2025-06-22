import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../contexts/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";

const Cart = () => {
  const { products, cartItem, currency, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const fetchCartDetails = () => {
    if (products.length > 0) {
      const temp = [];
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            temp.push({
              _id: items,
              size: item,
              quantity: cartItem[items][item],
            });
          }
        }
      }
      setCartData(temp);
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, [cartItem, products]);

  return cartData.length != 0 ? (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>
      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          return (
            <div
              className="py-4 border-t border-b  text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              key={index}
            >
              <div className="flex items-start gap-6">
                <img
                  src={productData.image[0]}
                  alt=""
                  className="w-16 sm:w-20"
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-200">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="number"
                min={1}
                defaultValue={item.quantity}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                onChange={(e) => {
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      );
                }}
              />
              <lord-icon
                src="https://cdn.lordicon.com/oqeixref.json"
                trigger="hover"
                style={{ width: "1.8rem", height: "1.8rem" }}
                onClick={() => {
                  updateQuantity(item._id, item.size, 0);
                }}
              ></lord-icon>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end m-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => {
                navigate("/place-order");
              }}
              className="bg-black text-white text-sm my-8 px-8 py-3 active:bg-gray-700"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center mt-10">
      <i
        onClick={() => {
          navigate("/collection");
        }}
        className="fa-solid fa-cart-plus fa-bounce text-[10rem] cursor-pointer"
      ></i>
      <p className="mt-5 text-3xl">No Items in your Cart!😢</p>
      <button
        onClick={() => {
          navigate("/collection");
        }}
        className="cursor-pointer bg-black text-white text-md my-8 px-6 py-2 active:bg-gray-700"
      >
        ADD ITEMS
      </button>
    </div>
  );
};

export default Cart;

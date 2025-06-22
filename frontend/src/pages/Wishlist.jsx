import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../contexts/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Wishlist = () => {
  const {wishlist} = useContext(ShopContext);
  return (
    <div className="px-6 py-8 text-base sm:text-2xl mb-4">
      <Title text1="YOUR" text2=" WISHLIST"/>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {wishlist.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url, currency } from "../App";
import {toast} from 'react-toastify';

const List = ({token}) => {
  const [list, setList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(backend_url + "/api/product/list");
      console.log(response);
      setList(response.data.products);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteProduct = async(id)=>{
    try{
      console.log("Clicked");
      const response = await axios.post(
        backend_url + "/api/product/remove",
        {id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if(response.data.success){
        toast.success("Deleted Successfully");
        await fetchData();
      }
    } catch(error){
      console.log(error);
      toast.error("Failed to delete product");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-200 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-right md:text-center">Action</b>
        </div>

        {
          list.map((item,index)=>(
            <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
              <img className="w-12" src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={()=>deleteProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg">X</p>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default List;

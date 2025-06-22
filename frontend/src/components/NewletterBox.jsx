import React from "react";
import { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";
import axios from "axios"
import {toast} from 'react-toastify';

const NewletterBox = () => {
  const { navigate, token, setisSubscribed, issubscribed, backendUrl} = useContext(ShopContext);
  const handleForm = (event) => {
    event.preventDefault();
  };
  const handleSubscribe = async () => {
    try{
      if(issubscribed){
      toast.warn("You are already subscribed!");
      return;
    }
    if (!token) {
      navigate("/login");
      toast.warn("Please Log In to continue");
    } else {
      const res = await axios.post(backendUrl+"/api/user/updateSubscribe", {}, {headers:{token}});
      console.log(res);
      if(res.data.success){
        toast.success("🎉 You've unlocked 20% OFF! Use code: SAVE20");
        setisSubscribed(true);
      }
    }
    } catch (error){
      console.log(error);
      toast.error("Some problem ocurred! Try it later...")
    }
  };

  return (
    <div className="text-center">
      <p className="text-3xl font-medium text-gray-800">
        Subscribe Now and get 20% OFF
      </p>
      <form
        onSubmit={handleForm}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 pl-3"
      >
        <input
          type="email"
          className="w-full sm:flex-1 outline-none px-4.5 py-2.5 p-3 border-2"
          placeholder="Enter yout E-Mail"
          required
        />
        <button onClick={handleSubscribe} type="submit" className={`${issubscribed ? "bg-gray-500 cursor-not-allowed":"bg-black"}  text-white text-sm px-6 py-3`}>
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewletterBox;

import React, { useContext, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../contexts/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {setShowSearch, getCartCount, navigate, setCartItem, token, setToken, updateIsProductBuy, isProductBuy} = useContext(ShopContext);

  const location = useLocation();

  const logOut = ()=>{
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItem({});
  }

  return (
    <div className="flex justify-between items-center py-5 bg-custom-grey border-b-3 border-black">
      <img src={assets.logo} className="w-36 sm:w-48" alt="" />
      {location.pathname === "/place-order" && <NavLink to="/collection">Continue Browsing</NavLink>}
      {location.pathname !== "/place-order" && <ul className="hidden sm:flex gap-5 text-gray-700 text-lg font-bold ">
        <NavLink to="/" className="flex flex-col items-center">
          <p>HOME</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center">
          <p>COLLECTIONS</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center">
          <p>ABOUT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center ">
          <p>CONTACT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>}

      {location.pathname !== "/place-order" &&  <div className="flex gap-3 sm:gap-6 items-center">
        <lord-icon
          src="https://cdn.lordicon.com/hoetzosy.json"
          trigger="hover"
          style={{ width: "2.2rem", height: "2.2rem" }}
          className="cursor-pointer w-2"
          onClick={()=>{setShowSearch(true); navigate('/collection')}}
        ></lord-icon>

        <div className="group relative z-50">
          <lord-icon
            src="https://cdn.lordicon.com/cniwvohj.json"
            onClick={()=>token?null:navigate('/login')}
            trigger="hover"
            style={{ width: "2.3rem", height: "2.3rem" }}
            className="cursor-pointer"
          ></lord-icon>
          {token && <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2 ">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-200 text-gray-500 rounded font-semibold">
              <p onClick={()=>{navigate('/my-profile')}} className="cursor-pointer hover:text-black">My Profile</p>
              <p onClick={()=>{navigate('/orders')}} className="cursor-pointer hover:text-black">Orders</p>
              <p onClick={()=>{navigate('/wishlist')}} className="cursor-pointer hover:text-black">Wish List</p>
              <p onClick={logOut} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>}
        </div>

        <Link to="/cart" className="relative" onClick={()=>{updateIsProductBuy(false)}}>
          <lord-icon
            src="https://cdn.lordicon.com/zmvzumis.json"
            trigger="hover"
            style={{ width: "2.3rem", height: "2.3rem" }}
          ></lord-icon>
          <p className="absolute right-[-2px] bottom-[4px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[9px]">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>}

      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        } z-[60]`}
      >
        <div className="flex flex-col text-gray-600 ">
          <div
            className="flex items-center gap-1 p-3 cursor-pointer"
            onClick={() => setVisible(false)}
          >
            <lord-icon
              src="https://cdn.lordicon.com/ebyacdql.json"
              trigger="hover"
              state="hover-cross-3"
              colors="primary:#b4b4b4"
              style={{ width: "2rem", height: "2rem" }}
            ></lord-icon>
            <p>Back</p>
          </div>
          <NavLink onClick={()=>{setVisible(false)}} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={()=>{setVisible(false)}} className='py-2 pl-6 border' to='/collection'>COLLECTIONS</NavLink>
          <NavLink onClick={()=>{setVisible(false)}} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={()=>{setVisible(false)}} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

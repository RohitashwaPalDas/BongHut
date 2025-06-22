import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const Searchbar = () => {
    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    useEffect(()=>{
        if(location.pathname.includes('collection')){
            setIsVisible(true);
        }
        else{
            setIsVisible(false);
        }
    },[location])
    return showSearch && isVisible ? (
    <div className='text-center'>
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
            <input type="text" className='flex-1 outline-none bg-inherit text-sm' placeholder='Search' value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
            <img src={assets.search_icon} alt="" className='w-4'/>
        </div>
        <img src={assets.cross_icon} alt="" className='inline w-3 cursor-pointer' onClick={()=>{setShowSearch(false)}}/>
    </div>
  ) : null
}

export default Searchbar

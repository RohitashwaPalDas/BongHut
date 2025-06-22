import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [issubscribed, setisSubscribed] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/user/details",
        {},
        { headers: { token } }
      );
      console.log("USER DETAILS:", res.data);
      console.log("USER DETAILS ONLY:", res.data.user);
      setisSubscribed(res.data.user.subscribed);
      setCartItem(res.data.user.cartData);
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchUser();
  }, [token]);



  const [isProductBuy, setIsProductBuy] = useState(() => {
    const stored = localStorage.getItem("isProductBuy");
    return stored ? JSON.parse(stored) : false;
  });

  const [productPrice, setProductPrice] = useState(() => {
    const stored = localStorage.getItem("productPrice");
    return stored ? JSON.parse(stored) : 0;
  });

  const [productSize, setProductSize] = useState(() => {
    const stored = localStorage.getItem("productSize");
    return stored ? JSON.parse(stored) : "";
  });

  const [productQuantity, setProductQuantity] = useState(() => {
    const stored = localStorage.getItem("productQuantity");
    return stored ? JSON.parse(stored) : 0;
  });

  const updateproductPrice = (value) => {
    setProductPrice(value);
    localStorage.setItem("productPrice", JSON.stringify(value));
  };

  const updateproductQuantity = (value) => {
    setProductQuantity(value);
    localStorage.setItem("productQuantity", JSON.stringify(value));
  };

  const updateproductSize = (value) => {
    setProductSize(value);
    localStorage.setItem("productSize", JSON.stringify(value));
  };

  const updateIsProductBuy = (value) => {
    setIsProductBuy(value);
    localStorage.setItem("isProductBuy", JSON.stringify(value));
  };

  const addToCart = async (itemId, size, quantity) => {
    if (!size) {
      toast.warn("Please select the size of your product");
      return;
    }
    if (!token) {
      toast.warn("Please login to add items to cart");
      navigate("/login");
      return;
    }
    const cartData = structuredClone(cartItem);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += quantity;
      } else {
        cartData[itemId][size] = quantity;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }
    setCartItem(cartData);
    if (token) {
      try {
        const res = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, quantity },
          {
            headers: {
              token,
            },
          }
        );

        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getCartData = async (token) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      console.log("BACKEND CART ITEMS:", res);
      setCartItem(res.data.cartData);
    } catch (error) {
      console.log(error);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          totalCount += cartItem[items][item];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    console.log("entered");
    console.log(itemId, size, quantity);
    let cartData = structuredClone(cartItem);

    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (token) {
      try {
        const res = await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          {
            headers: {
              token,
            },
          }
        );

        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmt = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          totalAmt += itemInfo.price * cartItem[items][item];
        }
      }
    }
    return totalAmt;
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      console.log(response.data);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/wishlist/all",
        {},
        { headers: { token } }
      );
      console.log("Wishlist response:", res.data.wishListData);
      setWishlist(res.data.wishListData);
    } catch (error) {
      console.log("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getCartData(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    getCartCount,
    setCartItem,
    cartItem,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    isProductBuy,
    updateIsProductBuy,
    productPrice,
    updateproductPrice,
    productQuantity,
    updateproductQuantity,
    productSize,
    updateproductSize,
    wishlist, setWishlist, fetchWishlist,
    issubscribed, setisSubscribed, user
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

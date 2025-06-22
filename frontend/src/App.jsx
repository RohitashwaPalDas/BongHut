import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Order from "./pages/Order";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Searchbar from "./components/Searchbar";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import EditProfile from "./pages/editProfile";
import { ToastContainer, Bounce } from "react-toastify";

const App = () => {
  return (
  <>
    <div className="px-[4vw] sm:px-[5vw] ">
      <Navbar />
      <Searchbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/editProfile" element={<EditProfile />} />
      </Routes>
      <Footer />
    </div>

    {/* ✅ Correct usage here */}
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  </>
);

};

export default App;

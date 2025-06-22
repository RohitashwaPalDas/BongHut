import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import ReviewForm from "../components/ReviewForm";
import ReviewSection from "../components/ReviewSection";
import axios from "axios";
import {toast} from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  console.log(productId);
  const [product, setProduct] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const {
    products,
    currency,
    addToCart,
    navigate,
    updateIsProductBuy,
    updateproductQuantity,
    updateproductPrice,
    updateproductSize,
    backendUrl,
    token,
    wishlist, fetchWishlist
  } = useContext(ShopContext);

  const addToWishlist = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/wishlist/add",
        { itemId: productId },
        { headers: { token } }
      );
      console.log("Wishlist Response:", res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchWishlist();
      }
    } catch (error) {
      console.log("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist. Please try again later.");
    }
  };

  const fetchPrdouct = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProduct(item);
        setImage(item.image[0]);
        console.log(item);
        return null;
      }
    });
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/product/getreviews", {
        productId,
      });
      console.log(res);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews. Please try again later.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    console.log(product);
    fetchPrdouct();
  }, [product, productId, products]);

  return product ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Details  */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images  */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {product.image.map((item, index) => (
              <img
                src={item}
                alt=""
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                onClick={() => {
                  setImage(item);
                }}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-4">
            <h1 className="font-medium text-2xl mt-2">{product.name}</h1>
            {wishlist.some(item => item._id === productId) ? (
              <lord-icon
                className="cursor-pointer mt-1"
                src="https://cdn.lordicon.com/gbkitytd.json"
                trigger="hover"
                colors="primary:#ff0000"
                style={{ width: "2.3rem", height: "2.3rem" }}
                onClick={addToWishlist}
              ></lord-icon>
            ) : (
              <lord-icon
                className="cursor-pointer mt-1"
                src="https://cdn.lordicon.com/efgqjiqt.json"
                trigger="hover"
                style={{ width: "2.3rem", height: "2.3rem" }}
                onClick={addToWishlist}
              ></lord-icon>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {/* Empty stars layer (gray) */}
            <div className="relative text-xl text-gray-300 leading-none">
              {"★★★★★".split("").map((_, i) => (
                <span key={i}>★</span>
              ))}

              {/* Filled stars overlay (yellow) */}
              <div
                className="absolute top-0 left-0 overflow-hidden text-yellow-400"
                style={{ width: `${(product.rating / 5) * 100}%` }}
              >
                {"★★★★★".split("").map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>

            {/* Numeric rating */}
            <span className="ml-2 text-gray-700 font-medium">
              ({product.rating.toFixed(1)})
            </span>
            <span className="ml-2 text-gray-700 font-medium">
              ({product.reviews.length} Reviews)
            </span>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {product.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {product.sizes.map((item, index) => (
                <button
                  onClick={() => {
                    setSize(item);
                  }}
                  className={`border py-2 px-4 bg-gray-200 ${
                    size === item ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="mb-1 font-medium">Quantity</p>
            <div className="flex border w-fit items-center rounded overflow-hidden">
              <button
                className="w-10 h-10 flex items-center justify-center text-xl border-r bg-white"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                readOnly
                className="w-12 h-10 text-center focus:outline-none"
              />
              <button
                className="w-10 h-10 flex items-center justify-center text-xl border-l bg-white"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                addToCart(product._id, size, quantity);
              }}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 font-semibold"
            >
              ADD TO CART
            </button>
            <button
              onClick={() => {
                if (!size) {
                  toast.warn("Please select a size");
                  return;
                }
                navigate(`/place-order?product_id=${product._id}`);
                updateIsProductBuy(true);
                updateproductPrice(product.price);
                updateproductQuantity(quantity);
                updateproductSize(size);
              }}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 font-semibold"
            >
              BUY NOW
            </button>
          </div>
          <p className="mt-8 h-[0.5px] w-full bg-gray-500 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Cash On Delivery is avaiable on this product</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section  */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>{product.details}</p>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="flex flex-col sm:flex-row">
        <ReviewForm productId={productId} fetchReview={fetchReviews} />
        <ReviewSection reviews={reviews} />
      </div>

      {/* Related Products  */}
      <RelatedProducts
        category={product.category}
        subCategory={product.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;

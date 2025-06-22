import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backend_url } from "../App";
import {toast} from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [size, setSize] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("details", details);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(size));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backend_url + "/api/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if(response.data.success){
        toast.success("Added");
        setName('');
        setDescription('');
        setBestseller(false);
        setCategory('Men');
        setSubcategory('Topwear');
        setDetails('');
        setSize([]);
        setPrice('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      }

      console.log(response);
    } catch (error) {
      toast.error("Failed to add product");
      console.log(error);
    }
  };

  return (
    <form
      className="flex flex-col w-full items-start gap-3"
      onSubmit={onSubmitHandler}
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
              className="w-20"
            />
            <input
              onChange={(e) => {
                setImage1(e.target.files[0]);
              }}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
              className="w-20"
            />
            <input
              onChange={(e) => {
                setImage2(e.target.files[0]);
              }}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
              className="w-20"
            />
            <input
              onChange={(e) => {
                setImage3(e.target.files[0]);
              }}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
              className="w-20"
            />
            <input
              onChange={(e) => {
                setImage4(e.target.files[0]);
              }}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
          type="text"
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Type Here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
          type="text"
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write your product description here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Details</p>
        <textarea
          onChange={(e) => {
            setDetails(e.target.value);
          }}
          value={details}
          type="text"
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write your product details here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Sub-Category</p>
          <select
            onChange={(e) => {
              setSubcategory(e.target.value);
            }}
            value={subcategory}
            className="w-full px-3 py-2"
          >
            <option value="topwear">Topwear</option>
            <option value="bottomwear">Bottomwear</option>
            <option value="winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            value={price}
            type="number"
            placeholder="250"
            min={1}
            className="w-full px-3 py-1.5 sm:w-[120px]"
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div
            onClick={() =>
              setSize((prev) =>
                prev.includes("S")
                  ? prev.filter((item) => item !== "S")
                  : [...prev, "S"]
              )
            }
          >
            <p
              className={`${
                size.includes("S") ? "bg-gray-400" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              S
            </p>
          </div>
          <div
            onClick={() =>
              setSize((prev) =>
                prev.includes("M")
                  ? prev.filter((item) => item !== "M")
                  : [...prev, "M"]
              )
            }
          >
            <p
              className={`${
                size.includes("M") ? "bg-gray-400" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              M
            </p>
          </div>
          <div
            onClick={() =>
              setSize((prev) =>
                prev.includes("L")
                  ? prev.filter((item) => item !== "L")
                  : [...prev, "L"]
              )
            }
          >
            <p
              className={`${
                size.includes("L") ? "bg-gray-400" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              L
            </p>
          </div>
          <div
            onClick={() =>
              setSize((prev) =>
                prev.includes("XL")
                  ? prev.filter((item) => item !== "XL")
                  : [...prev, "XL"]
              )
            }
          >
            <p
              className={`${
                size.includes("XL") ? "bg-gray-400" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              XL
            </p>
          </div>
          <div
            onClick={() =>
              setSize((prev) =>
                prev.includes("XXL")
                  ? prev.filter((item) => item !== "XXL")
                  : [...prev, "XXL"]
              )
            }
          >
            <p
              className={`${
                size.includes("XXL") ? "bg-gray-400" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              XXL
            </p>
          </div>
          <div
            onClick={() =>
              setSize((prev) =>
                prev.includes("XXXL")
                  ? prev.filter((item) => item !== "XXXL")
                  : [...prev, "XXXL"]
              )
            }
          >
            <p
              className={`${
                size.includes("XXXL") ? "bg-gray-400" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              XXXL
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => {
            setBestseller((prev) => !prev);
          }}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white active:bg-gray-700"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;

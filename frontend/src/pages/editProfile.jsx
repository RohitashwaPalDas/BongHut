import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../contexts/ShopContext";
import {toast} from 'react-toastify';

const EditProfile = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const [user, setUser] = useState({});

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  // Simulated fetch of current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.post(
          backendUrl + "/api/user/details",
          {},
          { headers: { token } }
        );
        console.log("Fetched User Data:", res.data);
        console.log("Fetched Only User Data:", res.data.user.email);
        setFormData({
          firstname: res.data.user.firstname || "",
          lastname: res.data.user.lastname || "",
          email: res.data.user.email || "",
          phone: res.data.user.phone || "",
          street: res.data.user.street || "",
          city: res.data.user.city || "",
          state: res.data.user.state || "",
          country: res.data.user.country || "",
          zipcode: res.data.user.zipcode || "",
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        backendUrl + "/api/user/update-profile",
        { formData },
        { headers: { token } }
      );
      console.log(res);
      if(res.data.success){
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstname}
            type="text"
            placeholder="First Name"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastname}
            type="text"
            placeholder="Last Name"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 px-3.5 py-1.5 w-full"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-300 px-3.5 py-1.5 w-full"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="ZIP Code"
            className="number-input required border border-gray-300 px-3.5 py-1.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 px-3.5 py-1.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone Number"
          className="number-input required border border-gray-300 px-3.5 py-1.5 w-full"
        />

        <button
          type="submit"
          className="bg-black active:bg-gray-800 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

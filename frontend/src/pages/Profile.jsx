import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../contexts/ShopContext";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import {toast} from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState({});
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(user.profilePicture || "");
  const [uploading, setUploading] = useState(false);
  const [about, setAbout] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasChanged = about !== user.about;

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleAboutChange = async () => {
    try {
      console.log("About to update:", about);
      const res = await axios.post(
        backendUrl + "/api/user/update-about",
        { about },
        { headers: { token } }
      );
      console.log(res);
      if (res.data.success) {
        toast.success("About section updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update about section");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        backendUrl + "/api/user/upload-profile-picture",
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPreview(res.data.profilePicture);
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/user/details",
        {},
        { headers: { token } }
      );
      console.log("USER DETAILS:", res.data);
      console.log("USER DETAILS ONLY:", res.data.user);
      setUser(res.data.user);
      setPreview(res.data.user.profilePicture || "");
      setAbout(res.data.user.about || "");
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

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <div className="bg-white/60 backdrop-blur-lg border border-gray-200/60 shadow-xl rounded-2xl p-6 max-w-5xl mx-auto transition duration-300">
        <div className=" flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group w-24 h-24 mx-auto sm:mx-0">
              {/* Profile Image or Initial */}
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-pink-600 border-4 border-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div
                onClick={handleIconClick}
                className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploading ? (
                  <span className="text-white text-sm animate-pulse">
                    Uploading...
                  </span>
                ) : (
                  <FaCamera className="text-white text-xl" />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
              <p className="text-sm sm:text-base">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex justify-center sm:justify-end">
            <button
              onClick={() => navigate("/editProfile")}
              className="bg-white text-gray-700 font-medium px-5 py-2 rounded-lg shadow hover:bg-gray-200 transition duration-200"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>

      <div className="border-b mt-4 px-6 max-w-5xl mx-auto">
        <button className="text-indigo-600 border-b-2 border-indigo-600 pb-2 px-2 font-medium text-lg">
          Profile
        </button>
      </div>

      <div className="px-6 mt-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-1">Profile</h2>
        <p className="text-sm text-gray-500 mb-6">
          Joined on:{" "}
          {new Date(user.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        <h3 className="text-lg font-medium mb-2">About</h3>
        <div
          className="bg-white border border-gray-200 rounded-lg shadow p-4 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <textarea
            className="w-full resize-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            placeholder="Share something about yourself..."
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            rows={3}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          ></textarea>

          {(isFocused || isHovered || hasChanged) && (
            <button
              onClick={handleAboutChange}
              className="absolute bottom-2 right-4 text-base font-semibold text-black hover:underline"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

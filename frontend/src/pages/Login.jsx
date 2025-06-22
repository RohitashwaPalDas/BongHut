import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../contexts/ShopContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState("LogIn");
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [emailError, setEmailError] = useState(false);
  const [strength, setStrength] = useState(0);
  const iconRef = useRef();
  const passWordRef = useRef();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const isValidEmail = async (email) => {
    try {
      let apiKey = import.meta.env.VITE_EMAIL_VALIDATION_API_KEY;
      console.log("API KEY+ ", apiKey);
      let url = `https://api.emailvalidation.io/v1/info?apikey=${apiKey}&email=${email}`;
      let response = await fetch(url);
      let result = await response.json();
      console.log("EMAIL VALIDATION:", result);

      if (!result.smtp_check) {
        setEmailError(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error validating email:", error);
      return false;
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse; // This is the ID Token

    try {
      const res = await axios.post(`${backendUrl}/api/user/google-auth`, {
        idToken: credential,
      });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        toast.success("Logged in successfully...");
      } else {
        toast.error("Failed to Sign In");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to Sign In");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "SignUp") {
        if (!validatePassword(password)) {
          return;
        }
        const isEmailValid = await isValidEmail(email);
        console.log("Email validation result:", isEmailValid);
        if (!isEmailValid) {
          return;
        }
        const res = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        console.log(res);
        if (res.data.success) {
          toast.success("Logged in successfully...");
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        } else {
          console.log(res.data.message);
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        console.log(res);
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success("Logged in successfully...");
        } else {
          console.log(res.data.message);
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to Log In");
    }
  };

  const validatePassword = (password) => {
    let errors = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else errors.push("Must be at least 8 characters.");

    if (/[A-Z]/.test(password)) score += 1;
    else errors.push("Must contain at least one uppercase letter.");

    if (/[a-z]/.test(password)) score += 1;
    else errors.push("Must contain at least one lowercase letter.");

    if (/\d/.test(password)) score += 1;
    else errors.push("Must contain at least one number.");

    if (/[\W_]/.test(password)) score += 1;
    else errors.push("Must contain at least one special character.");

    setPasswordErrors(errors);
    setStrength(score);
    return errors.length === 0;
  };

  const getStrengthLabel = () => {
    if (strength <= 1) return { label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { label: "Medium", color: "bg-yellow-400" };
    if (strength >= 4) return { label: "Strong", color: "bg-green-500" };
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center gap-2">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 "
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <hr className="border-none h-[1.5px] w-32 bg-gray-800" />
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-32 bg-gray-800" />
        </div>
        {currentState === "SignUp" && (
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter your name"
            required
          />
        )}
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Enter your email address"
          required
        />

        {emailError && (
          <div className="text-red-400 text-sm relative top-[-10px] sm:left-[-40px]">
            Invalid Email. Please enter a valid email address
          </div>
        )}

        <div className="relative w-full">
          <input
            ref={passWordRef}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (currentState !== "LogIn") validatePassword(e.target.value);
            }}
            required
            className="w-full px-3 py-2 border border-gray-800"
          />
          <i
            ref={iconRef}
            className={`fa-solid ${
              showPassword ? "fa-eye-slash" : "fa-eye"
            } absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`}
            onClick={toggleShowPassword}
          ></i>
        </div>

        <div className="text-left text-red-400 text-sm">
          {passwordErrors.map((error, index) => (
            <p key={index} className="mt-1">
              • {error}
            </p>
          ))}
        </div>

        {/* Password Strength Meter */}
        {currentState !== "LogIn" && password.length > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${getStrengthLabel().color}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-black text-xs mt-2">
              {getStrengthLabel().label}
            </p>
          </div>
        )}

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          {currentState === "LogIn" ? (
            <p className="cursor-pointer">Forgot password?</p>
          ) : (
            <p className="opacity-0"></p>
          )}
          {currentState === "LogIn" ? (
            <p
              className="cursor-pointer"
              onClick={() => {
                setCurrentState("SignUp");
                setEmail("");
                setPassword("");
                setShowPassword(false);
              }}
            >
              Create Account
            </p>
          ) : (
            <p
              className="cursor-pointer"
              onClick={() => {
                setCurrentState("LogIn");
                setEmail("");
                setPassword("");
                setName("");
                setShowPassword(false);
              }}
            >
              LogIn here
            </p>
          )}
        </div>
        <button
          className={`bg-black text-white font-medium px-8 py-2 mt-4 active:bg-gray-700 ${
            passwordErrors.length > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {currentState}
        </button>
      </form>
      <p className="text-gray-800 text-sm mt-4">OR</p>
      <GoogleLogin
        className="w-full m-auto mt-4"
        onSuccess={handleGoogleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
};

export default Login;

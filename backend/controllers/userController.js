import dotenv from "dotenv";
dotenv.config();

import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const randomPassword = crypto.randomBytes(32).toString('hex');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// google login 
const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await userModel.findOne({ email });

        if (!user) {
            user = new userModel({
                name,
                email,
                password: randomPassword, // Just a random string
                googleAuth: true,
                date: Date.now()
            });
            await user.save();
        }

        const token = generateToken(user._id);
        res.json({ success: true, message: "Logged in with Google", token });

    } catch (error) {
        console.error("Google login error:", error);
        res.json({ success: false, message: "Google login failed" });
    }
};

// user login 
const logInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User can't find with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect Password" });
        }

        if (isMatch) {
            const token = generateToken(user._id);
            res.json({ success: true, message: "logged in Successfully", token })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// user register 
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            date: Date.now()
        });

        const user = await newUser.save();

        const token = generateToken(user._id);

        res.json({ success: true, message: "registered Successfully", token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }

};

// admin login 
const logInAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, message: "logged in as ADMIN Successfully", token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//return user details
const userDetails = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const {firstname, lastname, email, phone, street, city, state, country, zipcode } = req.body.formData;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (firstname !== undefined) user.firstname = firstname;
        if (lastname !== undefined) user.lastname = lastname;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (street !== undefined) user.street = street;
        if (city !== undefined) user.city = city;
        if (state !== undefined) user.state = state;
        if (country !== undefined) user.country = country;
        if (zipcode !== undefined) user.zipcode = zipcode;

        await user.save();

        res.json({ success: true, message: "Profile updated successfully", user });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateProfilePictureSecure = async (req, res) => {
  try {
    const { userId } = req.body;
    const imageUrl = req.file.path; 

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.profilePicture = imageUrl;
    await user.save();

    res.json({ success: true, profilePicture: imageUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

const updateUserAbout = async(req, res)=>{
    try {
        const { userId, about } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        user.about = about || "";
        await user.save();
        res.json({ success: true, message: "About section updated successfully", user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateSubscription = async(req,res)=>{
    try{
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        user.subscribed = true;
        await user.save();
        res.json({ success: true, message: "Subscription updated successfully", user });
    } catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { logInUser, registerUser, logInAdmin, userDetails, googleAuth, updateProfile, updateProfilePictureSecure, updateUserAbout, updateSubscription};
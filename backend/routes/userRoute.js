import express from "express";
import { logInUser, logInAdmin, registerUser, userDetails, googleAuth, updateProfile, updateProfilePictureSecure, updateUserAbout, updateSubscription } from "../controllers/userController.js";
import authUser from "../middlewares/auth.js";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const upload = multer({ storage });

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', logInUser);
userRouter.post('/admin', logInAdmin);
userRouter.post('/details', authUser, userDetails);
userRouter.post("/google-auth", googleAuth);
userRouter.post('/update-profile', authUser, updateProfile);
userRouter.post("/upload-profile-picture", upload.single("image"), authUser, updateProfilePictureSecure);
userRouter.post('/update-about', authUser, updateUserAbout);
userRouter.post('/updateSubscribe', authUser, updateSubscription);


export default userRouter;
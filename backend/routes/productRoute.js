import express from "express";
import { addProduct, listProducts, singleProduct, deleteProduct, addReview, getReviews } from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";
import authUser from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth ,upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRouter.post("/remove", adminAuth, deleteProduct);
productRouter.post("/single", singleProduct);
productRouter.post("/addreview", authUser, addReview);
productRouter.post("/getreviews", getReviews);
productRouter.get("/list", listProducts);

export default productRouter;
import express from "express";
import { addtoCart, getCart, updateCart } from "../controllers/cartController.js";
import authUser from "../middlewares/auth.js";
const cartRouter = express.Router();

cartRouter.post('/add', authUser, addtoCart);
cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/get', authUser, getCart);

export default cartRouter;
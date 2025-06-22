import express from "express";
import { addToWishlist, getWishlist} from "../controllers/wishlistController.js";
import authUser from "../middlewares/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.post('/add', authUser, addToWishlist);
wishlistRouter.post('/all', authUser, getWishlist);

export default wishlistRouter;
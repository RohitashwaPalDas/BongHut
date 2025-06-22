import express from 'express';
import adminAuth from '../middlewares/adminAuth.js';
import { allOrders, paymentCOD, paymentRazorpay, paymentStripe, updateOrderStatus, userOrders, verifyRazorPay } from '../controllers/orderController.js';
import authUser from '../middlewares/auth.js';

const orderRouter = express.Router();

orderRouter.post("/allorders", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateOrderStatus);

orderRouter.post("/place", authUser, paymentCOD);
orderRouter.post("/stripe", authUser, paymentStripe);
orderRouter.post("/razorpay", authUser, paymentRazorpay);

orderRouter.post("/myorders", authUser, userOrders);

orderRouter.post("/verifyrazorpay", authUser, verifyRazorPay);

export default orderRouter;
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";

const key_id = "rzp_test_BMQ3RPnhZeU5gk";
const key_secret = "wz5EE243aNQqv0zrRlVDFE8C";

const razorpay_instance = new razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

const currency = "INR";


const paymentCOD = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const paymentStripe = async (req, res) => {

}

const paymentRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: newOrder._id.toString(),
        }

        await razorpay_instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error.message });
            }
            res.json({ success: true, order });
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const verifyRazorPay = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body;
        const orderInfo = await razorpay_instance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === "paid") {
            await orderModel.findOneAndUpdate(
                { _id: orderInfo.receipt },  // Use correct filter
                { payment: true }
            );

            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json({ success: true, message: "Order Status Updated", order: updatedOrder });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { verifyRazorPay, paymentCOD, paymentRazorpay, paymentStripe, allOrders, userOrders, updateOrderStatus };
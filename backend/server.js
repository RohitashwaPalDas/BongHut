import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import {connectCloudinary} from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";

// App Config 
const app = express();
const port  = process.env.port || 4000;

// Middlewares 
app.use(express.json());
app.use(cors());
connectDB();
connectCloudinary();

// API endpoints 
app.use('/api/user',userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order',orderRouter);
app.use('/api/wishlist', wishlistRouter);

app.get('/', (req,res)=>{
    res.send("API working");
});

app.listen(port, ()=>{
    console.log("Listening to port" + port)
});
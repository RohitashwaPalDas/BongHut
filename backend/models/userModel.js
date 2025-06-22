import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type: String, required:true},
    email:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    googleAuth: { type: Boolean, default: false },
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    about: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    phone: { type: String, default: "" },
    cartData: {type:Object, default:{}},
    wishListData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    subscribed: {type: Boolean, default: false},
    date:{type:Number, default: new Date("2025-06-20").getTime()}
},{minimize:false});

const userModel = mongoose.model.user || mongoose.model("user",userSchema);
export default userModel;
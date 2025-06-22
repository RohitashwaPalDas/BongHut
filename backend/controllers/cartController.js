import userModel from "../models/userModel.js";

const addtoCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const user = await userModel.findById(userId);
        let cartData = await user.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += quantity;
            } else {
                cartData[itemId][size] = quantity;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getCart = async (req,res) => {
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        let cartData = await user.cartData;
        res.json({success:true, cartData});
    } catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const user = await userModel.findById(userId);
        let cartData = await user.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addtoCart, getCart, updateCart };
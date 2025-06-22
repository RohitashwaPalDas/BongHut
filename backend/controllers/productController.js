import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js";


// add a new product 
const addProduct = async(req,res)=>{
    try{
        const {name, description, details, price, category, subCategory, sizes, stock, bestseller} = req.body;
        const img1 = req.files.image1 && req.files.image1[0];
        const img2 = req.files.image2 && req.files.image2[0];
        const img3 = req.files.image3 && req.files.image3[0];
        const img4 = req.files.image4 && req.files.image4[0];
        const images = [img1, img2, img3, img4].filter((item)=>item!==undefined);
        let imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url;
            })
        )
        
        const productData = {
            name,
            description,
            details,
            price: Number(price),
            category,
            subCategory,
            stock: Number(stock) || 100,
            bestseller: bestseller==="true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        console.log("Saved Product: " + product);

        res.json({success:true, message:"Product Added Successfully"});
    } catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// list all products 
const listProducts = async(req,res)=>{
    try{
        const products = await productModel.find({});
        res.json({success:true, products});
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// delete a product 
const deleteProduct = async(req,res)=>{
    try{
        const deletedPdt = await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Successfully Deleted", deletedPdt});
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// show details of a single listing
const singleProduct = async(req,res)=>{
    try{
        const product = await productModel.findById(req.body.id);
        res.json({success:true, message:"Successfully Found", product});
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

const addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.reviews.push({
      user: userId,
      rating,
      comment
    });

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.json({ success: true, message: "Review added successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const product = await productModel.findById(productId).populate('reviews.user', 'name email');
    res.json({ success: true, reviews: product.reviews });
} catch(error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


export {addProduct, listProducts, deleteProduct, singleProduct, addReview, getReviews};
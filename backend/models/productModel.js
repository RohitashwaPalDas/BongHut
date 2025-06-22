import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to your User model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type:String, required:true },
  description: { type: String, required:true },
  details: { type: String, required:true },
  price: { type: Number, required:true },
  category: { type: String, required:true },
  subCategory: { type: String, required:true },
  image: { type: Array, required:true },
  sizes: { type: Array, required:true },
  stock: { type: Number, required:true },
  bestseller: { type: Boolean },
  rating: { type: Number, default: 0 }, // average rating
  reviews: { type: [reviewSchema], default: [] }, // structured reviews
  date: { type: Number, required: true },
});


const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;

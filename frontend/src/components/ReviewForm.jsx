import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../contexts/ShopContext';
import {toast} from 'react-toastify';

const ReviewForm = ({productId, fetchReview}) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const {backendUrl, token, navigate} = useContext(ShopContext);

  const handleSubmit = async(e) =>{
      e.preventDefault();
      try{
        const res = await axios.post(backendUrl + "/api/product/addreview", {productId , rating, comment}, {headers:{token}});
        console.log(res);
        if(res.data.success){
            toast.success("Review submitted successfully!");
            setRating(0);
            setComment('');
            fetchReview();
        }
    } catch(error){
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review. Please try again later.");
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-lg border border-gray-200/60 shadow-xl rounded-2xl p-6 max-w-md mx-auto mt-10 w-full sm:w-1/2 max-h-[350px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Leave a Review</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className={`text-3xl transition ${
                star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-1 focus:ring-black focus:outline-none mb-4 text-sm"
          placeholder="Write your review here..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="w-full bg-black active:bg-gray-700 text-white font-medium py-2 rounded-lg transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

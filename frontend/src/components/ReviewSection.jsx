import React, { useState } from 'react';

const ReviewSection = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <div className="bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-xl rounded-2xl p-6 mt-10 max-w-7xl mx-auto w-full sm:w-1/2">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Customer Reviews</h2>

      {reviews?.length === 0 ? (
        <p className="text-gray-500 italic text-center">No reviews yet. Be the first to review this product.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            {visibleReviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm h-full flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">
                    {review.user?.name || 'Anonymous'}
                  </p>
                  <div className="flex text-yellow-400 text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-2">{review.comment}</p>

                {review.createdAt && (
                  <p className="text-xs text-gray-400 mt-auto">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* See More / See Less Button */}
          {reviews.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-indigo-600 hover:underline font-medium transition"
              >
                {showAll ? 'See Less Reviews' : 'See More Reviews'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection;

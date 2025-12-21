import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myReviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/reviews/filter?userEmail=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setEditRating(review.ratingPoint);
    setEditComment(review.reviewComment);
    setShowEditModal(true);
  };

  const handleUpdateReview = async () => {
    try {
      await axiosSecure.put(`/reviews/${selectedReview._id}`, {
        ratingPoint: editRating,
        reviewComment: editComment,
      });

      Swal.fire("Success!", "Review updated successfully", "success");
      setShowEditModal(false);
      setSelectedReview(null);
      refetch();
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to update review",
        "error"
      );
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/reviews/${reviewId}`);
        Swal.fire("Deleted!", "Your review has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.error || "Failed to delete review",
          "error"
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading reviews: {error.message}</span>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Reviews</h2>
        <div className="badge badge-primary badge-lg">
          {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-12">
            <svg
              className="w-24 h-24 mx-auto text-base-content/20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-base-content/60 mb-6">
              You haven't written any reviews yet. Complete an application to
              leave a review!
            </p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Scholarship Name</th>
                <th>University Name</th>
                <th>Review Comment</th>
                <th>Review Date</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="font-semibold">
                    {review.scholarshipName || "N/A"}
                  </td>
                  <td>{review.universityName}</td>
                  <td>
                    <span className="text-sm italic line-clamp-2">
                      {review.reviewComment}
                    </span>
                  </td>
                  <td>
                    {review.reviewDate
                      ? new Date(review.reviewDate).toLocaleDateString()
                      : new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-bold">{review.ratingPoint}</span>
                      <span className="text-base-content/60">/5</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="btn btn-warning btn-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="btn btn-error btn-xs text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <button
              onClick={() => setShowEditModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>

            <h3 className="font-bold text-2xl mb-2 text-primary">
              Edit Review
            </h3>
            <p className="text-sm text-base-content/60 mb-6">
              Update your rating and comments for{" "}
              {selectedReview?.universityName}
            </p>

            <div className="space-y-6">
              {/* Rating Section */}
              <div className="bg-base-200 rounded-lg p-6">
                <label className="label">
                  <span className="label-text font-semibold text-base">
                    Your Rating
                  </span>
                </label>
                <div className="flex gap-3 justify-center my-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditRating(star)}
                      className={`text-5xl transition-all duration-200 hover:scale-110 ${
                        star <= editRating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 font-semibold">
                    <span className="text-yellow-500">★</span>
                    <span className="text-lg">{editRating}</span>
                    <span className="text-base-content/60">/ 5</span>
                  </span>
                </div>
              </div>

              {/* Comment Section */}
              <div className="form-control">
                <div className="flex justify-between items-end mb-2">
                  <label className="label-text font-semibold text-base">
                    Review Comment
                  </label>
                  <span className="text-xs text-base-content/60 font-medium">
                    {editComment.length} / 500 characters
                  </span>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full h-32 resize-none focus:textarea-primary"
                  placeholder="Share your experience with this scholarship program..."
                  value={editComment}
                  maxLength={500}
                  onChange={(e) => setEditComment(e.target.value)}
                />
                <div className="mt-2">
                  <span className="text-xs text-base-content/50 italic">
                    💡 Tip: Write at least 10 characters for a meaningful review
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-action mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-outline btn-error"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReview}
                className="btn btn-primary text-white"
                disabled={!editComment.trim() || editComment.length < 5}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Update Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllReviews = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews");
      return res.data;
    },
  });

  const handleDeleteReview = async (reviewId, userName) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: `Are you sure you want to delete this review by ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/reviews/${reviewId}`);
        Swal.fire("Deleted!", "The review has been deleted.", "success");
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
        <div>
          <h2 className="text-3xl font-bold">All Reviews</h2>
          <p className="text-base-content/60 mt-1">
            Moderate and manage all student reviews
          </p>
        </div>
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
            <p className="text-base-content/60">
              No student reviews have been submitted yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>University</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Review Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={
                              review.userImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                review.userName || "User"
                              )}&background=6b21a8&color=fff&rounded=true&size=64`
                            }
                            alt={review.userName}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{review.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/70">
                    {review.userEmail}
                  </td>
                  <td className="font-medium">{review.universityName}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="font-bold text-lg">
                        {review.ratingPoint}
                      </span>
                      <span className="text-base-content/60">/5</span>
                    </div>
                  </td>
                  <td>
                    <div className="max-w-xs">
                      <p className="text-sm italic line-clamp-2">
                        "{review.reviewComment}"
                      </p>
                    </div>
                  </td>
                  <td className="text-sm">
                    {review.reviewDate
                      ? new Date(review.reviewDate).toLocaleDateString()
                      : new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleDeleteReview(review._id, review.userName)
                      }
                      className="btn btn-error btn-xs text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllReviews;

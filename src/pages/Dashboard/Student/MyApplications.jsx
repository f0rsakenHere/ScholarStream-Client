import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MyApplications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Debug: log email to find the source of duplication
  console.log("User email from auth:", user?.email);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editFormData, setEditFormData] = useState({});
  const [scholarshipDetails, setScholarshipDetails] = useState({});
  const [userReviews, setUserReviews] = useState([]);

  const {
    data: applicationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myApplications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch scholarship details for each application
  useEffect(() => {
    const fetchScholarshipDetails = async () => {
      if (applicationsData?.applications) {
        const details = {};
        const scholarshipIds = applicationsData.applications
          .map((app) => app.scholarshipId)
          .filter(Boolean);

        for (const scholarshipId of scholarshipIds) {
          try {
            const res = await axiosSecure.get(`/scholarships/${scholarshipId}`);
            details[scholarshipId] = res.data;
          } catch (err) {
            console.error(`Failed to fetch scholarship ${scholarshipId}:`, err);
          }
        }
        setScholarshipDetails(details);
      }
    };
    fetchScholarshipDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationsData]);

  // Fetch user reviews
  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await axiosSecure.get(
          `/reviews/filter?userEmail=${user?.email}`
        );
        const reviews = Array.isArray(res.data)
          ? res.data
          : res.data?.reviews || [];
        setUserReviews(reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (user?.email) {
      fetchUserReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Helper function to get scholarship info
  const getScholarship = (scholarshipId) =>
    scholarshipDetails[scholarshipId] || {};

  // Helper function to check if user has a review for a scholarship
  const hasReviewForScholarship = (scholarshipId) =>
    userReviews.some((review) => review.scholarshipId === scholarshipId);

  const handleDelete = async (applicationId) => {
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
        await axiosSecure.delete(`/applications/${applicationId}`);
        Swal.fire("Deleted!", "Your application has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.error || "Failed to delete application",
          "error"
        );
      }
    }
  };

  const handleSubmitReview = async () => {
    try {
      await axiosSecure.post("/reviews", {
        scholarshipId: selectedApplication.scholarshipId,
        universityName: selectedApplication.universityName,
        userName: user?.displayName || "Anonymous",
        userEmail: user?.email,
        userImage: user?.photoURL || "",
        ratingPoint: rating,
        reviewComment: comment,
      });

      Swal.fire("Success!", "Review submitted successfully", "success");
      setShowReviewModal(false);
      setRating(5);
      setComment("");
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to submit review",
        "error"
      );
    }
  };

  const handleEditApplication = async () => {
    try {
      await axiosSecure.put(
        `/applications/${selectedApplication._id}`,
        editFormData
      );

      Swal.fire("Success!", "Application updated successfully", "success");
      setShowEditModal(false);
      setEditFormData({});
      refetch();
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to update application",
        "error"
      );
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
        <span>Error loading applications: {error.message}</span>
      </div>
    );
  }

  const applications = applicationsData?.applications || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Applications</h2>
        <div className="badge badge-primary badge-lg">
          {applications.length} Application
          {applications.length !== 1 ? "s" : ""}
        </div>
      </div>

      {applications.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-base-content/60 mb-6">
              You haven't applied for any scholarships yet. Start exploring
              scholarships and apply today!
            </p>
            <a href="/all-scholarships" className="btn btn-primary">
              Browse Scholarships
            </a>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>University Name</th>
                <th>University Address</th>
                <th>Subject Category</th>
                <th>Application Fees</th>
                <th>Feedback</th>
                <th>Application Status</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const scholarship = getScholarship(application.scholarshipId);
                return (
                  <tr key={application._id}>
                    <td className="font-semibold">
                      {application.universityName}
                    </td>
                    <td>
                      {scholarship.universityCity ||
                      scholarship.universityCountry
                        ? `${
                            scholarship.universityCity
                              ? `${scholarship.universityCity}, `
                              : ""
                          }${scholarship.universityCountry || ""}`
                        : "N/A"}
                    </td>
                    <td>
                      {scholarship.subjectCategory ||
                        application.scholarshipCategory ||
                        "N/A"}
                    </td>
                    <td className="font-bold text-primary">
                      ${application.applicationFees}
                    </td>
                    <td>
                      {application.feedback ? (
                        <span className="text-sm italic">
                          {application.feedback}
                        </span>
                      ) : (
                        <span className="text-base-content/40">
                          No feedback
                        </span>
                      )}
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          application.applicationStatus === "pending"
                            ? "badge-warning"
                            : application.applicationStatus === "approved"
                            ? "badge-success"
                            : application.applicationStatus === "completed"
                            ? "badge-info"
                            : "badge-error"
                        } badge-sm`}
                      >
                        {application.applicationStatus}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          application.paymentStatus === "paid"
                            ? "badge-success"
                            : "badge-error"
                        } badge-sm`}
                      >
                        {application.paymentStatus}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {/* Details Button - Always visible */}
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetailsModal(true);
                          }}
                          className="btn btn-info btn-xs text-white"
                        >
                          Details
                        </button>

                        {/* Edit Button - Only if pending */}
                        {application.applicationStatus === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setEditFormData({
                                applicantName: application.applicantName,
                                degree: application.degree,
                              });
                              setShowEditModal(true);
                            }}
                            className="btn btn-warning btn-xs"
                          >
                            Edit
                          </button>
                        )}

                        {/* Pay Button - Only if pending AND unpaid */}
                        {application.applicationStatus === "pending" &&
                          application.paymentStatus === "unpaid" && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/payment?scholarshipId=${application.scholarshipId}`
                                )
                              }
                              className="btn btn-success btn-xs text-white"
                            >
                              Pay
                            </button>
                          )}

                        {/* Delete Button - Only if pending */}
                        {application.applicationStatus === "pending" && (
                          <button
                            onClick={() => handleDelete(application._id)}
                            className="btn btn-error btn-xs text-white"
                          >
                            Delete
                          </button>
                        )}

                        {/* Add Review Button - Only if completed and no existing review */}
                        {application.applicationStatus === "completed" &&
                          !hasReviewForScholarship(
                            application.scholarshipId
                          ) && (
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowReviewModal(true);
                              }}
                              className="btn btn-primary btn-xs text-white"
                            >
                              Add Review
                            </button>
                          )}

                        {/* Edit Review Button - Only if completed and review exists */}
                        {application.applicationStatus === "completed" &&
                          hasReviewForScholarship(
                            application.scholarshipId
                          ) && (
                            <button
                              onClick={() => navigate("/dashboard/my-reviews")}
                              className="btn btn-secondary btn-xs text-white"
                            >
                              Edit Review
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-4">Application Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-base-content/60">University</p>
                  <p className="font-semibold">
                    {selectedApplication.universityName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Category</p>
                  <p className="font-semibold">
                    {selectedApplication.scholarshipCategory}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Degree</p>
                  <p className="font-semibold">{selectedApplication.degree}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">
                    Application Fee
                  </p>
                  <p className="font-semibold text-primary text-lg">
                    ${selectedApplication.applicationFees}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Applied Date</p>
                  <p className="font-semibold">
                    {new Date(
                      selectedApplication.applicationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">
                    Application Status
                  </p>
                  <div
                    className={`badge ${
                      selectedApplication.applicationStatus === "pending"
                        ? "badge-warning"
                        : selectedApplication.applicationStatus === "approved"
                        ? "badge-success"
                        : "badge-error"
                    } badge-lg mt-1`}
                  >
                    {selectedApplication.applicationStatus}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Payment Status</p>
                  <div
                    className={`badge ${
                      selectedApplication.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-error"
                    } badge-lg mt-1`}
                  >
                    {selectedApplication.paymentStatus}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Transaction ID</p>
                  <p className="font-mono text-xs break-all">
                    {selectedApplication.transactionId}
                  </p>
                </div>
              </div>
              {selectedApplication.feedback && (
                <div className="mt-4">
                  <p className="text-sm text-base-content/60">
                    Moderator Feedback
                  </p>
                  <div className="alert alert-info mt-2">
                    <p>{selectedApplication.feedback}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-action">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showReviewModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Add Review</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Rating (1-5 stars)</span>
                </label>
                <div className="rating rating-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name="rating"
                      className="mask mask-star-2 bg-orange-400"
                      checked={rating === star}
                      onChange={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Comment</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Share your experience with this scholarship..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(5);
                  setComment("");
                }}
                className="btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="btn btn-primary"
                disabled={!comment.trim()}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {showEditModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Edit Application</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Applicant Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editFormData.applicantName || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      applicantName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Degree</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editFormData.degree || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      degree: e.target.value,
                    })
                  }
                >
                  <option value="">Select Degree</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="alert alert-info">
                <span className="text-xs">
                  Note: You can only edit your name and degree level while the
                  application is pending.
                </span>
              </div>
            </div>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData({});
                }}
                className="btn"
              >
                Cancel
              </button>
              <button
                onClick={handleEditApplication}
                className="btn btn-primary"
                disabled={!editFormData.applicantName?.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;

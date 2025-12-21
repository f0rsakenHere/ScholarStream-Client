import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageApplications = () => {
  const axiosSecure = useAxiosSecure();

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  const {
    data: applicationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications");
      return res.data;
    },
  });

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axiosSecure.patch(`/applications/${applicationId}/status`, {
        applicationStatus: newStatus,
      });

      Swal.fire("Success!", "Application status updated", "success");
      refetch();
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to update status",
        "error"
      );
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      await axiosSecure.patch(
        `/applications/${selectedApplication._id}/status`,
        {
          applicationStatus: selectedApplication.applicationStatus,
          feedback: feedback,
        }
      );

      Swal.fire("Success!", "Feedback submitted successfully", "success");
      setShowFeedbackModal(false);
      setFeedback("");
      refetch();
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to submit feedback",
        "error"
      );
    }
  };

  const handleCancelApplication = async (applicationId) => {
    const result = await Swal.fire({
      title: "Reject Application?",
      text: "This will mark the application as rejected",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (result.isConfirmed) {
      await handleStatusUpdate(applicationId, "rejected");
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
        <h2 className="text-3xl font-bold">Manage Applications</h2>
        <div className="badge badge-primary badge-lg">
          {applications.length} Application
          {applications.length !== 1 ? "s" : ""}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-base-content/60">
              No student applications have been submitted yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-lg overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Applicant Email</th>
                <th>University Name</th>
                <th>Application Feedback</th>
                <th>Application Status</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id}>
                  <td className="font-semibold">{application.applicantName}</td>
                  <td className="text-sm">{application.applicantEmail}</td>
                  <td>{application.universityName}</td>
                  <td>
                    {application.feedback ? (
                      <span className="text-sm italic">
                        {application.feedback.slice(0, 30)}...
                      </span>
                    ) : (
                      <span className="text-base-content/40">No feedback</span>
                    )}
                  </td>
                  <td>
                    <div
                      className={`badge ${
                        application.applicationStatus === "pending"
                          ? "badge-warning"
                          : application.applicationStatus === "processing"
                          ? "badge-info"
                          : application.applicationStatus === "completed"
                          ? "badge-success"
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
                    <div className="flex items-center gap-1">
                      {/* Details Button */}
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetailsModal(true);
                        }}
                        className="btn btn-info btn-xs text-white"
                      >
                        Details
                      </button>

                      {/* Feedback Button */}
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setFeedback(application.feedback || "");
                          setShowFeedbackModal(true);
                        }}
                        className="btn btn-primary btn-xs text-white"
                      >
                        Feedback
                      </button>

                      {/* Status Update Dropdown */}
                      {application.applicationStatus !== "rejected" &&
                        application.applicationStatus !== "completed" && (
                          <select
                            className={`select select-bordered select-xs font-semibold ${
                              application.applicationStatus === "pending"
                                ? "select-warning"
                                : application.applicationStatus === "processing"
                                ? "select-info"
                                : "select-success"
                            }`}
                            value={
                              application.applicationStatus || "processing"
                            }
                            onChange={(e) =>
                              handleStatusUpdate(
                                application._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="processing">🔄 Processing</option>
                            <option value="completed">✅ Completed</option>
                          </select>
                        )}

                      {/* Cancel Button */}
                      {application.applicationStatus !== "rejected" &&
                        application.applicationStatus !== "completed" && (
                          <button
                            onClick={() =>
                              handleCancelApplication(application._id)
                            }
                            className="btn btn-error btn-xs text-white"
                          >
                            Reject
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-2xl mb-4">Application Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/60">Applicant Name</p>
                <p className="font-semibold">
                  {selectedApplication.applicantName}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Applicant Email</p>
                <p className="font-semibold">
                  {selectedApplication.applicantEmail}
                </p>
              </div>
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
                <p className="text-sm text-base-content/60">Application Fee</p>
                <p className="font-semibold text-primary text-lg">
                  ${selectedApplication.applicationFees}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Service Charge</p>
                <p className="font-semibold">
                  ${selectedApplication.serviceCharge}
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
                      : selectedApplication.applicationStatus === "processing"
                      ? "badge-info"
                      : selectedApplication.applicationStatus === "completed"
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
              <div className="col-span-2">
                <p className="text-sm text-base-content/60">Transaction ID</p>
                <p className="font-mono text-sm break-all">
                  {selectedApplication.transactionId}
                </p>
              </div>
              {selectedApplication.feedback && (
                <div className="col-span-2">
                  <p className="text-sm text-base-content/60">Feedback</p>
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

      {/* Feedback Modal */}
      {showFeedbackModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Application Feedback</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-base-content/60 mb-2">
                  Applicant:{" "}
                  <span className="font-semibold">
                    {selectedApplication.applicantName}
                  </span>
                </p>
                <p className="text-sm text-base-content/60 mb-4">
                  University:{" "}
                  <span className="font-semibold">
                    {selectedApplication.universityName}
                  </span>
                </p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Feedback Message
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Enter feedback for the applicant..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedback("");
                }}
                className="btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="btn btn-primary"
                disabled={!feedback.trim()}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;

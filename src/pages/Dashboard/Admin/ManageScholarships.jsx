import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch all scholarships
  const {
    data: scholarships = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return Array.isArray(res.data) ? res.data : res.data.scholarships || [];
    },
  });

  // Filter scholarships based on search term
  const filteredScholarships = scholarships.filter(
    (scholarship) =>
      scholarship.scholarshipName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      scholarship.universityName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Handle delete scholarship
  const handleDeleteScholarship = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.delete(`/scholarships/${id}`);
          if (response.data.deletedCount > 0 || response.status === 200) {
            toast.success("Scholarship deleted successfully!");
            refetch(); // Refresh the list
          }
        } catch (error) {
          console.error("Error deleting scholarship:", error);
          toast.error(
            error.response?.data?.message || "Failed to delete scholarship"
          );
        }
      }
    });
  };

  // Handle edit scholarship
  const handleEditScholarship = (scholarship) => {
    setEditingScholarship(scholarship);
    // Reset form with the scholarship data
    reset({
      scholarshipName: scholarship.scholarshipName,
      universityName: scholarship.universityName,
      universityImage: scholarship.universityImage,
      universityCountry: scholarship.universityCountry,
      universityCity: scholarship.universityCity,
      universityWorldRank: scholarship.universityWorldRank,
      subjectCategory: scholarship.subjectCategory,
      scholarshipCategory: scholarship.scholarshipCategory,
      degree: scholarship.degree,
      tuitionFees: scholarship.tuitionFees,
      applicationFees: scholarship.applicationFees,
      serviceCharge: scholarship.serviceCharge,
      applicationDeadline: scholarship.applicationDeadline?.split("T")[0],
    });
  };

  // Handle update scholarship
  const handleUpdateScholarship = async (data) => {
    setIsUpdating(true);
    try {
      const updateData = {
        ...data,
        universityWorldRank: parseInt(data.universityWorldRank) || 0,
        tuitionFees: data.tuitionFees ? parseInt(data.tuitionFees) : null,
        applicationFees: parseInt(data.applicationFees) || 0,
        serviceCharge: parseInt(data.serviceCharge) || 0,
      };

      const response = await axiosSecure.put(
        `/scholarships/${editingScholarship._id}`,
        updateData
      );

      // Backend returns { message, scholarship }
      if (response.data.scholarship || response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Scholarship updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setEditingScholarship(null);
          reset();
          refetch();
        });
      }
    } catch (error) {
      console.error("Error updating scholarship:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update scholarship";
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setEditingScholarship(null);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Error loading scholarships. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Manage Scholarships</h2>

          {/* Search Bar */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text font-semibold">
                Search Scholarships
              </span>
            </label>
            <input
              type="text"
              placeholder="Search by scholarship or university name..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Scholarship Table */}
          <div className="overflow-x-auto">
            {filteredScholarships.length === 0 ? (
              <div className="alert alert-info">
                <span>No scholarships found.</span>
              </div>
            ) : (
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th>Scholarship Name</th>
                    <th>University</th>
                    <th>Country</th>
                    <th>Degree</th>
                    <th>Category</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScholarships.map((scholarship) => (
                    <tr key={scholarship._id} className="hover:bg-base-200">
                      <td>
                        <div className="font-semibold">
                          {scholarship.scholarshipName}
                        </div>
                      </td>
                      <td>{scholarship.universityName}</td>
                      <td>{scholarship.universityCountry}</td>
                      <td>
                        <span className="badge badge-primary">
                          {scholarship.degree}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-secondary">
                          {scholarship.scholarshipCategory}
                        </span>
                      </td>
                      <td className="text-sm">
                        {new Date(
                          scholarship.applicationDeadline
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-info text-white"
                            title="Edit scholarship"
                            onClick={() => handleEditScholarship(scholarship)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error text-white"
                            title="Delete scholarship"
                            onClick={() =>
                              handleDeleteScholarship(scholarship._id)
                            }
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Scholarships</div>
              <div className="stat-value text-primary">
                {scholarships.length}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Active Search Results</div>
              <div className="stat-value text-secondary">
                {filteredScholarships.length}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Upcoming Deadlines</div>
              <div className="stat-value text-warning">
                {
                  scholarships.filter(
                    (s) =>
                      new Date(s.applicationDeadline) > new Date() &&
                      new Date(s.applicationDeadline) <
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {editingScholarship && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <div
                className="card bg-base-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-6">Edit Scholarship</h2>

                  <form
                    onSubmit={handleSubmit(handleUpdateScholarship)}
                    className="space-y-4"
                  >
                    {/* Show validation errors if any */}
                    {Object.keys(errors).length > 0 && (
                      <div className="alert alert-error">
                        <span>
                          Please fix the errors below before submitting.
                        </span>
                      </div>
                    )}

                    {/* Scholarship Name & University Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Scholarship Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("scholarshipName", {
                            required: "Scholarship name is required",
                          })}
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            University Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("universityName", {
                            required: "University name is required",
                          })}
                        />
                      </div>
                    </div>

                    {/* Image & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            University Image URL *
                          </span>
                        </label>
                        <input
                          type="url"
                          className="input input-bordered w-full"
                          {...register("universityImage", {
                            required: "Image URL is required",
                          })}
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Country *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("universityCountry", {
                            required: "Country is required",
                          })}
                        />
                      </div>
                    </div>

                    {/* City & World Rank */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            City *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("universityCity", {
                            required: "City is required",
                          })}
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            World Rank *
                          </span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          {...register("universityWorldRank", {
                            required: "World rank is required",
                          })}
                        />
                      </div>
                    </div>

                    {/* Subject & Scholarship Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Subject Category *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("subjectCategory", {
                            required: "Subject category is required",
                          })}
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Scholarship Category *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("scholarshipCategory", {
                            required: "Scholarship category is required",
                          })}
                        />
                      </div>
                    </div>

                    {/* Degree & Tuition Fees */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Degree *
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("degree", {
                            required: "Degree is required",
                          })}
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Tuition Fees
                          </span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          {...register("tuitionFees")}
                        />
                      </div>
                    </div>

                    {/* Application Fees & Service Charge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Application Fees *
                          </span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          {...register("applicationFees", {
                            required: "Application fees is required",
                          })}
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Service Charge *
                          </span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          {...register("serviceCharge", {
                            required: "Service charge is required",
                          })}
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Application Deadline *
                        </span>
                      </label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        defaultValue={
                          editingScholarship.applicationDeadline?.split("T")[0]
                        }
                        {...register("applicationDeadline", {
                          required: "Deadline is required",
                        })}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="card-actions justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="btn btn-ghost"
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Updating...
                          </>
                        ) : (
                          "Update Scholarship"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageScholarships;

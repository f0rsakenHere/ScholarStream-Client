import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AddScholarship = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      scholarshipName: "",
      universityName: "",
      universityImage: "",
      universityCountry: "",
      universityCity: "",
      universityWorldRank: "",
      subjectCategory: "",
      scholarshipCategory: "",
      degree: "",
      tuitionFees: "",
      applicationFees: "",
      serviceCharge: "",
      applicationDeadline: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const scholarshipData = {
        ...data,
        universityWorldRank: parseInt(data.universityWorldRank),
        tuitionFees: data.tuitionFees ? parseInt(data.tuitionFees) : null,
        applicationFees: parseInt(data.applicationFees),
        serviceCharge: parseInt(data.serviceCharge),
        postedUserEmail: user?.email,
      };

      console.log("Submitting scholarship data:", scholarshipData);
      console.log("User email:", user?.email);

      const response = await axiosSecure.post("/scholarships", scholarshipData);

      console.log("Response:", response.data);

      if (response.data.insertedId || response.data.acknowledged) {
        // Show SweetAlert2 success modal
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Scholarship created successfully!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Go to Manage Scholarships",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard/manage-scholarships");
          }
        });

        // Reset form
        reset();
      } else {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Scholarship added to the system!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Go to Manage Scholarships",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard/manage-scholarships");
          }
        });

        reset();
      }
    } catch (error) {
      console.error("Error creating scholarship:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to create scholarships");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create scholarship"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectCategories = [
    "Engineering",
    "Medical",
    "Business",
    "Law",
    "Arts & Sciences",
    "Agriculture",
    "Computer Science",
    "Education",
  ];

  const scholarshipCategories = [
    "Merit-based",
    "Need-based",
    "Athletic",
    "Diversity",
    "Full Ride",
    "Partial",
  ];

  const degreeTypes = ["Bachelor", "Masters", "Diploma", "PhD"];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Add New Scholarship</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="e.g., MIT Engineering Scholarship"
                  className={`input input-bordered w-full ${
                    errors.scholarshipName ? "input-error" : ""
                  }`}
                  {...register("scholarshipName", {
                    required: "Scholarship name is required",
                  })}
                />
                {errors.scholarshipName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.scholarshipName.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    University Name *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Massachusetts Institute of Technology"
                  className={`input input-bordered w-full ${
                    errors.universityName ? "input-error" : ""
                  }`}
                  {...register("universityName", {
                    required: "University name is required",
                  })}
                />
                {errors.universityName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.universityName.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* University Image URL */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  University Image URL *
                </span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/university.jpg"
                className={`input input-bordered w-full ${
                  errors.universityImage ? "input-error" : ""
                }`}
                {...register("universityImage", {
                  required: "University image URL is required",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Must be a valid URL",
                  },
                })}
              />
              {errors.universityImage && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.universityImage.message}
                  </span>
                </label>
              )}
            </div>

            {/* Country & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    University Country *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., USA"
                  className={`input input-bordered w-full ${
                    errors.universityCountry ? "input-error" : ""
                  }`}
                  {...register("universityCountry", {
                    required: "Country is required",
                  })}
                />
                {errors.universityCountry && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.universityCountry.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    University City *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cambridge"
                  className={`input input-bordered w-full ${
                    errors.universityCity ? "input-error" : ""
                  }`}
                  {...register("universityCity", {
                    required: "City is required",
                  })}
                />
                {errors.universityCity && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.universityCity.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* World Rank & Subject Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    University World Rank *
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 1"
                  className={`input input-bordered w-full ${
                    errors.universityWorldRank ? "input-error" : ""
                  }`}
                  {...register("universityWorldRank", {
                    required: "World rank is required",
                    min: { value: 1, message: "Rank must be at least 1" },
                  })}
                />
                {errors.universityWorldRank && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.universityWorldRank.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Subject Category *
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.subjectCategory ? "select-error" : ""
                  }`}
                  {...register("subjectCategory", {
                    required: "Subject category is required",
                  })}
                >
                  <option value="">Select a category</option>
                  {subjectCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.subjectCategory && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.subjectCategory.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Scholarship Category & Degree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Scholarship Category *
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.scholarshipCategory ? "select-error" : ""
                  }`}
                  {...register("scholarshipCategory", {
                    required: "Scholarship category is required",
                  })}
                >
                  <option value="">Select a category</option>
                  {scholarshipCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.scholarshipCategory && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.scholarshipCategory.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Degree *</span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    errors.degree ? "select-error" : ""
                  }`}
                  {...register("degree", { required: "Degree is required" })}
                >
                  <option value="">Select a degree</option>
                  {degreeTypes.map((deg) => (
                    <option key={deg} value={deg}>
                      {deg}
                    </option>
                  ))}
                </select>
                {errors.degree && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.degree.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Tuition Fees, Application Fees & Service Charge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Tuition Fees (Optional)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 53790"
                  className="input input-bordered w-full"
                  {...register("tuitionFees", {
                    min: { value: 0, message: "Must be 0 or greater" },
                  })}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Application Fees *
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 75"
                  className={`input input-bordered w-full ${
                    errors.applicationFees ? "input-error" : ""
                  }`}
                  {...register("applicationFees", {
                    required: "Application fees is required",
                    min: {
                      value: 0,
                      message: "Application fees must be 0 or greater",
                    },
                  })}
                />
                {errors.applicationFees && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.applicationFees.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Service Charge *
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 25"
                  className={`input input-bordered w-full ${
                    errors.serviceCharge ? "input-error" : ""
                  }`}
                  {...register("serviceCharge", {
                    required: "Service charge is required",
                    min: {
                      value: 0,
                      message: "Service charge must be 0 or greater",
                    },
                  })}
                />
                {errors.serviceCharge && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.serviceCharge.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Application Deadline */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Application Deadline *
                </span>
              </label>
              <input
                type="date"
                className={`input input-bordered w-full ${
                  errors.applicationDeadline ? "input-error" : ""
                }`}
                {...register("applicationDeadline", {
                  required: "Application deadline is required",
                })}
              />
              {errors.applicationDeadline && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.applicationDeadline.message}
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => reset()}
                className="btn btn-ghost"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding Scholarship...
                  </>
                ) : (
                  "Add Scholarship"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddScholarship;

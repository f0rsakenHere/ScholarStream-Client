import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";

const formatCurrency = (v) => {
  if (v == null || v === "" || isNaN(Number(v))) return "Free";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(v));
};

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch scholarship details
  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get(`/scholarships/${id}`);
        setScholarship(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load scholarship details");
        console.error(err);
      }
    };

    if (id) {
      fetchScholarship();
    }
  }, [id, axiosPublic]);

  // Fetch reviews for this scholarship
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosPublic.get(`/reviews/scholarship/${id}`);
        if (res.data) {
          setReviews(res.data.reviews || []);
          setAverageRating(res.data.averageRating || 0);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id, axiosPublic]);

  const handleApply = () => {
    navigate(`/payment?scholarshipId=${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="alert alert-error">
          <span>{error || "Scholarship not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm mb-6"
      >
        ← Back
      </button>

      {/* Scholarship Header with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* University Image */}
          <figure className="mb-6 rounded-lg overflow-hidden bg-base-200 h-96">
            <img
              src={
                scholarship.universityImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  scholarship.universityName || "University"
                )}&background=6b21a8&color=fff&size=512`
              }
              alt={scholarship.universityName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  scholarship.universityName || "University"
                )}&background=6b21a8&color=fff&size=512`;
              }}
            />
          </figure>

          {/* Scholarship Title and Basic Info */}
          <h1 className="text-4xl font-bold mb-2">
            {scholarship.scholarshipName}
          </h1>
          <p className="text-lg text-base-content/70 mb-4">
            {scholarship.universityName}
          </p>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(scholarship.universityWorldRank ||
              scholarship.universityRank) && (
              <div className="stat bg-base-100 shadow">
                <div className="stat-title text-sm">World Rank</div>
                <div className="stat-value text-lg">
                  {scholarship.universityWorldRank ||
                    scholarship.universityRank}
                </div>
              </div>
            )}

            {scholarship.applicationDeadline && (
              <div className="stat bg-base-100 shadow">
                <div className="stat-title text-sm">Deadline</div>
                <div className="stat-value text-lg">
                  {new Date(
                    scholarship.applicationDeadline
                  ).toLocaleDateString()}
                </div>
              </div>
            )}

            {scholarship.universityCountry && (
              <div className="stat bg-base-100 shadow">
                <div className="stat-title text-sm">Location</div>
                <div className="stat-value text-lg">
                  {scholarship.universityCity
                    ? `${scholarship.universityCity}, `
                    : ""}
                  {scholarship.universityCountry}
                </div>
              </div>
            )}

            {scholarship.tuitionFees && (
              <div className="stat bg-base-100 shadow">
                <div className="stat-title text-sm">Tuition</div>
                <div className="stat-value text-lg">
                  {formatCurrency(scholarship.tuitionFees)}
                </div>
              </div>
            )}

            {scholarship.subjectCategory && (
              <div className="stat bg-base-100 shadow">
                <div className="stat-title text-sm">Subject</div>
                <div className="stat-value text-lg">
                  {scholarship.subjectCategory}
                </div>
              </div>
            )}

            <div className="stat bg-base-100 shadow">
              <div className="stat-title text-sm">Application Fee</div>
              <div className="stat-value text-lg text-primary">
                {formatCurrency(scholarship.applicationFees)}
              </div>
            </div>
          </div>

          {/* Description */}
          {scholarship.scholarshipDescription && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                About This Scholarship
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-base-content/80 leading-relaxed">
                  {scholarship.scholarshipDescription}
                </p>
              </div>
            </div>
          )}

          {/* Stipend/Coverage Details */}
          {scholarship.stipend && (
            <div className="card bg-base-100 shadow mb-8">
              <div className="card-body">
                <h2 className="card-title text-xl">Coverage & Stipend</h2>
                <div className="divider my-2"></div>
                <div className="space-y-3">
                  {typeof scholarship.stipend === "string" ? (
                    <p className="text-base-content/80">
                      {scholarship.stipend}
                    </p>
                  ) : (
                    Object.entries(scholarship.stipend).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-base-content/70 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="font-semibold text-primary">
                          {typeof value === "number"
                            ? formatCurrency(value)
                            : value}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {scholarship.degree && (
              <div className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="text-sm text-base-content/60">
                    Degree Level
                  </div>
                  <div className="font-semibold">{scholarship.degree}</div>
                </div>
              </div>
            )}
            {scholarship.scholarshipCategory && (
              <div className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="text-sm text-base-content/60">Category</div>
                  <div className="font-semibold">
                    {scholarship.scholarshipCategory}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Apply Button */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg sticky top-24">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Ready to Apply?</h3>

              {/* Application Fee Summary */}
              <div className="bg-primary/10 p-4 rounded-lg mb-6">
                <div className="text-sm text-base-content/60 mb-1">
                  Application Fee
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(scholarship.applicationFees)}
                </div>
              </div>

              {/* Deadline Warning */}
              {scholarship.applicationDeadline && (
                <div className="alert alert-warning alert-sm mb-6">
                  <span className="text-sm">
                    Deadline:{" "}
                    {new Date(
                      scholarship.applicationDeadline
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={handleApply}
                className="btn btn-primary btn-lg w-full mb-3 text-white"
              >
                Apply for Scholarship
              </button>

              {/* Quick Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Easy application process</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Student Reviews</h2>
            <p className="text-base-content/60 mt-2">
              See what other students think about this scholarship
            </p>
          </div>
          {reviews.length > 0 && (
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {averageRating}
              </div>
              <div className="flex gap-1 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-base-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-base-content/60 mt-1">
                Based on {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="alert alert-info">
            <span>
              No reviews yet. Be the first to review this scholarship!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          review.userImage ||
                          review.reviewerImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            review.userName || review.reviewerName || "User"
                          )}&background=6b21a8&color=fff`
                        }
                        alt={review.userName || review.reviewerName || "User"}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            review.userName || review.reviewerName || "User"
                          )}&background=6b21a8&color=fff`;
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-base-content">
                          {review.userName || review.reviewerName || "User"}
                        </h4>
                        <p className="text-sm text-base-content/60">
                          {new Date(
                            review.reviewDate || review.createdAt || review.date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1">
                      {(() => {
                        const r = review.ratingPoint || review.rating || 0;
                        return [...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.round(r)
                                ? "text-yellow-400 text-lg"
                                : "text-base-300 text-lg"
                            }
                          >
                            ★
                          </span>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-base-content/80">
                    {review.reviewComment ||
                      review.reviewText ||
                      review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipDetails;

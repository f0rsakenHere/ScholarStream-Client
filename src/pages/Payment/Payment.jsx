import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const scholarshipId = searchParams.get("scholarshipId");

  const [scholarship, setScholarship] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch scholarship details and create payment intent
  useEffect(() => {
    if (!scholarshipId) {
      setError("No scholarship selected");
      setLoading(false);
      return;
    }

    const fetchAndCreatePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch scholarship details
        const scholarRes = await axiosSecure.get(
          `/scholarships/${scholarshipId}`
        );
        const scholarData = scholarRes.data;
        setScholarship(scholarData);

        // Create payment intent
        const paymentRes = await axiosSecure.post(
          "/payments/create-payment-intent",
          {
            price: Number(scholarData.applicationFees) || 0,
          }
        );

        if (paymentRes.data.clientSecret) {
          setClientSecret(paymentRes.data.clientSecret);
        }
      } catch (err) {
        console.error("Payment error:", err);
        setError(err.response?.data?.message || "Failed to process payment");
      } finally {
        setLoading(false);
      }
    };

    fetchAndCreatePayment();
  }, [scholarshipId, axiosSecure]);

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
        <div className="max-w-lg mx-auto">
          <div className="alert alert-error mb-6">
            <span>{error || "Scholarship not found"}</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm mb-6"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Application Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  Complete Your Application
                </h2>

                {clientSecret && stripePromise ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                      },
                    }}
                  >
                    <CheckoutForm scholarship={scholarship} />
                  </Elements>
                ) : (
                  <div className="alert alert-warning">
                    <span>Preparing payment form...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg sticky top-24">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Order Summary</h3>

                {/* Scholarship Info */}
                <div className="mb-6">
                  {scholarship.universityImage && (
                    <img
                      src={scholarship.universityImage}
                      alt={scholarship.universityName}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <h4 className="font-semibold text-base-content mb-1">
                    {scholarship.scholarshipName}
                  </h4>
                  <p className="text-sm text-base-content/60">
                    {scholarship.universityName}
                  </p>
                </div>

                <div className="divider my-2"></div>

                {/* Fee Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">
                      Application Fee
                    </span>
                    <span className="font-semibold">
                      ${Number(scholarship.applicationFees || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="divider my-2"></div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${Number(scholarship.applicationFees || 0).toFixed(2)}
                  </span>
                </div>

                {/* Info */}
                <div className="alert alert-info alert-sm">
                  <span className="text-sm">
                    Your payment is secured and encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

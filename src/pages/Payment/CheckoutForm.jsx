import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckoutForm = ({ scholarship }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const saveApplication = async (paymentIntent) => {
    try {
      const applicationData = {
        scholarshipId: scholarship._id,
        universityName: scholarship.universityName,
        universityCity: scholarship.universityCity || "Not specified",
        universityCountry: scholarship.universityCountry || "Not specified",
        universityAddress:
          scholarship.universityCity ||
          scholarship.location ||
          scholarship.universityAddress ||
          "Not specified",
        scholarshipCategory: scholarship.scholarshipCategory,
        degree: scholarship.degree,
        applicationFees: Number(scholarship.applicationFees) || 0,
        serviceCharge: Number(scholarship.serviceCharge) || 5, // Default service charge if not specified
        applicantName: user?.displayName || "Unknown",
        applicantEmail: user?.email,
        transactionId: paymentIntent.id,
      };

      console.log("Sending application data:", applicationData);

      const response = await axiosSecure.post("/applications", applicationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error saving application:", error);
      console.error("Error response:", error.response?.data);

      // Handle duplicate application error
      if (error.response?.status === 409) {
        return {
          success: false,
          message: "You have already applied for this scholarship",
        };
      }

      return {
        success: false,
        message: error.response?.data?.error || "Failed to save application",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Payment service not available");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Save application after successful payment
        const result = await saveApplication(paymentIntent);

        if (result.success) {
          navigate(`/payment-success?paymentId=${paymentIntent.id}`);
        } else {
          setErrorMessage(
            result.message ||
              "Payment successful but failed to save application. Please contact support."
          );
          setIsProcessing(false);
        }
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        // 3D Secure or other authentication required
        setErrorMessage(
          "Authentication required. Please complete the verification."
        );
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || "An error occurred during payment");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {errorMessage && (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn btn-primary w-full text-white"
      >
        {isProcessing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing...
          </>
        ) : (
          `Pay $${Number(scholarship.applicationFees || 0).toFixed(2)}`
        )}
      </button>

      <p className="text-xs text-base-content/60 text-center">
        Your payment information is secure and encrypted.
      </p>
    </form>
  );
};

export default CheckoutForm;

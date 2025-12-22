import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Confirming your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-green-600"
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
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your scholarship application fee has been processed successfully.
        </p>

        {/* Payment Details */}
        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Payment ID</p>
            <p className="font-mono text-sm text-gray-800 break-all">
              {paymentId}
            </p>
          </div>
        )}

        {/* Confirmation Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            A confirmation email has been sent to your registered email address.
            Your application is now under review by our moderators.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard/my-applications")}
            className="btn btn-primary w-full text-white"
          >
            View My Applications
          </button>
          <Link to="/" className="btn btn-outline w-full">
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 mt-8">
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

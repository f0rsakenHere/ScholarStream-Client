import { Link } from "react-router-dom";

const PaymentFail = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
        <p className="mb-4">
          Unfortunately, your payment could not be processed.
        </p>
        <Link to="/dashboard/my-applications" className="btn btn-error mt-4">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentFail;

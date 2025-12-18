import { Link, useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const { tranId } = useParams();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="mb-4">Your transaction was completed successfully.</p>
        <p className="mb-4 font-semibold">
          Transaction ID: <span className="text-green-900">{tranId}</span>
        </p>
        <Link to="/dashboard/my-applications" className="btn btn-success mt-4">
          Go to My Applications
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

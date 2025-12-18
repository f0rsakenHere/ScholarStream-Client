import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (loading || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (user && userData?.role === "admin") {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default AdminRoute;

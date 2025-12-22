import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isStudent, isRoleLoading } = useUserRole();
  const location = useLocation();

  if (loading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (user && isStudent) {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default StudentRoute;

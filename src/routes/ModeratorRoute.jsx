import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const ModeratorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAdmin, isModerator, isRoleLoading } = useUserRole();
  const location = useLocation();

  if (loading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Moderators and Admins can access moderator routes
  if (user && (isModerator || isAdmin)) {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default ModeratorRoute;

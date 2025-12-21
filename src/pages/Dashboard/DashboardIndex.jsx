import { Navigate } from "react-router-dom";
import useUserRole from "../../hooks/useUserRole";

const DashboardIndex = () => {
  const { isRoleLoading, isAdmin, isModerator, isStudent } = useUserRole();

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isAdmin) return <Navigate to="admin-analytics" replace />;
  if (isModerator) return <Navigate to="manage-applications" replace />;
  // Default for students
  return <Navigate to="user-profile" replace />;
};

export default DashboardIndex;

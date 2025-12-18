import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaBook,
  FaList,
  FaChartLine,
  FaPlusCircle,
  FaFileAlt,
  FaStar,
  FaClipboardList,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isModerator, isStudent, userRole, isRoleLoading } =
    useUserRole();

  // CRITICAL FIX: Show a loader while checking the role
  // If we don't do this, it defaults to "Student" instantly
  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-primary text-primary-content shadow-md font-semibold"
        : "text-base-content hover:bg-base-300 hover:pl-5"
    }`;

  // Get role label for dashboard header
  const getRoleLabel = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isModerator) return "Moderator Dashboard";
    return "Student Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-base-100 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-base-200 shadow-xl flex flex-col z-10">
        <div className="p-6 border-b border-base-300">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>🎓</span> ScholarStream
          </h2>
          <p className="text-xs text-base-content/60 mt-1 pl-1">
            {getRoleLabel()}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Student Routes - Show for students or when role is loading */}
          {isStudent && (
            <>
              <div className="divider text-xs font-bold text-base-content/40 my-2">
                STUDENT MENU
              </div>

              <NavLink to="/dashboard/user-profile" className={navLinkClasses}>
                <FaUser /> My Profile
              </NavLink>

              <NavLink
                to="/dashboard/my-applications"
                className={navLinkClasses}
              >
                <FaFileAlt /> My Applications
              </NavLink>

              <NavLink to="/dashboard/my-reviews" className={navLinkClasses}>
                <FaStar /> My Reviews
              </NavLink>
            </>
          )}

          {/* Moderator Routes */}
          {isModerator && (
            <>
              <div className="divider text-xs font-bold text-base-content/40 my-2">
                MODERATOR MENU
              </div>

              <NavLink
                to="/dashboard/moderator-profile"
                className={navLinkClasses}
              >
                <FaUser /> Moderator Profile
              </NavLink>

              <NavLink
                to="/dashboard/manage-scholarships"
                className={navLinkClasses}
              >
                <FaList /> Manage Scholarships
              </NavLink>

              <NavLink
                to="/dashboard/manage-applications"
                className={navLinkClasses}
              >
                <FaClipboardList /> Manage Applications
              </NavLink>

              <NavLink to="/dashboard/all-reviews" className={navLinkClasses}>
                <FaStar /> All Reviews
              </NavLink>
            </>
          )}

          {/* Admin Routes */}
          {isAdmin && (
            <>
              <div className="divider text-xs font-bold text-base-content/40 my-2">
                ADMIN MENU
              </div>

              <NavLink to="/dashboard/admin-profile" className={navLinkClasses}>
                <FaUser /> Admin Profile
              </NavLink>

              <NavLink
                to="/dashboard/add-scholarship"
                className={navLinkClasses}
              >
                <FaPlusCircle /> Add Scholarship
              </NavLink>

              <NavLink
                to="/dashboard/manage-scholarships"
                className={navLinkClasses}
              >
                <FaList /> Manage Scholarships
              </NavLink>

              <NavLink to="/dashboard/manage-users" className={navLinkClasses}>
                <FaUsers /> Manage Users
              </NavLink>

              <NavLink
                to="/dashboard/admin-analytics"
                className={navLinkClasses}
              >
                <FaChartLine /> Analytics
              </NavLink>
            </>
          )}

          {/* Shared/Common Links */}
          <div className="divider text-xs font-bold text-base-content/40 my-2">
            MAIN MENU
          </div>
          <NavLink to="/" className={navLinkClasses}>
            <FaHome /> Home
          </NavLink>
        </nav>

        {/* User Footer */}
        <div className="p-4 bg-base-300/50 border-t border-base-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar online">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/40"}
                  alt="User"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {user?.email}
              </p>
              <span className="badge badge-sm badge-primary mt-1 capitalize">
                {userRole}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-error btn-outline btn-sm w-full flex items-center gap-2"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-base-100 shadow-sm p-4 flex justify-between items-center z-0">
          <h1 className="text-xl font-bold text-base-content">
            {getRoleLabel()}
          </h1>
          {/* You can add a Theme Toggle or Notification Bell here */}
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-base-200/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

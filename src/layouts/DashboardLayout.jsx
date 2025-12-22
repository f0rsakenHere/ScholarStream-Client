import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isModerator, isStudent, userRole, isRoleLoading } =
    useUserRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-lg font-semibold"
        : "text-base-content/70 hover:bg-base-100 hover:text-base-content"
    }`;

  const getRoleLabel = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isModerator) return "Moderator Dashboard";
    return "Student Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-base-100 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-72 bg-white border-r border-base-200/30 shadow-sm flex flex-col z-30 transition-transform duration-300 h-screen md:h-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-6 py-5 border-b border-base-200/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-b from-purple-200 to-purple-400 text-white font-bold">
              🎓
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-700">
                ScholarStream
              </h3>
              <div className="text-xs text-base-content/60">
                {getRoleLabel()}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {isAdmin && (
            <div>
              <div className="text-xs font-semibold text-base-content/40 mb-2">
                ADMIN MENU
              </div>
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/dashboard/admin-profile"
                  className={navLinkClasses}
                >
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
                <NavLink
                  to="/dashboard/manage-users"
                  className={navLinkClasses}
                >
                  <FaUsers /> Manage Users
                </NavLink>
                <NavLink
                  to="/dashboard/admin-analytics"
                  className={navLinkClasses}
                >
                  <FaChartLine /> Analytics
                </NavLink>
              </div>
            </div>
          )}

          {isModerator && (
            <div>
              <div className="text-xs font-semibold text-base-content/40 mb-2">
                MODERATOR MENU
              </div>
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/dashboard/moderator-profile"
                  className={navLinkClasses}
                >
                  <FaUser /> Moderator Profile
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
              </div>
            </div>
          )}

          {isStudent && (
            <div>
              <div className="text-xs font-semibold text-base-content/40 mb-2">
                STUDENT MENU
              </div>
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/dashboard/user-profile"
                  className={navLinkClasses}
                >
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
              </div>
            </div>
          )}

          <div className="text-xs font-semibold text-base-content/40 mt-4 mb-2">
            MAIN MENU
          </div>
          <NavLink to="/" className={navLinkClasses}>
            <FaHome /> Home
          </NavLink>
        </nav>

        {/* Expanded nav (visible on md and above) */}
        <div className="p-4 border-t border-base-200/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={(() => {
                  const p = user?.photoURL;
                  const name = user?.displayName || user?.email || "User";
                  const initialsSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    name
                  )}&background=6b21a8&color=fff&rounded=true&size=64`;
                  if (!p) return initialsSrc;
                  if (/^https?:\/\//.test(p) || /^data:image\//.test(p))
                    return p;
                  if (/^\/\//.test(p)) return `https:${p}`;
                  return initialsSrc;
                })()}
                alt={user?.displayName || user?.email || "User"}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.displayName || user?.email || "User"
                  )}&background=6b21a8&color=fff&rounded=true&size=64`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {user?.email}
              </p>
              <div className="mt-2">
                <span className="badge badge-sm bg-purple-600 text-white capitalize">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm w-full rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-base-100 shadow-sm p-4 flex justify-between items-center z-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost btn-circle md:hidden"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <h1 className="text-xl font-bold text-base-content flex-1 text-center md:text-left">
            {getRoleLabel()}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-base-200/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

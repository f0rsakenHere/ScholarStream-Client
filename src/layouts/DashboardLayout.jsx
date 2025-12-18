import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-300"
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-300"
                }`
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/dashboard/scholarships"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-300"
                }`
              }
            >
              Scholarships
            </NavLink>
            {/* Admin/Moderator routes can be conditionally rendered here */}
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-6 border-t border-base-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/40"}
                  alt={user?.displayName || "User"}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-base-100 shadow-sm p-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.displayName}!</h1>
        </header>
        <main className="flex-1 p-6 bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const [filterRole, setFilterRole] = useState("all");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.users || [];
    },
  });

  const filteredUsers = users.filter((u) =>
    filterRole === "all" ? true : u.role === filterRole
  );

  const handleChangeRole = async (userId, newRole) => {
    if (!userId) return;

    // Prevent changing own role
    const userObj = users.find((u) => u._id === userId);
    if (userObj?.email === currentUser?.email) {
      toast.error("You cannot change your own role.");
      return;
    }

    const confirm = await Swal.fire({
      title: `Change role to ${newRole}?`,
      text: `This will set the user role to '${newRole}'. Proceed?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
    });

    if (!confirm.isConfirmed) return;

    const body = {
      name: userObj?.name || userObj?.displayName || "",
      email: userObj?.email,
      photoURL: userObj?.photoURL || "",
      role: newRole,
    };

    try {
      setUpdatingUserId(userId);
      const res = await axiosSecure.put(`/users/${userId}`, body);
      if (res.status === 200) {
        toast.success("User role updated");
        refetch();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;

    const userObj = users.find((u) => u._id === userId);
    if (userObj?.email === currentUser?.email) {
      toast.error("You cannot delete your own account.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user!",
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeletingUserId(userId);
      const res = await axiosSecure.delete(`/users/${userId}`);
      if (res.status === 200) {
        toast.success("User deleted");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Error loading users. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Manage Users</h2>

          {/* Filter */}
          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Filter by role:</label>
            <select
              className="select select-bordered w-48"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All</option>
              <option value="student">Student</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="alert alert-info">
                <span>No users found.</span>
              </div>
            ) : (
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-base-200">
                      <td>
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={(() => {
                                const p = u?.photoURL;
                                if (!p)
                                  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    u?.name ||
                                      u?.displayName ||
                                      u?.email ||
                                      "User"
                                  )}&background=6b21a8&color=fff&rounded=true&size=64`;

                                // Accept https:// or http:// or protocol-relative // or data:image/*
                                if (
                                  /^https?:\/\//.test(p) ||
                                  /^data:image\//.test(p)
                                )
                                  return p;
                                if (/^\/\//.test(p)) return `https:${p}`;

                                // Otherwise fallback to generated avatar
                                return `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  u?.name ||
                                    u?.displayName ||
                                    u?.email ||
                                    "User"
                                )}&background=6b21a8&color=fff&rounded=true&size=64`;
                              })()}
                              alt={u?.name || u?.displayName || u?.email}
                              title={u?.name || u?.displayName || u?.email}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  u?.name ||
                                    u?.displayName ||
                                    u?.email ||
                                    "User"
                                )}&background=6b21a8&color=fff&rounded=true&size=64`;
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">
                          {u?.name || u?.displayName || "-"}
                        </div>
                      </td>
                      <td>{u?.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            u?.role === "admin"
                              ? "badge-error"
                              : u?.role === "moderator"
                              ? "badge-warning"
                              : "badge-ghost"
                          }`}
                        >
                          {u?.role || "student"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {/* Role change dropdown */}
                          <div className="flex items-center gap-2">
                            <select
                              className="select select-sm select-bordered w-40"
                              value={u.role || "student"}
                              onChange={(e) =>
                                handleChangeRole(u._id, e.target.value)
                              }
                              disabled={
                                u.email === currentUser?.email ||
                                updatingUserId === u._id ||
                                deletingUserId === u._id
                              }
                            >
                              <option value="student">Student</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>

                            {updatingUserId === u._id && (
                              <span
                                className="loading loading-spinner loading-xs ml-2"
                                title="Updating..."
                              ></span>
                            )}

                            {/* Delete */}
                            <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={
                                u.email === currentUser?.email ||
                                deletingUserId === u._id ||
                                updatingUserId === u._id
                              }
                              title={
                                u.email === currentUser?.email
                                  ? "Can't delete yourself"
                                  : "Delete user"
                              }
                            >
                              {deletingUserId === u._id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;

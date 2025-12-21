import { useAuth } from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";

const StudentProfile = () => {
  const { user } = useAuth();
  const { userRole, isRoleLoading } = useUserRole();

  const avatarSrc =
    user?.photoURL &&
    (user.photoURL.startsWith("http") || user.photoURL.startsWith("//"))
      ? user.photoURL.startsWith("//")
        ? `https:${user.photoURL}`
        : user.photoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.displayName || user?.email || "User"
        )}&background=6b21a8&color=fff&rounded=true&size=128`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Student Profile</h2>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="avatar">
              <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img
                  src={avatarSrc}
                  alt={user?.displayName || "Student"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.displayName || user?.email || "User"
                    )}&background=6b21a8&color=fff&rounded=true&size=128`;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Profile Info (Read-only) */}
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                value={user?.displayName || ""}
                disabled
                className="input input-bordered w-full bg-base-200 text-base-content/60"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="input input-bordered w-full bg-base-200 text-base-content/60"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Photo URL</span>
              </label>
              <input
                type="url"
                value={user?.photoURL || ""}
                disabled
                className="input input-bordered w-full bg-base-200 text-base-content/60"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Role</span>
              </label>
              <input
                type="text"
                value={isRoleLoading ? "Loading..." : userRole || "student"}
                disabled
                className="input input-bordered w-full bg-base-200 text-base-content/60"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Account Created
                </span>
              </label>
              <input
                type="text"
                value={
                  user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "N/A"
                }
                disabled
                className="input input-bordered w-full bg-base-200 text-base-content/60"
              />
            </div>
          </div>

          <div className="card-actions justify-end mt-8">
            <p className="text-sm text-base-content/60">
              Profile information is read-only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

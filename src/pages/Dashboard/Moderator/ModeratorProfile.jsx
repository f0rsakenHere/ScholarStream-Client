import { useAuth } from "../../../hooks/useAuth";

const ModeratorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Moderator Profile</h2>

          {/* Moderator Avatar */}
          <div className="flex justify-center mb-6">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    user?.photoURL ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user?.displayName || "Moderator")
                  }
                  alt="Moderator Avatar"
                />
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {/* Name */}
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

            {/* Email */}
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

            {/* Photo URL */}
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

            {/* Moderator Status */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Role</span>
              </label>
              <input
                type="text"
                value="Moderator"
                disabled
                className="input input-bordered w-full bg-base-200 text-base-content/60"
              />
            </div>

            {/* Account Created Date */}
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

          {/* Action Buttons */}
          <div className="card-actions justify-end mt-8 gap-3">
            <p className="text-sm text-base-content/60">
              Profile information is read-only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorProfile;

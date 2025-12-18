import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: userRole,
    isPending: isQueryLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [user?.email, "userRole"],
    enabled: !authLoading && !!user?.email,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    queryFn: async () => {
      try {
        const token = localStorage.getItem("access-token");
        console.log("useUserRole - JWT Token exists:", !!token);

        if (!token) {
          console.log("No token, returning student");
          return "student";
        }

        // Fetch all users and find the one with matching email
        const res = await axiosSecure.get(`/api/users`);
        console.log("useUserRole - API response:", res.data);
        const users = res.data.users; // Response format: { total, users: [...] }
        const currentUser = users.find((u) => u.email === user.email);
        console.log("useUserRole - found user:", currentUser);
        console.log("useUserRole - role:", currentUser?.role);
        return currentUser?.role || "student";
      } catch (error) {
        console.error("Error fetching user role:", error);
        console.error("Error response:", error.response?.data);
        return "student"; // Default to student on error
      }
    },
  });

  // Combined loading state: auth loading OR query loading
  const isRoleLoading = authLoading || isQueryLoading;

  // Only derive role booleans AFTER loading is complete
  const effectiveRole = isRoleLoading ? undefined : userRole || "student";

  const isAdmin = effectiveRole === "admin";
  const isModerator = effectiveRole === "moderator";
  const isStudent =
    !isRoleLoading &&
    (effectiveRole === "student" || (!isAdmin && !isModerator));

  return {
    userRole: effectiveRole,
    isAdmin,
    isModerator,
    isStudent,
    isRoleLoading,
    isError,
    refetch,
  };
};

export default useUserRole;

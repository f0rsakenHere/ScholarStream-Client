import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: userRole = "student", // Default to student
    isPending: isRoleLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [user?.email, "userRole"],
    enabled: !loading && !!user?.email,
    retry: 1,
    queryFn: async () => {
      try {
        // Fetch all users and find the one with matching email
        const res = await axiosSecure.get(`/users`);
        const users = res.data;
        const currentUser = users.find((u) => u.email === user.email);
        console.log("useUserRole - found user:", currentUser);
        console.log("useUserRole - role:", currentUser?.role);
        return currentUser?.role || "student";
      } catch (error) {
        console.error("Error fetching user role:", error);
        return "student"; // Default to student on error
      }
    },
  });

  // Derive role booleans - default to student if still loading or error
  const effectiveRole = isRoleLoading || isError ? "student" : userRole;

  const isAdmin = effectiveRole === "admin";
  const isModerator = effectiveRole === "moderator";
  const isStudent = effectiveRole === "student" || (!isAdmin && !isModerator);

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

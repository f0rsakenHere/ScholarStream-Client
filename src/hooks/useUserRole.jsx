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
        const res = await axiosSecure.get(`/users?email=${user.email}`);
        // Find the user in the response
        const userData = Array.isArray(res.data)
          ? res.data.find((u) => u.email === user.email)
          : res.data;
        return userData?.role || "student";
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

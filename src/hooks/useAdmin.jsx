import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      // Fetch all users and find the one with matching email
      const res = await axiosSecure.get(`/api/users`);
      const users = res.data.users; // Response format: { total, users: [...] }
      const currentUser = users.find((u) => u.email === user.email);
      console.log("Admin check - found user:", currentUser);
      return currentUser?.role === "admin";
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;

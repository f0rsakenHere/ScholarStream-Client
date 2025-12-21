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
      const res = await axiosSecure.get(`/users`);
      const users = res.data.users;
      const currentUser = users.find((u) => u.email === user.email);
      console.log("Admin check - found user:", currentUser);
      return currentUser?.role === "admin";
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;

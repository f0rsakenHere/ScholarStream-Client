import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useModerator = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isModerator, isPending: isModeratorLoading } = useQuery({
    queryKey: [user?.email, "isModerator"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      // Fetch all users and find the one with matching email
      const res = await axiosSecure.get(`/users`);
      const users = res.data;
      const currentUser = users.find((u) => u.email === user.email);
      console.log("Moderator check - found user:", currentUser);
      return currentUser?.role === "moderator";
    },
  });

  return [isModerator, isModeratorLoading];
};

export default useModerator;

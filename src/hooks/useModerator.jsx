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
      const res = await axiosSecure.get(`/users?email=${user.email}`);
      // Find the user in the response
      const userData = Array.isArray(res.data)
        ? res.data.find((u) => u.email === user.email)
        : res.data;
      return userData?.role === "moderator";
    },
  });

  return [isModerator, isModeratorLoading];
};

export default useModerator;

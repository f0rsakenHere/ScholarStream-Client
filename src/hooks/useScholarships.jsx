import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useScholarships = (options = {}) => {
  const axiosPublic = useAxiosPublic();
  const { enabled = true } = options;

  const {
    data: scholarships = [],
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["scholarships"],
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes - prevents unnecessary refetches
    queryFn: async () => {
      // Fetch all scholarships once, filtering will be done client-side for smooth UX
      const res = await axiosPublic.get("/scholarships/all-scholarships");

      // Backend might return an array or an object like { scholarships: [...] }
      if (Array.isArray(res.data)) return res.data;
      return res.data.scholarships || res.data || [];
    },
  });

  return { scholarships, isPending, isFetching, isError, error, refetch };
};

export default useScholarships;

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useScholarships = (options = {}) => {
  const axiosPublic = useAxiosPublic();
  const { search, country, category, degree, sort, enabled = true } = options;

  const {
    data: scholarships = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["scholarships", search, country, category, degree, sort],
    enabled,
    queryFn: async () => {
      // Build query parameters based on your backend API
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (country) params.append("country", country);
      if (category) params.append("category", category);
      if (degree) params.append("degree", degree);
      if (sort) params.append("sort", sort);

      const queryString = params.toString();
      const url = queryString
        ? `/scholarships/all-scholarships?${queryString}`
        : "/scholarships/all-scholarships";

      const res = await axiosPublic.get(url);
      return res.data;
    },
  });

  return { scholarships, isPending, isError, error, refetch };
};

export default useScholarships;

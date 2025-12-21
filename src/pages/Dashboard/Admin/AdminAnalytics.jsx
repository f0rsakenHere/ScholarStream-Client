import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#6b21a8",
  "#f97316",
  "#06b6d4",
  "#ef4444",
  "#f59e0b",
  "#10b981",
];

const formatCurrency = (v) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v || 0);
  } catch {
    return `$${v || 0}`;
  }
};

const AdminAnalytics = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/admin-stats");
      return res.data;
    },
  });

  const {
    totalUsers = 0,
    totalScholarships = 0,
    totalApplications = 0,
    totalRevenue = 0,
    chartData = [],
  } = data || {};

  // Ensure chart data is safe for recharts
  const safeChartData = useMemo(() => {
    if (!Array.isArray(chartData)) return [];
    return chartData.map((d) => ({
      name: d._id || d.name || "N/A",
      count: d.count || 0,
    }));
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Error loading admin statistics. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">Admin Analytics</h2>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm"
                onClick={() => refetch()}
                title="Refresh stats"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card bg-base-200 p-4">
              <div className="text-sm text-base-content/60">Total Users</div>
              <div className="text-2xl font-bold mt-2">{totalUsers}</div>
            </div>

            <div className="card bg-base-200 p-4">
              <div className="text-sm text-base-content/60">
                Total Scholarships
              </div>
              <div className="text-2xl font-bold mt-2">{totalScholarships}</div>
            </div>

            <div className="card bg-base-200 p-4">
              <div className="text-sm text-base-content/60">Total Revenue</div>
              <div className="text-2xl font-bold mt-2">
                {formatCurrency(totalRevenue)}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-200 p-4">
              <div className="text-sm text-base-content/60 mb-2">
                Applications by Category / University
              </div>
              {safeChartData.length === 0 ? (
                <div className="alert alert-info">No chart data available.</div>
              ) : (
                <div style={{ height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={safeChartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill={COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card bg-base-200 p-4">
              <div className="text-sm text-base-content/60 mb-2">
                Distribution
              </div>
              {safeChartData.length === 0 ? (
                <div className="alert alert-info">No chart data available.</div>
              ) : (
                <div style={{ height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={safeChartData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {safeChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Totals summary */}
          <div className="mt-6">
            <div className="text-sm text-base-content/60">Other stats</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div className="p-3 bg-base-100 rounded-lg">
                Applications: <strong>{totalApplications}</strong>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                Revenue (raw): <strong>{totalRevenue}</strong>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                Last updated: <strong>{new Date().toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

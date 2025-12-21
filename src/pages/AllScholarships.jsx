import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useScholarships from "../hooks/useScholarships";

const formatCurrency = (v) => {
  if (v == null || v === "" || isNaN(Number(v))) return "Free";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(v));
};

const AllScholarships = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [degree, setDegree] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("");
  const [fundingType, setFundingType] = useState("");

  // Debounce search input for smoother typing
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchInput.trim().toLowerCase()),
      400
    );
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch all scholarships once - filtering is done client-side
  const { scholarships = [], isPending, isError } = useScholarships();

  // derive filter option lists from returned scholarships
  const { categories, degrees, countries } = useMemo(() => {
    const s = scholarships || [];
    const categories = Array.from(
      new Set(s.map((x) => x.scholarshipCategory).filter(Boolean))
    ).sort();
    const degrees = Array.from(
      new Set(s.map((x) => x.degree).filter(Boolean))
    ).sort();
    const countries = Array.from(
      new Set(s.map((x) => x.universityCountry || x.location).filter(Boolean))
    ).sort();
    return { categories, degrees, countries };
  }, [scholarships]);

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategory("");
    setDegree("");
    setCountry("");
    setFundingType("");
    setSort("");
  };

  // Client-side filtering for instant, smooth UX
  const visibleScholarships = useMemo(() => {
    let list = scholarships || [];

    // Search filter
    if (debouncedSearch) {
      list = list.filter(
        (s) =>
          (s.scholarshipName || "").toLowerCase().includes(debouncedSearch) ||
          (s.universityName || "").toLowerCase().includes(debouncedSearch) ||
          (s.degree || "").toLowerCase().includes(debouncedSearch)
      );
    }

    // Category filter
    if (category) {
      list = list.filter((s) => s.scholarshipCategory === category);
    }

    // Funding type filter
    if (fundingType) {
      list = list.filter((s) => s.scholarshipCategory === fundingType);
    }

    // Degree filter
    if (degree) {
      list = list.filter((s) => s.degree === degree);
    }

    // Country filter
    if (country) {
      list = list.filter(
        (s) => s.universityCountry === country || s.location === country
      );
    }

    // Sorting
    if (sort === "fees_asc") {
      list = [...list].sort(
        (a, b) =>
          (Number(a.applicationFees) || 0) - (Number(b.applicationFees) || 0)
      );
    } else if (sort === "fees_desc") {
      list = [...list].sort(
        (a, b) =>
          (Number(b.applicationFees) || 0) - (Number(a.applicationFees) || 0)
      );
    } else if (sort === "date_asc") {
      list = [...list].sort((a, b) => {
        const da = a.applicationDeadline
          ? new Date(a.applicationDeadline).getTime()
          : Infinity;
        const db = b.applicationDeadline
          ? new Date(b.applicationDeadline).getTime()
          : Infinity;
        return da - db;
      });
    } else if (sort === "date_desc") {
      list = [...list].sort((a, b) => {
        const da = a.applicationDeadline
          ? new Date(a.applicationDeadline).getTime()
          : 0;
        const db = b.applicationDeadline
          ? new Date(b.applicationDeadline).getTime()
          : 0;
        return db - da;
      });
    }

    return list;
  }, [
    scholarships,
    debouncedSearch,
    category,
    degree,
    country,
    sort,
    fundingType,
  ]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Failed to load scholarships. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-16">
      {/* Search & Filters */}
      <div className="mb-6">
        {/* Search bar */}
        <div className="relative w-full mb-6">
          <span className="absolute inset-y-0 left-4 flex items-center text-base-content/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
              />
            </svg>
          </span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search by scholarship name, university, or degree..."
            className="input input-bordered w-full pl-12 pr-4 h-12 rounded-full focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered select-sm w-full h-10"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Location
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="select select-bordered select-sm w-full h-10"
            >
              <option value="">All Locations</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Degree
            </label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="select select-bordered select-sm w-full h-10"
            >
              <option value="">All Degrees</option>
              {degrees.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Funding
            </label>
            <select
              value={fundingType}
              onChange={(e) => setFundingType(e.target.value)}
              className="select select-bordered select-sm w-full h-10"
            >
              <option value="">All Types</option>
              <option value="Full Ride">Full Ride</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-bordered select-sm w-full h-10"
            >
              <option value="">Default</option>
              <option value="fees_asc">Fees: Low → High</option>
              <option value="fees_desc">Fees: High → Low</option>
              <option value="date_asc">Deadline: Soonest</option>
              <option value="date_desc">Deadline: Latest</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {visibleScholarships.length}
            </span>
            <span className="text-sm text-base-content/60">
              scholarships found
            </span>
          </div>
          {(category ||
            country ||
            degree ||
            fundingType ||
            sort ||
            searchInput) && (
            <button
              className="btn btn-ghost btn-sm text-base-content/60 hover:text-error"
              onClick={clearFilters}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Scholarships Grid */}
      {visibleScholarships.length === 0 ? (
        <div className="alert alert-info">No scholarships found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleScholarships.map((s) => (
            <div
              key={s._id}
              className="card bg-base-100 shadow hover:shadow-lg transition-shadow"
            >
              <figure className="h-40 overflow-hidden bg-base-200">
                <img
                  src={
                    s.universityImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      s.universityName || s.scholarshipName || "University"
                    )}&background=6b21a8&color=fff&rounded=true&size=256`
                  }
                  alt={s.universityName || s.scholarshipName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      s.universityName || s.scholarshipName || "University"
                    )}&background=6b21a8&color=fff&rounded=true&size=256`;
                  }}
                />
              </figure>

              <div className="card-body">
                <h3 className="font-semibold text-lg">{s.scholarshipName}</h3>
                <p className="text-sm text-base-content/70">
                  {s.universityName}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <span className="badge badge-sm badge-primary">
                    {s.scholarshipCategory}
                  </span>
                  <span className="badge badge-sm">{s.degree}</span>
                  <span className="text-sm text-base-content/70 ml-auto">
                    {s.universityCity ? `${s.universityCity}, ` : ""}
                    {s.universityCountry}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-base-content/70">
                    Application Fee:{" "}
                    <span className="font-medium">
                      {s.applicationFees
                        ? formatCurrency(s.applicationFees)
                        : "None"}
                    </span>
                  </div>
                  <Link
                    to={`/scholarship/${s._id}`}
                    className="btn btn-sm btn-primary text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllScholarships;

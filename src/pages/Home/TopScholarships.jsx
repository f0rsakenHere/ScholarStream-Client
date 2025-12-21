import { useMemo } from "react";
import { Link } from "react-router-dom";
import useScholarships from "../../hooks/useScholarships";

const formatCurrency = (v) => {
  if (v == null || v === "" || isNaN(Number(v))) return "Free";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(v));
};

const TopScholarships = () => {
  const {
    scholarships = [],
    isPending,
    isFetching,
    isError,
  } = useScholarships();

  const parseDate = (s) => {
    if (!s) return 0;
    const d =
      s.createdAt ||
      s.postDate ||
      s.postedAt ||
      s.applicationDeadline ||
      s.updatedAt;
    if (!d) return 0;
    const t = Date.parse(d);
    return Number.isNaN(t) ? 0 : t;
  };

  const topSix = useMemo(() => {
    const list = (scholarships || []).slice();

    // Sort by fees ascending (placing numeric fees first), then by most recent date
    const feesSorted = list
      .filter(
        (x) =>
          x && x.applicationFees != null && !isNaN(Number(x.applicationFees))
      )
      .sort((a, b) => Number(a.applicationFees) - Number(b.applicationFees));

    const selected = [];

    // take up to 6 lowest-fee scholarships
    for (let i = 0; i < feesSorted.length && selected.length < 6; i++) {
      selected.push(feesSorted[i]);
    }

    // if fewer than 6, fill remaining by most recent post date (excluding already chosen)
    if (selected.length < 6) {
      const remaining = list
        .filter((x) => !selected.includes(x))
        .sort((a, b) => parseDate(b) - parseDate(a));
      for (let i = 0; i < remaining.length && selected.length < 6; i++) {
        selected.push(remaining[i]);
      }
    }

    return selected;
  }, [scholarships]);

  if (isPending || isFetching) {
    return (
      <section className="my-8">
        <h3 className="text-2xl font-semibold mb-4">Top Scholarships</h3>
        <div className="flex items-center justify-center h-28">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="my-8">
        <h3 className="text-2xl font-semibold mb-4">Top Scholarships</h3>
        <div className="alert alert-error">Failed to load top scholarships</div>
      </section>
    );
  }

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Top Scholarships</h3>
        <Link
          to="/scholarships"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topSix.map((s) => (
          <div
            key={s._id}
            className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
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
              <h4 className="font-semibold text-lg truncate">
                {s.scholarshipName}
              </h4>
              <p className="text-sm text-base-content/70">{s.universityName}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-base-content/70">
                  Fee:{" "}
                  <span className="font-medium">
                    {formatCurrency(s.applicationFees)}
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

        {topSix.length === 0 && (
          <div className="col-span-full text-center text-sm text-base-content/60">
            No recommended scholarships available
          </div>
        )}
      </div>
    </section>
  );
};

export default TopScholarships;

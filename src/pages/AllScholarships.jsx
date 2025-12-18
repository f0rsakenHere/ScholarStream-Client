const AllScholarships = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Scholarships</h2>
      {/* Search and filter UI */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search scholarships..."
          className="input input-bordered w-full max-w-xs"
        />
        {/* Filter options can go here */}
      </div>
      {/* Scholarships list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Scholarship cards */}
      </div>
    </div>
  );
};

export default AllScholarships;

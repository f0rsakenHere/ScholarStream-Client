const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Harvard University",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      quote:
        "ScholarStream helped me find the perfect scholarship that covered my entire tuition. The search and filter system made it so easy to find opportunities tailored to my background.",
      rating: 5,
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      role: "Oxford University",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      quote:
        "I was overwhelmed by the number of scholarships available, but this platform simplified everything. Within weeks, I had multiple scholarship offers to choose from.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Chen",
      role: "Stanford University",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      quote:
        "The detailed information about each scholarship and the application tracking feature made the whole process transparent and stress-free. Highly recommended!",
      rating: 5,
    },
    {
      id: 4,
      name: "Marcus Williams",
      role: "MIT",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      quote:
        "As an international student, finding scholarships was challenging. ScholarStream's location-based filters helped me find opportunities specifically for my country.",
      rating: 5,
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "Cambridge University",
      image:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=400&fit=crop",
      quote:
        "The application fee comparison feature helped me prioritize which scholarships to apply for. I saved both time and money thanks to this platform.",
      rating: 5,
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Yale University",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      quote:
        "The customer support team was incredibly helpful. They answered all my questions and guided me through the entire scholarship application process.",
      rating: 5,
    },
  ];

  return (
    <section className="my-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-base-content">
          What Our Students Say
        </h3>
        <p className="text-base-content/60 mt-2">
          Join thousands of successful students who found their dream
          scholarships
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="card-body">
              {/* Stars */}
              <div className="flex gap-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-base-content/70 mb-4 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-base-200">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=6b21a8&color=fff`;
                  }}
                />
                <div>
                  <h4 className="font-semibold text-base-content">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-base-content/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const slides = [
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1583373834259-46cc92173cb7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Find Your Dream Scholarship",
      subtitle: "Global Opportunities Waiting for You",
    },
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1731349219592-60ca16964631?q=80&w=1923&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Transform Your Future",
      subtitle: "Access World-Class Education",
    },
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1603573355706-3f15d98cf100?q=80&w=1329&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Study Abroad with Ease",
      subtitle: "Thousands of Scholarships Available",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/all-scholarships?search=${searchQuery}`);
    }
  };

  return (
    <section className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
      {/* Carousel Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${slide.backgroundImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Text Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl mb-8">{slide.subtitle}</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered flex-1 text-black placeholder-gray-500"
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </form>

            {/* Explore Button */}
            <button
              onClick={() => navigate("/all-scholarships")}
              className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-black mt-4"
            >
              Explore Scholarships
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost text-white z-10"
      >
        ❮
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost text-white z-10"
      >
        ❯
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-3 bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;

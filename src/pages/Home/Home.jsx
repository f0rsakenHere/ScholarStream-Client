import Banner from "./Banner";
import TopScholarships from "./TopScholarships";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <div className="pt-24">
      {/* Banner */}
      <Banner />

      {/* Top Scholarships */}
      <section className="container mx-auto px-4 py-12">
        <TopScholarships />
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <Testimonials />
      </section>
    </div>
  );
};

export default Home;

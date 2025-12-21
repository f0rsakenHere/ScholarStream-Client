import Banner from "./Banner";
import TopScholarships from "./TopScholarships";
import Testimonials from "./Testimonials";
import { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const faqs = [
    {
      id: 1,
      question: "How do I search for scholarships?",
      answer:
        "Use the search bar on the All Scholarships page to find scholarships by name, university, or degree. You can also use the filter options to narrow down by location, category, funding type, and application fees.",
    },
    {
      id: 2,
      question: "Are there any application fees to use ScholarStream?",
      answer:
        "No! ScholarStream is completely free to use. We help you find scholarships without charging you anything. The application fees shown are the fees charged by the scholarship providers, not by us.",
    },
    {
      id: 3,
      question: "How often is the scholarship database updated?",
      answer:
        "Our database is updated regularly with new scholarship opportunities. New scholarships are added weekly to ensure you have access to the latest opportunities.",
    },
    {
      id: 4,
      question: "Can I apply directly through ScholarStream?",
      answer:
        "ScholarStream helps you find scholarships, but applications are typically submitted directly to the scholarship providers. We provide all the necessary links and information to guide you through the application process.",
    },
    {
      id: 5,
      question: "Is my personal information secure?",
      answer:
        "Yes, we take data security seriously. Your information is encrypted and stored securely. We never share your personal data with third parties without your consent.",
    },
    {
      id: 6,
      question: "What if I need help with my application?",
      answer:
        "Our customer support team is here to help! You can contact us through the Contact Us form below, and we'll assist you with any questions or concerns about the application process.",
    },
  ];

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

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-base-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-base-content mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-base-content/60">
              Find answers to common questions about ScholarStream
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="collapse collapse-arrow bg-base-100 border border-base-200"
              >
                <input
                  type="radio"
                  name="accordion"
                  checked={activeAccordion === faq.id}
                  onChange={() =>
                    setActiveAccordion(
                      activeAccordion === faq.id ? null : faq.id
                    )
                  }
                />
                <div className="collapse-title text-lg font-semibold text-base-content">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p className="text-base-content/70">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-base-content mb-2">
              Get In Touch
            </h2>
            <p className="text-base-content/60">
              Have questions? We'd love to hear from you. Send us a message!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Send us a Message</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Your name"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Email Address</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="your@email.com"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Subject</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      placeholder="How can we help?"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Message</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Your message here..."
                      rows="4"
                      className="textarea textarea-bordered w-full"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Email */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">Email</h4>
                      <p className="text-base-content/60">
                        support@scholarstream.com
                      </p>
                      <p className="text-sm text-base-content/50">
                        We reply within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.73 1.365a1 1 0 001.006-.166c.572-.635 1.159-1.28 1.759-1.904a1 1 0 011.508.26l1.5 2.694a1 1 0 00.504.632l2.658 1.185a1 1 0 01.502.756l.361 2.167a2 2 0 01-1.968 2.371H5a2 2 0 01-2-2V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">Phone</h4>
                      <p className="text-base-content/60">+1 (555) 123-4567</p>
                      <p className="text-sm text-base-content/50">
                        Mon-Fri, 9am-6pm EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">
                        Location
                      </h4>
                      <p className="text-base-content/60">
                        123 Education Street
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-300 mt-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              ScholarStream
            </h3>
            <p className="text-sm text-base-content/70">
              Your gateway to global scholarship opportunities. Find, apply, and
              manage scholarships all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-scholarships"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  All Scholarships
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-base-content/70 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-base-content/70 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-base-content/70 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-base-content/70 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-base-content/70 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
            <div className="mt-6">
              <p className="text-sm text-base-content/70 mb-2">Contact Us</p>
              <a
                href="mailto:info@scholarstream.com"
                className="text-sm text-primary hover:underline"
              >
                info@scholarstream.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-content/10 mt-8 pt-6 text-center">
          <p className="text-sm text-base-content/70">
            &copy; {new Date().getFullYear()} ScholarStream. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

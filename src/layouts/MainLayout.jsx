import { Outlet } from "react-router-dom";
import Navbar from "../pages/Shared/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar for public pages */}
      <Navbar />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer for public pages */}
      <footer className="bg-base-300 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2025 ScholarStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

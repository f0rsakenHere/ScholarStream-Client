import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Header/Navbar for public pages */}
      <header className="bg-base-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">ScholarStream</h1>
        </div>
      </header>

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

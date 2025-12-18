import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ModeratorRoute from "./ModeratorRoute";

// Placeholder components - replace with actual components
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Dashboard = () => <div>Dashboard Overview</div>;
const Profile = () => <div>Profile Page</div>;
const Scholarships = () => <div>Scholarships Page</div>;
const ErrorPage = () => <div>404 - Page Not Found</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "scholarships",
        element: <Scholarships />,
      },
      // Admin routes example
      // {
      //   path: "admin",
      //   element: (
      //     <AdminRoute>
      //       <AdminPanel />
      //     </AdminRoute>
      //   ),
      // },
      // Moderator routes example
      // {
      //   path: "moderate",
      //   element: (
      //     <ModeratorRoute>
      //       <ModerationPanel />
      //     </ModeratorRoute>
      //   ),
      // },
    ],
  },
]);

export default router;

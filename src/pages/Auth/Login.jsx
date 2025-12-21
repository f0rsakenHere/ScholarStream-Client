import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      if (result.user) {
        toast.success("Login successful!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please register first.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many login attempts. Please try again later.");
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        // Save/update user to MongoDB (handles both new and existing users)
        // NOTE: Don't send 'role' here - backend sets default for new users
        // and preserves existing role for returning users
        const userInfo = {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };

        // POST /users will create if not exists, or your backend should handle duplicates
        try {
          const res = await axiosPublic.post("/users", userInfo);
          console.log("DB save response:", res.data);
          if (res.data?.insertedId || res.status === 200) {
            toast.success("User saved to database");
          }
        } catch (dbError) {
          console.log(
            "DB save error:",
            dbError.response?.data || dbError.message
          );
          // Non-blocking toast to aid debugging
          toast.error(
            dbError.response?.data?.message || "Failed to save user to database"
          );
        }

        toast.success("Login with Google successful!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);
      // Still allow login even if DB save fails (user might already exist)
      if (error.code?.startsWith("auth/")) {
        toast.error(error.message || "Google login failed");
      } else {
        // DB error but Firebase auth succeeded - still navigate
        toast.success("Login with Google successful!");
        navigate(from, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-base-200 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-base-content">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-base-content/60">
            Welcome back to ScholarStream
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-base-content mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-sm text-error mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-base-content mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="text-sm text-error mt-1 block">
                {errors.password.message}
              </span>
            )}
            <label className="label mt-2">
              <Link
                to="/forgot-password"
                className="label-text-alt link link-hover text-primary"
              >
                Forgot password?
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-base-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-base-200 text-base-content/60">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 btn btn-outline text-base-content hover:bg-base-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? "Signing in..." : "Google"}
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-base-content/70">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

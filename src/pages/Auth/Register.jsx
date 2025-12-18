import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import SocialLogin from "./SocialLogin";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      password: "",
    },
  });

  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // 1. Create User in Firebase
      const result = await createUser(data.email, data.password);
      const loggedUser = result.user;
      console.log("Firebase User Created:", loggedUser);

      // 2. Update Profile (Name & Photo)
      await updateUserProfile(data.name, data.photoURL);
      console.log("User profile updated");

      // 3. Save User to Database (MongoDB)
      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
        role: "student", // Default role assignment
        createdAt: new Date(),
      };

      const res = await axiosPublic.post("/users", userInfo);
      console.log("Database response:", res.data);

      // Handle both new user (insertedId) and existing user cases
      if (res.data.insertedId || res.data.message || res.status === 200) {
        console.log("User saved to database");
        reset();
        toast.success("Registration successful! Welcome to ScholarStream!");
        navigate("/dashboard");
      } else {
        // Still continue if Firebase user was created
        reset();
        toast.success("Account created! Welcome to ScholarStream!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Firebase-specific error handling
      if (error.code === "auth/email-already-in-use") {
        toast.error(
          "Email already registered. Please log in or use a different email."
        );
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please use a stronger password.");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-base-200 p-8 rounded-lg shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-base-content">
            Create your account
          </h2>
          <p className="mt-2 text-center text-base-content/60">
            Join ScholarStream to explore scholarships
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-base-content mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
              disabled={isLoading}
            />
            {errors.name && (
              <span className="text-sm text-error mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

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

          {/* Photo URL Field */}
          <div>
            <label
              htmlFor="photoURL"
              className="block text-sm font-medium text-base-content mb-2"
            >
              Photo URL
            </label>
            <input
              id="photoURL"
              type="url"
              {...register("photoURL", {
                required: "Photo URL is required",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Please enter a valid URL (http:// or https://)",
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/photo.jpg"
              disabled={isLoading}
            />
            {errors.photoURL && (
              <span className="text-sm text-error mt-1 block">
                {errors.photoURL.message}
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
                pattern: {
                  value: /(?=.*[A-Z])(?=.*[!@#$&*])/,
                  message:
                    "Must contain 1 uppercase letter & 1 special character (!@#$&*)",
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
            <p className="text-xs text-base-content/60 mt-2">
              Min 6 characters, 1 uppercase, 1 special character
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Register"}
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

        {/* Social Login */}
        <SocialLogin isLoading={isLoading} />

        {/* Login Link */}
        <div className="text-center">
          <p className="text-base-content/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

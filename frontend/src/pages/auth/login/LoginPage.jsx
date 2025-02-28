import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";
import { RotateLoader } from "react-spinners";
import ShinyText from "../../../ui-components/ShinyText";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to login");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary text-white px-4">
      {/* Logo and Header Section */}
      <div className="flex flex-col items-center justify-center mb-8">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-32 h-32 rounded-full shadow-lg border-2 border-primary mb-4"
        />
        <ShinyText
          text="TOGETHER WE THRIVE"
          disabled={false}
          speed={3}
          className="text-3xl font-bold text-center mb-8 mx-auto"
        />
      </div>

      <div className="card w-full max-w-lg bg-base rounded-lg shadow-lg border border-gray-700">
        <div className="card-body px-6 py-8">
          <form onSubmit={handleSubmit}>
            <ShinyText
              text="Login"
              disabled={false}
              speed={3}
              className="text-4xl font-bold text-center mb-8 mx-auto text-primary"
            />
            <div className="form-control mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-control mb-6 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-blue-400"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <IoMdEye size={24} />
                  ) : (
                    <IoMdEyeOff size={24} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center"
              disabled={isPending}
            >
              {isPending ? (
                <RotateLoader color="#ffffff" size={8} margin={2} />
              ) : (
                <>
                  Login
                  <IoLogIn className="ml-2 text-xl" />
                </>
              )}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline hover:text-primary-light"
            >
              <ShinyText
                text="Signup"
                disabled={false}
                speed={3}
                className="custom-class text-lg underline"
              />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
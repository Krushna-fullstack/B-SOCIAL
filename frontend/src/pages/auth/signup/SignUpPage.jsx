import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import ShinyText from "../../../ui-components/ShinyText";
import GradientText from "../../../ui-components/GradiantText";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create account");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Account created successfully");
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

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [isTermsAccepted, setisTermsAccepted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary text-white px-4">
      <div className="flex flex-col items-center justify-center mb-8 mt-6">
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
              text="Signup"
              disabled={false}
              speed={3}
              className="text-4xl font-bold text-center mb-8 mx-auto text-primary"
            />

            {errorMessage && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded">
                {errorMessage}
              </div>
            )}

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

            <div className="form-control mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
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
                  placeholder="Create a password"
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

            <div className="form-control mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="accept-terms"
                  className="checkbox checkbox-primary"
                  onChange={() => setisTermsAccepted(!isTermsAccepted)}
                />
                <span className="text-gray-400 text-sm">
                  By clicking here, you agree to our cookies policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`btn w-full py-3 text-lg font-semibold rounded-lg bg-primary hover:bg-primary-dark transition-colors ${
                !isTermsAccepted ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isTermsAccepted}
            >
              Create Account
              <MdVerified className="ml-2 text-xl" />
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline hover:text-primary-light"
            >
              <ShinyText
                text="Login"
                disabled={false}
                speed={3}
                className="custom-class text-lg underline"
              />
            </Link>
          </p>
        </div>
      </div>

      <Link
        className="text-gray-500 mt-6 text-sm hover:text-gray-400"
        to="https://drive.google.com/file/d/1Ps5mk3-_sWRXlHdibHDOyM9rjvdfP03w/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms & Conditions
      </Link>
    </div>
  );
};

export default SignUpPage;

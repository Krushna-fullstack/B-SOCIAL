import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdVerified } from "react-icons/md";
import ShinyText from "../../../ui-components/ShinyText";
import { BlurText } from "../../../ui-components/BlurText";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4 sm:p-8">
      <BlurText
        text="One platform, endless possibilities 🚀"
        className="custom-class text-3xl sm:text-6xl font-extrabold text-white  text-center mb-6"
        delay={50}
      />
      <GradientText
        colors={["#a78bfa", "#ec4899", "#dc2626"]} // Custom gradient colors
        animationSpeed={3} // Custom animation speed in seconds
        showBorder={false} // Show or hide border
        className="custom-class mb-2 text-3xl sm:text-5xl font-extrabold text-center" // Add one or more custom classes
      >
        Join BJB Social today !
      </GradientText>

      <div className="card w-full max-w-md bg-base-100 rounded-xl shadow-lg mx-4 border border-gray-700">
        <div className="card-body">
          <div className="flex justify-center my-4">
            <img
              src="/logo.png"
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-lg border-4 border-primary"
            />
          </div>
          <ShinyText
            text="Signup"
            disabled={false}
            speed={3}
            className="custom-class text-center text-4xl font-bold  mb-6"
          />
          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text text-gray-400 font-medium">
                  Email
                </span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-gray-900 text-white placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label" htmlFor="username">
                <span className="label-text text-gray-400 font-medium">
                  Username
                </span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-gray-900 text-white placeholder-gray-500"
                placeholder="Choose a username"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label" htmlFor="fullName">
                <span className="label-text text-gray-400 font-medium">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-gray-900 text-white placeholder-gray-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-control mb-6 relative">
              <label className="label" htmlFor="password">
                <span className="label-text text-gray-400 font-medium">
                  Password
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-gray-900 text-white placeholder-gray-500 pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-blue-400"
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

            <div className="form-control">
              <button
                type="submit"
                className={`btn btn-primary w-full py-3 text-lg rounded-lg ${
                  !isTermsAccepted
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
                disabled={!isTermsAccepted}
              >
                Create Account <MdVerified className="text-xl" />
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                <ShinyText
                  text="Login"
                  disabled={false}
                  speed={3}
                  className="custom-class text-lg"
                />
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Link
        className="text-gray-500 mt-6 text-sm"
        to="https://drive.google.com/file/d/1Ps5mk3-_sWRXlHdibHDOyM9rjvdfP03w/view?usp=sharing"
      >
        Terms & Conditions
      </Link>
    </div>
  );
};

export default SignUpPage;

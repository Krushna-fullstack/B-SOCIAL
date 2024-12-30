import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";
import { BlurText } from "../../../ui-components/BlurText";
import ShinyText from "../../../ui-components/ShinyText";
import GradientText from "../../../ui-components/GradiantText";


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
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

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      
      <BlurText
        text="Welcome Back ! 🎉"
        className="custom-class text-4xl sm:text-6xl font-extrabold text-white  text-center mb-6"
        delay={50}
      />

      
      <GradientText
        colors={["#a78bfa", "#ec4899", "#dc2626"]} // Custom gradient colors
        animationSpeed={3} // Custom animation speed in seconds
        showBorder={false} // Show or hide border
        className="custom-class text-3xl sm:text-4xl mb-2" // Add one or more custom classes
      >
        Login to Your Account
      </GradientText>
      <div className="card w-full max-w-md bg-base-100 rounded-lg mx-4 sm:mx-0 border-t-2 border-primary border-b-2 shadow-primary">
        <div className="card-body">
          <div className="flex justify-center my-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-32 h-32 rounded-full shadow-lg border-4 border-primary"
            />
          </div>
          
          <ShinyText
            text="Login"
            disabled={false}
            speed={3}
            className="custom-class text-center text-4xl font-bold  mb-6"
          />
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
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-blue-400"
                  onClick={() => handleShowPassword()}
                >
                  {showPassword ? (
                    <IoMdEye size={24} />
                  ) : (
                    <IoMdEyeOff size={24} />
                  )}
                </button>
              </div>
            </div>
            <div className="form-control">
              <button
                type="submit"
                className="btn btn-primary w-full py-3 text-lg rounded-lg bg-blue-600 hover:bg-blue-500"
              >
                Login <IoLogIn className="ml-2 text-xl" />
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Don’t have an account ?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                <ShinyText
                  text="Signup"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

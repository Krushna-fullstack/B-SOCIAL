import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 rounded-lg mx-4 sm:mx-0">
        <div className="card-body">
          <div className="flex justify-center my-4">
            <img
              src="/logo.png"
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-lg"
            />
          </div>
          <h2 className="text-center text-4xl font-bold text-gray-200 mb-6">
            Login
          </h2>
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
            <div className="form-control mb-6">
              <label className="label" htmlFor="password">
                <span className="label-text text-gray-400 font-medium">
                  Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-gray-900 text-white placeholder-gray-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-control">
              <button
                type="submit"
                className="btn btn-primary w-full py-3 text-lg rounded-lg bg-blue-600 hover:bg-blue-500"
              >
                Login
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create account");
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

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="card w-82 max-w-md shadow-2xl bg-base-100 rounded-xl mt-10">
        <div className="card-body">
          <div className="w-32 mx-auto my-4">
            <img
              src="/BJB-SOCIAL-LOGO.png"
              alt="Profile"
              className="rounded-full"
            />
          </div>
          <h2 className="text-center text-3xl font-bold mt-7 mb-4">Signup</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Email"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Username"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="fullName">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Password"
                required
              />
            </div>
            <div className="form-control mt-2">
              <label className="label cursor-pointer">
                <input
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-primary mr-3"
                />
                <span className="label-text opacity-70">
                  I have read all the terms & cookies
                </span>
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary rounded-xl"
                disabled={!isChecked}
              >
                Signup
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Already have an account ?{" "}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <a className="opacity-50 cursor-pointer mt-auto">
        Terms and Conditions (BJB Social)
      </a>
    </div>
  );
};

export default SignUpPage;

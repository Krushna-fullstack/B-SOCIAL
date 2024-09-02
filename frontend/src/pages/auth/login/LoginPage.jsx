import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="main-div min-h-screen flex flex-col">
      <div className="login-container flex-grow flex flex-col justify-center items-center p-4 bg-black">
        <div className="login-form w-full max-w-md bg-gray-900 rounded-3xl p-6">

          {/* Login Text */}
          <div className="login-text mx-auto mt-4 text-center">
            <h1 className="text-4xl text-white font-bold">Login</h1>
          </div>

          {/* Logo */}
          <div className="w-36 mx-auto my-8">
            <img
              src="https://pbs.twimg.com/profile_images/1496242417917300737/9T4Q4_1N_400x400.jpg"
              alt="Profile"
            />
          </div>

          {/* Login Form */}
          <form>

           
            <div className="mb-4">
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full px-3 py-2 placeholder-gray-300 bg-gray-800 rounded-md focus:outline-none focus:ring focus:border-blue-300 focus:ring-blue-200 text-white sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full px-3 py-2 placeholder-gray-300 bg-gray-800 rounded-md focus:outline-none focus:ring focus:border-blue-300 focus:ring-blue-200 text-white sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div className="register-link mb-4">
              <div className="mx-12 my-3 sm:mx-16 text-center">
                <p>
                  Don't have an account ? <Link to="/signup" className="text-blue-400 hover:text-blue-500">Signup</Link>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="submit"
                className="mx-auto btn btn-wide btn-primary rounded-lg font-semibold text-xl text-white"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      
      {/* Terms and Conditions Paragraph */}
      <div className="text-center text-white text-sm p-4 bg-black">
        <p className="opacity-40">
          By logging in, you agree to our <a href="#" className="text-blue-400 hover:text-blue-500">Terms and Conditions</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

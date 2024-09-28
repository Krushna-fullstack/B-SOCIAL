import React, { useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";
import { FiSearch } from "react-icons/fi";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-sm p-4 lg:ml-4">
        {/* Logo */}
<<<<<<< HEAD
        <img
          src="./../public/logo.png"
          alt="BJB Social Logo"
          className="w-24 h-auto my-2"
        />
=======
        <img src="/1.jpg" alt="BJB Social Logo" className="w-20 h-auto my-2" />
>>>>>>> 818b6a3c8dbf24a3757ec2a3f10425aeb6b0ac23

        {/* Search Input Box */}
        <div className="relative lg:flex justify-center items-center mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search...."
            className="p-2 w-64 border border-gray-600 rounded-md shadow-md focus:outline-none bg-secondary text-white"
          />
        </div>
      </div>

      {/* Create Post and Posts Section */}
      <CreatePost />
      <Posts />
    </div>
  );
};

export default HomePage;

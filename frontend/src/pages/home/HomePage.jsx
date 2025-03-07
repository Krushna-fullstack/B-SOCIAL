import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";
import { IoSearchSharp } from "react-icons/io5";
import axios from "axios";
import { debounce } from "lodash";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // State for search
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Handle search input change with debounce
  const handleSearch = useCallback(
    debounce(async (value) => {
      if (value.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const { data } = await axios.get(
          `/api/v1/user/search?username=${value}`
        );

        const formattedData = data.map((user) => ({
          _id: user._id,
          username: user.username || user.Username,
          profileImg: user.profileImg || user.ProfileImg,
          fullname: user.fullName || user.FullName,
        }));

        setResults(formattedData);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
    }, 500),
    []
  );

  // New event handler: Update query state immediately
  const onSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Ensures input value updates in the UI
    handleSearch(value); // Call debounced search function
  };

  // Debugging: Log results
  useEffect(() => {
    console.log("Current results:", results);
  }, [results]);

  // Close search on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center relative">
      {/* Navbar */}
      <div className="flex items-center justify-between w-full max-w-sm px-4 lg:ml-4 relative">
        {/* Profile Image */}
        <Link to={`/profile/${authUser?.username}`} className="flex-shrink-0">
          {authUser?.profileImg ? (
            <div className="w-12 h-12 overflow-hidden rounded-full border border-gray-300">
              <img
                className="w-full h-full object-cover"
                src={authUser?.profileImg}
                alt="Profile"
              />
            </div>
          ) : (
            <VscAccount className="w-12 h-12 rounded-full text-gray-400" />
          )}
        </Link>

        {/* Logo */}
        <img
          src="/logo.png"
          alt="BJB Social Logo"
          className="w-20 h-auto my-1 mx-auto"
        />

        {/* Search Icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="text-gray-500 hover:text-gray-700"
        >
          <IoSearchSharp className="w-8 h-8 text-white font-semibold" />
        </button>

        {/* Bahai Icon */}
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center backdrop-blur-md z-50"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="border border-gray-700 p-4 rounded-lg shadow-lg w-3/4 max-w-md flex flex-col space-y-3 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center space-x-2 border-b border-gray-700 pb-3">
                <IoSearchSharp className="w-6 h-6 text-gray-300" />

                <input
                  placeholder="Search users..."
                  value={query} // Bind query state to value
                  onChange={onSearchChange} // Update state and trigger search
                  className="text-white bg-transparent w-full focus:outline-none placeholder-gray-400"
                  autoFocus
                />

                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-white font-bold hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-64 overflow-y-auto flex flex-col space-y-2">
                {results.length > 0 ? (
                  results.map((user) => (
                    <Link
                      key={user._id}
                      to={`/profile/${user.username}`}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-md transition duration-200"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={user.profileImg || "/avatar-placeholder.png"}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border border-gray-600 object-cover"
                        />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-white font-medium text-base">
                          {user.username}
                        </span>
                        <span className="text-gray-400 font-light text-xs">
                          {user.fullname}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : query ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No users found.
                  </p>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Line */}
      <hr className="w-full max-w-sm border-t border-gray-300 my-4" />

      {/* Create Post and Posts Section */}
      <CreatePost />
      <Posts />
    </div>
  );
};

export default HomePage;

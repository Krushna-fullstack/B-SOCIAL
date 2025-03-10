import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";
import { IoSearchSharp } from "react-icons/io5";
import axios from "axios";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);

  // const fetchSearchResults = async (value) => {
  //   if (!value.trim()) {
  //     setResults([]);
  //     setIsLoading(false);
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     const { data } = await axios.get(`/api/v1/user/search?username=${value}`);
  //     setResults(
  //       data?.map((user) => ({
  //         _id: user._id,
  //         username: user.username || user.Username,
  //         profileImg: user.profileImg || user.ProfileImg,
  //         fullname: user.fullName || user.FullName,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error fetching search results:", error);
  //     setResults([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchSearchResults = async (value) => {
    if (!value.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/user/search?username=${value}`);
      if (Array.isArray(data)) {
        // Add check here
        setResults(
          data.map((user) => ({
            _id: user._id,
            username: user.username || user.Username,
            profileImg: user.profileImg || user.ProfileImg,
            fullname: user.fullName || user.FullName,
          }))
        );
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSearchResults(value), 500);
  };

  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center relative">
      <div className="flex items-center justify-between w-full max-w-sm px-4 lg:ml-4 relative">
        <Link to={`/profile/${authUser?.username}`} className="flex-shrink-0">
          {authUser?.profileImg ? (
            <img
              className="w-12 h-12 rounded-full border border-gray-300 object-cover"
              src={authUser.profileImg}
              alt="Profile"
            />
          ) : (
            <VscAccount className="w-12 h-12 text-gray-400" />
          )}
        </Link>
        <img
          src="/logo.png"
          alt="BJB Social Logo"
          className="w-20 h-auto my-1 mx-auto"
        />
        <button onClick={() => setSearchOpen(true)}>
          <IoSearchSharp className="w-8 h-8 text-white font-semibold" />
        </button>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="border border-gray-700 p-4 rounded-lg shadow-lg w-3/4 max-w-md flex flex-col space-y-3 bg-black"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2 border-b border-gray-700 pb-3">
                <IoSearchSharp className="w-6 h-6 text-gray-300" />
                <input
                  placeholder="Search users..."
                  value={query}
                  onChange={handleSearch}
                  className="text-white bg-transparent w-full focus:outline-none placeholder-gray-400"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)}>✕</button>
              </div>
              <div className="max-h-64 overflow-y-auto flex flex-col space-y-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-sm text-primary">Fetching users...</p>
                  </div>
                ) : results.length > 0 ? (
                  results.map((user) => (
                    <Link
                      key={user._id}
                      to={`/profile/${user.username}`}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-md"
                    >
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border border-gray-600 object-cover"
                      />
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

      <hr className="w-full max-w-sm border-t border-gray-300 my-4" />
      <CreatePost />
      <Posts />
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
import Posts from "./Posts"; // Assuming Posts component handles the display of posts
import { FaImage } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const CommunityPosts = () => {
  const [userCaption, setUserCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleCaptionChange = (event) => {
    setUserCaption(event.target.value);
  };

  const handlePostSubmit = () => {
    // Here you would typically handle submitting the post
    console.log("Post Submitted:", userCaption, selectedImage);

    // Reset the form after submitting
    setUserCaption("");
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen mx-6">
      {/* Input section for adding a new post */}
      <div className="bg-secondary max-w-md w-full p-4 rounded-lg shadow-lg mb-6 mt-8">
        <div className="flex items-center">
          <Link to="/profile">
            <CgProfile className="text-3xl text-white mr-2 mb-2" />
          </Link>
          <label className="text-white font-semibold mb-2">Username</label>
        </div>
        <input
          value={userCaption}
          onChange={handleCaptionChange}
          className="w-full p-2 bg-black rounded-2xl text-white"
          placeholder="What's happening?"
          rows={3}
        />

        {/* Image upload icon */}
        <div className="flex justify-between items-center mt-2">
          <label className="cursor-pointer flex items-center text-white">
            <FaImage className="text-xl mr-2 text-primary" />
            <span>Media</span>

            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handlePostSubmit}
            className="bg-primary text-white py-2 px-4 rounded-xl"
          >
            Post
          </button>
        </div>

        {/* Display selected image preview */}
        {selectedImage && (
          <div className="mt-4">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      <Posts />
    </div>
  );
};

export default CommunityPosts;

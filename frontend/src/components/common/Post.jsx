import React from "react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const { _id, text, img, user } = post;
  const { fullName, profileImg, username } = user;

  return (
    <div className="bg-gray-600 shadow-lg rounded-lg p-4 mb-6 w-full max-w-sm mx-auto">
      {/* Header: Profile Image and User Info */}
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${username}`}>
          <img
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
            src={profileImg || "/avatar-placeholder.png"}
            alt={fullName}
          />
        </Link>
        <div>
          <Link
            to={`/profile/${username}`}
            className="font-semibold text-lg text-primary hover:text-primary-focus transition duration-200"
          >
            {fullName}
          </Link>
          <p className="text-xs text-gray-500">@{username}</p>
        </div>
      </div>

      {/* Post Text */}
      <p className="text-sm mb-3 text-gray-800 break-words">{text}</p>

      {/* Post Image (if available) */}
      {img && (
        <div className="mb-3">
          <img
            src={img}
            alt="post"
            className="rounded-lg object-cover w-full h-auto max-h-64"
          />
        </div>
      )}

      {/* Footer: Like, Comment, Share Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button className="btn btn-sm btn-outline btn-primary">Like</button>
        <button className="btn btn-sm btn-outline btn-accent">Comment</button>
        <button className="btn btn-sm btn-outline btn-secondary">Share</button>
      </div>
    </div>
  );
};

export default Post;

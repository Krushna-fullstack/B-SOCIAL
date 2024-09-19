import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { MdInsertComment } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";

const Post = ({ post }) => {
  const { text, img, user } = post;
  const { fullName, profileImg, username } = user;

  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0); // Track comments
  const [shareCount, setShareCount] = useState(0); // Track shares

  const handleLike = () => {
    setLike(!like);
    setLikeCount(like ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-secondary shadow-lg rounded-lg p-4 mb-6 w-full max-w-sm mx-auto">
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
            className="font-semibold text-lg text-white hover:text-primary-focus transition duration-200"
          >
            {fullName}
          </Link>
          <p className="text-xs text-gray-500">@{username}</p>
        </div>
      </div>

      {/* Post Text */}
      <p className="text-sm mb-3 text-white break-words">{text}</p>

      {/* Post Image (if available) */}
      {img && (
        <div className="mb-3">
          <img
            src={img}
            alt="post"
            className="rounded-lg w-full h-auto object-contain"
          />
        </div>
      )}

      <hr/>

      {/* Footer: Like, Comment, Share Buttons */}
      <div className="flex justify-around items-center mt-4 text-white">
        {/* Like Button */}
        <div className="flex items-center space-x-2">
          <button className="text-xl" onClick={handleLike}>
            {like ? <FcLike /> : <FaHeart />}
          </button>
          <span className="text-sm">{likeCount}</span>
        </div>

        {/* Comment Button */}
        <div className="flex items-center space-x-2">
          <button className="text-xl">
            <MdInsertComment />
          </button>
          <span className="text-sm">{commentCount}</span>
        </div>

        {/* Share Button */}
        <div className="flex items-center space-x-2">
          <button className="text-xl">
            <IoIosShareAlt />
          </button>
          <span className="text-sm">{shareCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;

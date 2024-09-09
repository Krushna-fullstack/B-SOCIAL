import React from "react";
import { FaHeart } from "react-icons/fa";
import { MdModeComment } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { useState } from "react";
import { FcLike } from "react-icons/fc";

const Post = ({ profile, id, username, imageUrl, caption }) => {
  const [countLike, setCountLike] = useState(0);
  let [isLike, setIsLike] = useState(false);
  // let [likeClick,setLikeClick] = useState(0);

  const like = () => {
    setIsLike(!isLike);
    setCountLike(() => {
      return isLike ? countLike - 1 : countLike + 1;
    });
  };

  return (
    <div>
      <div className="max-w-md mx-auto bg-secondary shadow-lg rounded-lg overflow-hidden my-4">
        <div className="flex items-center px-4 py-2">
          <img className="w-10 h-10 rounded-full" src={profile} alt="Profile" />
          <div className="ml-3">
            <p className="text-white font-semibold">{username}</p>
          </div>
        </div>

        <div className="px-4 py-2">
          <p className="text-white">{caption}</p>
        </div>

        <div className="px-4 py-2">
          <img
            className="w-full h-auto object-cover rounded-lg"
            src={imageUrl}
            alt="Post"
          />
        </div>

        <div className="flex justify-evenly items-center px-2 py-2 border-t border-gray-200">
          <div className="flex items-center" onClick={like}>
            {isLike ? (
              <FcLike className="w-10 h-6 cursor-pointer" />
            ) : (
              <FaHeart className="w-10 h-4 cursor-pointer" />
            )}
            <p>{countLike}</p>
          </div>
          <div className="flex items-center">
            <MdModeComment className="w-10 h-4 cursor-pointer" />
            <p>1</p>{" "}
          </div>
          <FaShare className="w-10 h-4 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Post;

import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import { MdInsertComment } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Post = ({ post }) => {
  const { text, img, user, likes } = post; // Added likes array from the post
  const { fullName, profileImg, username } = user;

  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const postOwner = post.user;
  const isMyPost = authUser?._id === postOwner._id;
  const isLiked = likes.includes(authUser?._id); // Check if the user has liked the post

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/${post._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Something went wrong");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/like/${post._id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Something went wrong");
      return res.json();
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        );
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => deletePost();
  const handleLikePost = () => likePost();

  return (
    <div className="bg-secondary shadow-lg rounded-lg p-6 mb-6 w-full max-w-sm mx-auto">
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

        {/* Delete Post for My Post */}
        {isMyPost && (
          <span className="ml-auto">
            {!isDeleting ? (
              <FaTrash
                className="cursor-pointer hover:text-red-500 transition duration-200"
                onClick={handleDeletePost}
              />
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </span>
        )}
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

      <hr />

      {/* Footer: Like, Comment, Share Buttons */}
      <div className="flex justify-around items-center mt-4 text-white">
        {/* Like Button */}
        <div className="flex items-center space-x-2">
          <button
            className={`text-xl ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLikePost}
            disabled={isLiking}
          >
            {isLiking ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <FaHeart />
            )}
          </button>
          <span className="text-sm">{likes.length}</span>{" "}
          {/* Display likes count */}
        </div>

        {/* Comment Button */}
        <div className="flex items-center space-x-2">
          <button className="text-xl">
            <MdInsertComment />
          </button>
          <span className="text-sm">0</span>
        </div>

        {/* Share Button */}
        <div className="flex items-center space-x-2">
          <button className="text-xl">
            <IoIosShareAlt />
          </button>
          <span className="text-sm">0</span>
        </div>
      </div>
    </div>
  );
};

export default Post;

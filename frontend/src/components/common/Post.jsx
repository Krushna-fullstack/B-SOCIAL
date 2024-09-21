import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { MdInsertComment } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Post = ({ post }) => {
  const { text, img, user } = post;
  const { fullName, profileImg, username } = user;

  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const postOwner = post.user;
  const isMyPost = authUser?._id === postOwner._id;
  const isLiked = post.likes.includes(authUser?._id);

  const [like, setLike] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [shareCount, setShareCount] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      setIsPending(true);
      try {
        const res = await fetch(`/api/v1/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        setIsPending(false);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    setLike(!like);
    setLikeCount(like ? likeCount - 1 : likeCount + 1);
  };

  const handleDeletePost = () => {
    deletePost();
  };

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
            {!isPending && (
              <FaTrash
                className="cursor-pointer hover:text-red-500 transition duration-200"
                onClick={handleDeletePost}
              />
            )}
            {isPending && (
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

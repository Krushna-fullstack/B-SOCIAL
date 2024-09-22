import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { MdInsertComment } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment added successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => deletePost();
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || isCommenting) return; // Avoid empty comments
    commentPost();
  };
  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <div className="bg-secondary rounded-xl shadow-md p-6 mb-6 w-full max-w-md mx-auto hover:shadow-xl transition-shadow duration-200">
      {/* Header: Profile and Info */}
      <div className="flex items-center mb-4">
        <Link to={`/profile/${postOwner.username}`} className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
            src={postOwner.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </Link>
        <div className="ml-4 flex-1">
          <Link
            to={`/profile/${postOwner.username}`}
            className="text-lg font-semibold text-white hover:text-primary transition-colors"
          >
            {postOwner.fullName}
          </Link>
          <p className="text-sm text-gray-400">
            @{postOwner.username || "username"}
          </p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        {isMyPost && (
          <button
            className="text-red-500 hover:text-red-600 transition-colors ml-auto"
            onClick={handleDeletePost}
          >
            {!isDeleting ? (
              <FaTrash />
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Post Text */}
      <p className="text-white text-sm mb-4">{post.text}</p>

      {post.img && (
        <img
          src={post.img}
          className="w-full h-64 object-cover rounded-lg mb-4"
          alt="Post"
        />
      )}

      {/* Actions: Like, Comment, Share */}
      <div className="border-t border-neutral-600 pt-4 flex justify-around text-gray-400">
        {/* Like Button */}
        <div
          onClick={handleLikePost}
          className="flex items-center space-x-1 cursor-pointer"
        >
          {isLiking ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : isLiked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          <span>{post.likes.length}</span>
        </div>

        {/* Comment Button */}
        <div
          onClick={() =>
            document.getElementById(`comments_modal${post._id}`).showModal()
          }
          className="flex items-center space-x-1 cursor-pointer"
        >
          <MdInsertComment className="text-xl" />
          <span>{post.comments.length}</span>
        </div>

        {/* Share Button */}
        <div className="flex items-center space-x-1 cursor-pointer">
          <IoIosShareAlt className="text-xl" />
          <span>Share</span>
        </div>

        {/* Comments Modal */}
        <dialog id={`comments_modal${post._id}`} className="dialog">
          <div className="p-8">
            <h3 className="text-lg font-semibold">COMMENTS</h3>
            <div className="mb-4">
              {post.comments.length === 0 && (
                <p>No comments yet 🤔 Be the first one 😉</p>
              )}
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start justify-between mb-2"
                >
                  <div className="flex items-start">
                    <img
                      src={comment.user.profileImg || "/avatar-placeholder.png"}
                      className="w-8 h-8 rounded-full mr-2"
                      alt="Commenter Avatar"
                    />
                    <div>
                      <p className="font-semibold">{comment.user.fullName}</p>
                      <p className="text-gray-300">@{comment.user.username}</p>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                  {/* Conditional Delete Button for comment owner */}
                  {authUser._id === comment.user._id && (
                    <button className="text-red-500 hover:text-red-600 transition-colors">
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="flex">
              <textarea
                className="flex-1 p-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2"
                type="submit"
                disabled={isCommenting}
              >
                {isCommenting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  "Post"
                )}
              </button>
            </form>
          </div>
          <form method="dialog" className="flex justify-end p-2">
            <button className="text-white">Close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default Post;

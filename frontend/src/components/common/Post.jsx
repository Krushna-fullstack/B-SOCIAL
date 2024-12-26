import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaRegHeart, FaTimes } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { MdInsertComment } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import { BsFillSendFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteSweep } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";


const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For delete modal

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const toggleBodyScroll = (shouldLock) => {
    document.body.style.overflow = shouldLock ? "hidden" : "auto";
  };

  const openModal = () => {
    setIsModalOpen(true);
    toggleBodyScroll(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    toggleBodyScroll(false); // Enable scroll
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    toggleBodyScroll(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    toggleBodyScroll(false);
  };

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      closeDeleteModal(); // Close the modal after deletion
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/like/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) =>
        oldData.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        )
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/comment/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong");
      return data;
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

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(
        `/api/v1/posts/${post._id}/comments/${commentId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => {
    deletePost();
    closeDeleteModal(); // Close delete modal on successful deletion
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
  };

  const handleSharePost = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      navigator.share({
        title: "Check out this post",
        text: post.text,
        url: postUrl,
      });
    } else {
      toast.error("Sharing is not supported on this browser");
    }
  };

  return (
    <div className="bg-secondary rounded-xl shadow-md p-6 mb-2 w-full max-w-md mx-auto hover:shadow-xl transition-shadow duration-200">
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
            className="text-md font-semibold text-white hover:text-primary transition-colors"
          >
            {postOwner.fullName}
          </Link>
          <p className="text-sm text-gray-400">
            @{postOwner.username || "username"}
          </p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>

        {isMyPost && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-secondary border-none hover:bg-secondary-focus"
            >
              <BsThreeDotsVertical className="text-xl text-white" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-md z-[1] w-48 p-2 shadow text-white font-normal bg-black"
            >
              <li className="flex items-center space-x-2">
                <button
                  className="flex items-center text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg w-full"
                  onClick={openDeleteModal}
                >
                  <FaTrash className="text-lg" />
                  <span className="ml-2">Delete Post</span>
                </button>
              </li>
            </ul>
          </div>
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
          onClick={openModal}
          className="flex items-center space-x-1 cursor-pointer"
        >
          <MdInsertComment />
          <span>{post.comments.length}</span>
        </div>

        {/* Share Button */}
        <div
          onClick={handleSharePost}
          className="flex items-center space-x-1 cursor-pointer"
        >
          <IoIosShareAlt />
        </div>
      </div>

      {/* Comments Modal */}
      {isModalOpen && (
        <dialog
          className="fixed inset-0 flex items-center justify-center  bg-black overflow-y-auto z-50 " // Ensure z-index is higher
          open={isModalOpen}
          aria-labelledby="comments-title"
          role="dialog"
        >
          <div className="relative p-6 sm:p-8 rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-2 sm:mx-4 shadow-lg">
            {/* Close Icon */}
            <div>
            <FaTimes
              onClick={closeModal}
              className="absolute top-2 right-4 text-red-700 hover:text-gray-200 cursor-pointer transition duration-200 text-2xl mx-2"
            />
            </div>
           

            {/* Title */}
            <div className="text-center mb-6">
              <h3
                id="comments-title"
                className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md"
              >
                Comments
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Share your thoughts below!
              </p>
            </div>

            {/* Comments List */}
            <ul className="space-y-5 max-h-60 sm:max-h-80 overflow-y-auto ">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <li
                    key={comment._id}
                    className="flex items-start space-x-4 bg-secondary p-4 rounded-lg shadow-md transition hover:scale-105"
                  >
                    <img
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary"
                      src={comment.user.profileImg || "/avatar-placeholder.png"}
                      alt={comment.user.username}
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/profile/${comment.user.username}`}
                          className="text-base font-semibold text-white hover:underline"
                        >
                          {comment.user.username}
                        </Link>
                        {authUser._id === comment.user._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-600 transition-colors mx-2"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-2">
                        {comment.text}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-center">No comments yet.</li>
              )}
            </ul>

            {/* Comment Form */}
            <form
              onSubmit={handlePostComment}
              className="mt-6 flex flex-row sm:flex-row items-center gap-3"
            >
              <input
                type="text"
                className="flex-grow rounded-lg p-3 bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
                disabled={isCommenting}
              >
                {isCommenting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <BsFillSendFill />
                )}
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <dialog
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 mx-2" // Ensure z-index is higher
          open={isDeleteModalOpen}
        >
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-xl relative z-60">
            {" "}
            {/* Adjust z-index for content */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-red-600">Delete Post</h3>
              <FaTimes
                onClick={closeDeleteModal}
                className="text-red-600 cursor-pointer hover:text-gray-300 text-xl mb-6"
              />
            </div>
            <p className="text-white mb-6">
              Are you sure you want to delete this post ? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
              >
                <RxCross1 />
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500 transition-colors flex items-center justify-center gap-2" 
                disabled={isDeleting}
              >
                <MdDeleteSweep className="text-2xl"/>{isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Post;

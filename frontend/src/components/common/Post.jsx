import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaRegHeart, FaTimes } from "react-icons/fa"; // Import FaTimes for the cross icon
import { IoIosShareAlt } from "react-icons/io";
import { MdInsertComment } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import { BsFillSendFill } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  // Toggle scroll lock when the modal is open
  const toggleBodyScroll = (shouldLock) => {
    if (shouldLock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    toggleBodyScroll(true); // Disable scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    toggleBodyScroll(false); // Enable scroll
  };

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

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(
        `/api/v1/posts/${post._id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
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

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
  };

  const handleSharePost = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post",
          text: post.text,
          url: window.location.href, // Use current URL or a specific post URL
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Web Share API not supported");
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
              className="btn m-1 bg-secondary border-none"
            >
              <BsThreeDotsVertical className="text-xl" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box z-[1] w-40 p-2 shadow text-white font-normal bg-none "
            >
              <li>
                <button
                  className="text-red-500 hover:text-red-600 transition-colors ml-auto mb-7"
                  onClick={() =>
                    document
                      .getElementById(`delete_modal_${post._id}`)
                      .showModal()
                  }
                >
                  Delete Post
                  <FaTrash />
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
          <MdInsertComment className="text-xl" />
          <span>{post.comments.length}</span>
        </div>

        {/* Share Button */}
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={handleSharePost}
        >
          <IoIosShareAlt className="text-xl" />
          <span>Share</span>
        </div>
      </div>

      {/* Comments Modal */}
      {isModalOpen && (
        <dialog
          id={`comments_modal${post._id}`}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70 rounded-xl"
        >
          <div className="p-7 bg-black rounded-lg w-full max-w-md relative">
            {/* Cross Icon for Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition-all duration-200 text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg text-white font-semibold mb-5">Comments</h3>

            {/* Comments Section */}
            <div className="space-y-4">
              {post.comments.length === 0 ? (
                <p className="text-gray-400">No comments yet</p>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start justify-between p-4 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={
                          comment.user.profileImg || "/avatar-placeholder.png"
                        }
                        className="w-10 h-10 rounded-full border-2 border-blue-500"
                        alt="Commenter Avatar"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {comment.user.fullName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          @{comment.user.username}
                        </p>
                        <p className="text-gray-200">{comment.text}</p>
                      </div>
                    </div>
                    {authUser._id === comment.user._id && (
                      <button
                        className="text-red-500 hover:text-red-600 transition-colors ml-3 mt-1"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form
              onSubmit={handlePostComment}
              className="flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <input
                type="text"
                className="flex-1 h-9 p-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-4 focus:ring-gray-900 outline-none transition-all duration-150 w-full sm:w-auto mt-4 sm:mt-0"
                placeholder="Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="text-primary text-xl transition-all duration-150 disabled:opacity-50 sm:text-lg sm:mt-0 mt-4"
                type="submit"
                disabled={isCommenting}
              >
                {isCommenting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <BsFillSendFill className="text-2xl mx-2" />
                )}
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Post;

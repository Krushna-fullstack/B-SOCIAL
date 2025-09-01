import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaRegHeart, FaTrash, FaHeart } from "react-icons/fa";
import { MdInsertComment } from "react-icons/md";
import { RiShareForwardFill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { formatPostDate } from "../../utils/date";
import LoadingSpinner from "./LoadingSpinner";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  // Delete post mutation
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
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
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Like post mutation - fixed version
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // Update the cache for all queries that might contain this post
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData) => {
        if (!oldData) return oldData;

        // Handle different possible structures for the posts data
        if (oldData.pages) {
          // Infinite query structure
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) =>
                p._id === post._id ? { ...p, likes: updatedLikes } : p
              ),
            })),
          };
        } else if (Array.isArray(oldData)) {
          // Simple array structure
          return oldData.map((p) =>
            p._id === post._id ? { ...p, likes: updatedLikes } : p
          );
        }

        return oldData;
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Comment post mutation
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

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting || !comment.trim()) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => toast.success("Post link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <div className="bg-secondary rounded-xl shadow-md p-6 mb-4 w-full max-w-md mx-auto">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <Link to={`/profile/${postOwner.username}`} className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={postOwner.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </Link>
        <div className="ml-4 flex-1">
          <Link
            to={`/profile/${postOwner.username}`}
            className="text-md font-semibold text-white"
          >
            {postOwner.fullName}
          </Link>
          <p className="text-sm text-gray-400">@{postOwner.username}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        {isMyPost && (
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-sm p-0 hover:bg-transparent">
              <BsThreeDotsVertical className="text-xl text-white" />
            </button>
            <ul className="dropdown-content menu p-2 shadow-lg bg-black rounded-box w-40 mt-2">
              <li>
                <button
                  className="text-red-500 flex items-center px-4 py-2 hover:bg-gray-800 rounded-xl"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <FaTrash className="text-lg" />
                  <span className="ml-2">Delete Post</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <hr className="border-gray-600 my-3" />

      {/* Post Content */}
      <p className="text-white text-sm mb-4">{post.text}</p>

      {post.img && (
        <div className="w-full rounded-lg mb-4 overflow-hidden">
          <img
            src={post.img}
            className="w-full h-auto object-cover"
            alt="Post"
            loading="lazy"
            style={{ maxHeight: "500px" }}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-around text-gray-400">
        <button
          onClick={handleLikePost}
          className="flex items-center space-x-1"
          disabled={isLiking}
        >
          {isLiked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className={isLiking ? "opacity-50" : ""} />
          )}
          <span>{post.likes.length}</span>
        </button>

        <button
          onClick={() => setIsCommentsOpen(true)}
          className="flex items-center space-x-1"
        >
          <MdInsertComment />
          <span>{post.comments.length}</span>
        </button>

        <button className="flex items-center space-x-1" onClick={handleShare}>
          <RiShareForwardFill />
        </button>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-secondary p-6 rounded-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Delete Post</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error rounded-xl text-white flex items-center gap-2"
                onClick={handleDeletePost}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {isCommentsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-secondary rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">Comments</h3>
              <button
                onClick={() => setIsCommentsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <IoClose className="text-3xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 mb-4">
              {post.comments.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  No comments yet
                </div>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment._id} className="mb-4">
                    <div className="flex items-center">
                      <img
                        src={
                          comment.user.profileImg || "/avatar-placeholder.png"
                        }
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="ml-2">
                        <p className="text-sm font-semibold text-white">
                          {comment.user.fullName}
                        </p>
                        <p className="text-xs text-gray-400">
                          @{comment.user.username}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-white mt-2">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            <form
              className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-700"
              onSubmit={handlePostComment}
            >
              <input
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="submit"
                className="text-primary disabled:opacity-50"
                disabled={!comment.trim() || isCommenting}
              >
                {isCommenting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <IoSend className="text-2xl -rotate-12" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

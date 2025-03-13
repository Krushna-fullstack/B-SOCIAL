import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaRegHeart } from "react-icons/fa";
import { MdInsertComment } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import { RiShareForwardFill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const { data: authUser = {} } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const isLiked = post?.likes?.includes(authUser?._id);
  const isMyPost = authUser?._id === post?.user?._id;
  const formattedDate = formatPostDate(post.createdAt);

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const commentVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 }
  };

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/like/${post._id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to like post");
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        oldPosts.map((oldPost) =>
          oldPost._id === post._id
            ? {
                ...oldPost,
                likes: isLiked
                  ? oldPost.likes.filter((id) => id !== authUser?._id)
                  : [...oldPost.likes, authUser?._id],
              }
            : oldPost
        )
      );

      return { previousPosts };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      toast.error(error.message);
    }
  });

  const { mutate: addComment } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/comment/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        oldPosts.map((oldPost) =>
          oldPost._id === post._id
            ? {
                ...oldPost,
                comments: [
                  ...oldPost.comments,
                  {
                    _id: Date.now().toString(),
                    text: comment,
                    user: authUser,
                    createdAt: new Date().toISOString()
                  }
                ]
              }
            : oldPost
        )
      );

      return { previousPosts };
    },
    onSuccess: () => {
      setComment("");
      toast.success("Comment added");
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      toast.error(error.message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["posts"] })
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(`/api/v1/posts/${post._id}/comments/${commentId}`, { 
        method: "DELETE" 
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      return res.json();
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        oldPosts.map((oldPost) =>
          oldPost._id === post._id
            ? {
                ...oldPost,
                comments: oldPost.comments.filter(c => c._id !== commentId)
              }
            : oldPost
        )
      );

      return { previousPosts };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      toast.error(error.message);
    }
  });

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/${post._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsDeleteModalOpen(false);
      toast.success("Post deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleShare = useCallback(() => {
    navigator.share({
      title: 'Check out this post',
      text: post.text,
      url: window.location.href
    }).catch(() => null);
  }, [post.text]);

  return (
    <div className="bg-secondary rounded-xl shadow-md p-6 mb-2 w-full max-w-md mx-auto">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <Link to={`/profile/${postOwner?.username}`} className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={postOwner?.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </Link>
        <div className="ml-4 flex-1">
          <Link
            to={`/profile/${postOwner?.username}`}
            className="text-md font-semibold text-white"
          >
            {postOwner?.fullName}
          </Link>
          <p className="text-sm text-gray-400">@{postOwner?.username}</p>
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
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-around text-gray-400">
        <button 
          onClick={() => likePost()} 
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
      <AnimatePresence>
        {isDeleteModalOpen && (
          <Dialog
            as={motion.div}
            static
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="bg-secondary p-6 rounded-xl max-w-sm w-full mx-4"
            >
              <Dialog.Title className="text-lg font-bold text-white mb-4">
                Delete Post
              </Dialog.Title>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete this post? This action cannot be undone.
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
                  onClick={deletePost}
                  disabled={isDeletingPost}
                >
                  {isDeletingPost ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Deleting...
                    </>
                  ) : "Delete"}
                </button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {isCommentsOpen && (
          <Dialog
            as={motion.div}
            static
            open={isCommentsOpen}
            onClose={() => setIsCommentsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="bg-secondary rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="font-bold text-lg text-white">
                  Comments
                </Dialog.Title>
                <button 
                  onClick={() => setIsCommentsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <IoClose className="text-3xl" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2">
                {post.comments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 text-center py-4"
                  >
                    No comments yet
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {post.comments.map((comment) => (
                      <motion.div
                        key={comment._id}
                        variants={commentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mb-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={comment.user.profileImg || "/avatar-placeholder.png"}
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
                          {authUser?._id === comment.user._id && (
                            <button
                              onClick={() => deleteComment(comment._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-white mt-2">{comment.text}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-700">
                <input
                  className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                />
                <button 
                  onClick={addComment} 
                  className="text-primary disabled:opacity-50"
                  disabled={!comment.trim()}
                >
                  <IoSend className="text-2xl -rotate-12" />
                </button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Post;
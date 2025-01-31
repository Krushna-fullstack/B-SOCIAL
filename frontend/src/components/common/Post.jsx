import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaRegHeart } from "react-icons/fa";
import { MdInsertComment } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import { RiShareForwardFill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteSweep } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Comment modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal state

  const { data: authUser = {} } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const isLiked = post?.likes?.includes(authUser?._id);
  const isMyPost = authUser?._id === post?.user?._id;
  const formattedDate = formatPostDate(post.createdAt);

  const toggleBodyScroll = (shouldLock) => {
    document.body.style.overflow = shouldLock ? "hidden" : "auto";
  };

  // Open comment modal
  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      const modal = document.getElementById(`comments_modal${post._id}`);
      if (modal) {
        modal.showModal();
        toggleBodyScroll(true);
      } else {
        console.error("Modal not found!");
      }
    }, 100);
  };

  // Close comment modal
  const closeModal = () => {
    const modal = document.getElementById(`comments_modal${post._id}`);
    if (modal) {
      modal.close();
      setIsModalOpen(false);
      toggleBodyScroll(false);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    toggleBodyScroll(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    toggleBodyScroll(false);
  };

  const { mutate: likePost } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/posts/like/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const { mutate: addComment } = useMutation({
    mutationFn: async () => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setComment("");
      toast.success("Comment added successfully");
    },
  });

  return (
    <div className="bg-secondary rounded-xl shadow-md p-6 mb-2 w-full max-w-md mx-auto">
      {/* Header */}
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
          <div className="dropdown">
            <button className="btn bg-secondary border-none">
              <BsThreeDotsVertical className="text-xl text-white" />
            </button>
            <ul className="dropdown-content menu w-48 p-2 shadow bg-black">
              <li>
                <button
                  className="text-red-500 flex items-center"
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

      {/* Post Content */}
      <p className="text-white text-sm mb-4">{post.text}</p>

      {post.img && (
        <img
          src={post.img}
          className="w-full h-64 object-cover rounded-lg mb-4"
          alt="Post"
        />
      )}

      {/* Actions */}
      <div className="flex justify-around text-gray-400">
        <button
          onClick={() => likePost()}
          className="flex items-center space-x-1"
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span>{post.likes.length}</span>
        </button>

        <button onClick={openModal} className="flex items-center space-x-1">
          <MdInsertComment />
          <span>{post.comments.length}</span>
        </button>

        <button className="flex items-center space-x-1">
          <RiShareForwardFill />
        </button>
      </div>

      {/* Comment Modal */}
      <dialog id={`comments_modal${post._id}`} className="modal">
        <div className="modal-box bg-secondary">
          <h3 className="font-bold text-lg text-white">Comments</h3>
          <div className="mt-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="mb-4">
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
                <p className="text-sm text-white mt-2">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={() => addComment()}
              className="btn btn-primary mt-2"
            >
              Post Comment
            </button>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Post;

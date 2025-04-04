import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatPostDate } from "../../utils/date";
import { FaHeart, FaTrash, FaRegHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const Notice = ({ notice }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal
  const [selectedImage, setSelectedImage] = useState(null); // State to track selected image

  const noticeOwner = notice.user;

  const isMyNotice = authUser?._id?.toString() === noticeOwner?._id?.toString();

  const isLiked = notice.likes.includes(authUser?._id);

  const formattedDate = formatPostDate(notice.createdAt);

  const { mutate: likeNotice } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/notices/like/${notice._id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Something went wrong");
      return res.json();
    },
    onMutate: async () => {
      // Cancel ongoing queries to prevent conflicts
      await queryClient.cancelQueries(["notices"]);

      // Get previous data snapshot for rollback
      const previousNotices = queryClient.getQueryData(["notices"]);

      // Optimistically update UI before API call finishes
      queryClient.setQueryData(["notices"], (oldData) =>
        oldData.map((n) =>
          n._id === notice._id
            ? {
                ...n,
                likes: isLiked
                  ? n.likes.filter((id) => id !== authUser._id) // Remove like (Unlike)
                  : [...n.likes, authUser._id], // Add like (Like)
              }
            : n
        )
      );

      return { previousNotices }; // Return snapshot in case of rollback
    },
    onError: (error, _, context) => {
      toast.error(error.message);
      queryClient.setQueryData(["notices"], context.previousNotices); // Rollback on error
    },
    onSettled: () => {
      queryClient.invalidateQueries(["notices"]); // Final sync with backend
    },
  });

  // Optimized Click Handler
  const handleLikeNotice = () => {
    likeNotice();
  };

  // Mutation for deleting a notice
  const { mutate: deleteNotice, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/notices/${notice._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Something went wrong");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Notice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });

  // Handler for delete button click
  const handleDeleteNotice = () => {
    deleteNotice();
  };

  // Handler for like button click

  // Handler for image click to open modal
  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsModalOpen(true);
  };

  // Handler for closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="bg-secondary rounded-lg shadow-md p-6 mb-4 w-full max-w-lg mx-auto">
      {/* Notice Header */}
      <div className="flex items-center mb-4 w-full">
        <Link to={`/profile/${noticeOwner.username}`} className="flex-shrink-0">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={noticeOwner?.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </Link>
        <div className="ml-4 flex-1">
          <Link
            to={`/profile/${noticeOwner.username}`}
            className="text-base font-semibold text-white hover:underline"
          >
            {noticeOwner.fullName}
          </Link>
          <p className="text-sm text-gray-500">
            @{noticeOwner.username || "username"}
          </p>
        </div>
        <p className="text-xs text-gray-400 ml-auto">{formattedDate}</p>
      </div>

      {/* Notice Content */}
      <div className="mb-4">
        {notice.img && (
          <img
            className="w-full h-auto rounded-lg mb-4 cursor-pointer"
            src={notice.img}
            alt="Notice"
            onClick={() => handleImageClick(notice.img)} // Open modal on image click
          />
        )}
        <p className="text-white text-sm">{notice.text}</p>
      </div>

      {/* Actions Section */}
      <div className="border-t pt-4 flex justify-end space-x-4">
        {/* Like Button */}
        <div
          onClick={handleLikeNotice}
          className="flex items-center space-x-1 cursor-pointer text-gray-500 hover:text-blue-500 transition-colors"
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span className="text-sm">{notice.likes.length}</span>
        </div>

        {/* Delete Button (For Owner) */}
        {isMyNotice && (
          <button
            className="text-red-500 hover:text-red-600 transition-colors"
            onClick={handleDeleteNotice}
          >
            {!isDeleting ? (
              <FaTrash />
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500"></div>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Modal for Full Image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative p-4">
            {/* Ensure the image fits the screen */}
            <img
              src={selectedImage}
              alt="Full Notice"
              className="max-w-[90vw] max-h-[90vh] object-contain" // Updated styles for responsive scaling
            />
            {/* Close button with improved visibility */}
            <button
              className="absolute top-4 right-4 text-white bg-red-600 p-2 rounded-full hover:bg-red-500 transition"
              onClick={closeModal}
            >
              <RxCross2 size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;

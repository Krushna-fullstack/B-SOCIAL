import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatPostDate } from "../../../utils/date";
import { FaHeart, FaTrash, FaRegHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const Notice = ({ notice }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal
  const [selectedImage, setSelectedImage] = useState(null); // State to track selected image

  // Get the owner of the notice
  const noticeOwner = notice.user;

  // Ensure IDs are both strings to avoid type mismatches during comparison
  const isMyNotice = authUser?._id?.toString() === noticeOwner?._id?.toString();

  // Check if the notice is liked by the authenticated user
  const isLiked = notice.likes.includes(authUser?._id);

  // Format the createdAt date for display
  const formattedDate = formatPostDate(notice.createdAt);

  // Mutation for liking a notice
  const { mutate: likeNotice, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/notices/like/${notice._id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Something went wrong");
      return res.json();
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["notices"], (oldData) =>
        oldData.map((n) =>
          n._id === notice._id ? { ...n, likes: updatedLikes } : n
        )
      );
    },
    onError: (error) => toast.error(error.message),
  });

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
  const handleLikeNotice = () => {
    if (isLiking) return;
    likeNotice();
  };

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
        <p className="text-xs text-gray-400 ml-auto">{formattedDate} ago</p>
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
          {isLiking ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div>
          ) : isLiked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
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
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full Notice"
              className="max-w-full max-h-full"
            />
            <button
              className="absolute top-2 right-2 text-white bg-primary p-2 rounded-full"
              onClick={closeModal}
            >
              <RxCross2 />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;

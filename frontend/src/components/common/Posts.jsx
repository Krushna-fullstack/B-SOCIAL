import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./../skeletons/PostSkeleton";
import Post from "./Post";

const Posts = ({ feedType, username }) => {
  const [isUploading, setIsUploading] = useState(false); // State for image upload loading

  // Determine the API endpoint based on the feed type
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/v1/posts/all";
      case "posts":
        return `/api/v1/posts/user/${username}`;
      default:
        return "/api/v1/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  // Fetch posts using React Query
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
  });

  // Refetch posts when feedType or username changes
  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    setIsUploading(true); // Show spinner
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload image to the server
      const response = await fetch("/api/v1/posts/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const result = await response.json();
      console.log("Image uploaded successfully:", result);

      // Refetch posts to update the list
      refetch();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false); // Hide spinner
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Show skeleton loading while fetching posts */}
      {(isLoading || isRefetching) && (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Show message if there are no posts */}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center">No Posts</p>
      )}

      {/* Render posts */}
      {!isLoading && !isRefetching && posts?.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onImageUpload={handleImageUpload}
            />
          ))}
        </div>
      )}

      {/* Show spinner while uploading image */}
      {isUploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default Posts;
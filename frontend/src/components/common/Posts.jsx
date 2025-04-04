import React from "react";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username }) => {
  const getPostEndpoint = () => {
    return feedType === "userPosts"
      ? `/api/v1/posts/user/${username}`
      : "/api/v1/posts/all";
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts", feedType, username],
    queryFn: async () => {
      try {
        const res = await fetch(getPostEndpoint());
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${res.status}`
          );
        }
        return await res.json();
      } catch (error) {
        console.error("Fetch error:", error);
        throw new Error(`Failed to load posts: ${error.message}`);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const allPosts = data?.posts || [];

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="flex flex-col gap-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {isError && (
        <div className="text-red-500 p-4 border border-red-300 rounded-lg mt-4">
          <p className="font-medium">Error loading posts:</p>
          <p className="text-sm mt-2">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && allPosts.length === 0 && (
        <div className="text-center py-8 text-gray-500">No posts found</div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {allPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Posts;

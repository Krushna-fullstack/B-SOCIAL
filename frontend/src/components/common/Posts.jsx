import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username }) => {
  const getPostEndpoint = () =>
    feedType === "userPosts"
      ? `/api/v1/posts/user/${username}`
      : "/api/v1/posts/all";

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts", feedType, username],
    queryFn: async () => {
      const res = await fetch(getPostEndpoint(), { credentials: "include" });
      const payload = await res.json();
      if (!res.ok)
        throw new Error(
          payload?.error || payload?.message || "Something went wrong!"
        );
      return payload;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  const allPosts = Array.isArray(data) ? data : data?.posts ?? data?.data ?? [];

  useEffect(() => {
    // optional explicit refetch; the queryKey change will already refetch automatically
    refetch();
  }, [feedType, username, refetch]);

  // current user is read by Post via `authUser` query; pass nothing extra here
  return (
    <div className="container mx-auto p-4">
      {(isLoading || isRefetching) && (
        <div className="flex flex-col gap-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {isError && (
        <div className="text-red-500 p-4 border border-red-300 rounded-lg mt-4">
          <p className="font-medium">Error loading posts:</p>
          <p className="text-sm mt-2">{error?.message ?? "Unknown error"}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm"
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

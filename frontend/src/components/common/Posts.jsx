import { useQuery } from "@tanstack/react-query";
import React from "react";
import PostSkeleton from "./../skeletons/PostSkeleton";
import Post from "./Post";

const Posts = () => {
  const {
    data: posts = [],
    isLoading,
    refetch,
    isRefetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/v1/posts/all");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
  });

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {(isLoading || isRefetching) && (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && !isRefetching && posts.length === 0 && <p>No Posts</p>}

      {!isLoading && !isRefetching && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

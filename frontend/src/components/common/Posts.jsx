import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import PostSkeleton from "./../skeletons/PostSkeleton";
import Post from "./Post";

const Posts = ({ feedType, username }) => {
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

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <div className="container mx-auto p-4">
      {(isLoading || isRefetching) && (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && !isRefetching && posts.length === 0 && (
        <p className="text-center">No Posts</p>
      )}

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

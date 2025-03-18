import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SyncLoader } from "react-spinners";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username }) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef(null);

  // Validate endpoints match your backend routes
 // In Posts component's getPostEndpoint function
const getPostEndpoint = () => {
  return feedType === "userPosts" 
    ? `/api/v1/posts/user/${username}`  // Note the plural 'posts'
    : "/api/v1/posts/all";
};

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["infinitePosts", feedType, username],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const endpoint = getPostEndpoint();
        const url = `${endpoint}?page=${pageParam}&limit=10`;
        
        const res = await fetch(url);
        
        // Check for HTML responses
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        return await res.json();
      } catch (error) {
        console.error("Fetch error:", error);
        throw new Error(`Failed to load posts: ${error.message}`);
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingMore) {
          setIsFetchingMore(true);
          fetchNextPage().finally(() => setIsFetchingMore(false));
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [fetchNextPage, hasNextPage, isFetchingMore]);

  const allPosts = data?.pages.flatMap((page) => page?.posts || []) || [];

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
        <div className="text-center py-8 text-gray-500">
          No posts found
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {allPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>

      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && <SyncLoader color="#3b82f6" size={10} />}
        {!hasNextPage && allPosts.length > 0 && (
          <div className="text-gray-400 text-sm mt-4">
            No more posts to show
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
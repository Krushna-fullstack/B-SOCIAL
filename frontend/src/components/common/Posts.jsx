import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SyncLoader } from "react-spinners";
import PostSkeleton from "../skeletons/PostSkeleton";
import Post from "./Post";

const Posts = ({ feedType, username }) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef(null);

  const getPostEndpoint = () => {
    return feedType === "posts"
      ? `/api/v1/posts/user/${username}`
      : "/api/v1/posts/all";
  };

  const POST_ENDPOINT = getPostEndpoint();

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
        const url = `${POST_ENDPOINT}?page=${pageParam}&limit=10`;

        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch posts");
        }

        const responseData = await res.json();
        if (!responseData || !Array.isArray(responseData.posts)) {
          console.error("Invalid API response format:", responseData);
          return { posts: [] };
        }

        return responseData;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.posts?.length > 0 ? allPages.length + 1 : undefined,
    staleTime: 0,
    initialData: { pages: [], pageParams: [] },
  });

  useEffect(() => {
    console.log("Data update:", data);
  }, [data]);

  useEffect(() => {
    if (feedType) {
      console.log("Refetching due to feedType change:", { feedType, username });
      refetch();
    }
  }, [feedType, username, refetch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);
          fetchNextPage()
            .then(() => setIsFetchingMore(false))
            .catch((err) => {
              console.error("Error fetching next page:", err);
              setIsFetchingMore(false);
            });
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => currentTarget && observer.unobserve(currentTarget);
  }, [fetchNextPage, isFetchingMore]);

  const allPosts = data?.pages.flatMap((page) => page?.posts || []);

  return (
    <div className="container mx-auto p-4">
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <SyncLoader color="#3b82f6" size={10} />
        </div>
      )}

      {isError && (
        <div className="text-red-500 p-4 border border-red-300 rounded">
          <p>Error: {error?.message || "Failed to load posts"}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 bg-red-100 text-red-800 px-4 py-1 rounded"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && allPosts.length === 0 && (
        <p className="text-center py-8">No Posts Available</p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {allPosts.map((post, index) =>
          post && post._id ? (
            <Post key={`${post._id}-${index}`} post={post} />
          ) : null
        )}
      </div>

      <div
        ref={observerTarget}
        className="h-20 flex items-center justify-center my-6 border-t pt-4"
      >
        {isFetchingNextPage && <SyncLoader color="#3b82f6" size={10} />}
        {!isFetchingNextPage && allPosts.length > 0 && (
          <div className="text-center text-gray-400">
            {hasNextPage ? "Scroll for more" : "You've seen all posts"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;

// import React, { useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import Post from "./Post";
// import PostSkeleton from "../skeletons/PostSkeleton";

// const Posts = ({ feedType, username }) => {
//   const getPostEndpoint = () =>
//     feedType === "userPosts"
//       ? `/api/v1/posts/user/${username}`
//       : "/api/v1/posts/all";

//   const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
//     queryKey: ["posts", feedType, username],
//     queryFn: async () => {
//       const res = await fetch(getPostEndpoint(), { credentials: "include" });
//       const payload = await res.json();
//       if (!res.ok)
//         throw new Error(
//           payload?.error || payload?.message || "Something went wrong!"
//         );
//       return payload;
//     },
//     keepPreviousData: true,
//     staleTime: 1000 * 60,
//   });

//   const allPosts = Array.isArray(data) ? data : data?.posts ?? data?.data ?? [];

//   useEffect(() => {
//     // optional explicit refetch; the queryKey change will already refetch automatically
//     refetch();
//   }, [feedType, username, refetch]);

//   // current user is read by Post via `authUser` query; pass nothing extra here
//   return (
//     <div className="container mx-auto p-4">
//       {(isLoading || isRefetching) && (
//         <div className="flex flex-col gap-4">
//           <PostSkeleton />
//           <PostSkeleton />
//           <PostSkeleton />
//         </div>
//       )}

//       {isError && (
//         <div className="text-red-500 p-4 border border-red-300 rounded-lg mt-4">
//           <p className="font-medium">Error loading posts:</p>
//           <p className="text-sm mt-2">{error?.message ?? "Unknown error"}</p>
//           <button
//             onClick={() => refetch()}
//             className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {!isLoading && !isError && allPosts.length === 0 && (
//         <div className="text-center py-8 text-gray-500">No posts found</div>
//       )}

//       <div className="grid grid-cols-1 gap-4">
//         {allPosts.map((post) => (
//           <Post key={post._id} post={post} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Posts;

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username }) => {
  const [debugInfo, setDebugInfo] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const getPostEndpoint = () => {
    if (feedType === "userPosts") {
      return `/api/v1/posts/user/${username}`;
    }
    return "/api/v1/posts/all";
  };

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts", feedType, username],
    queryFn: async () => {
      try {
        const endpoint = getPostEndpoint();
        setDebugInfo(`Fetching from: ${endpoint}`);

        // Add timestamp to avoid caching issues
        const url = `${endpoint}?t=${Date.now()}`;

        const res = await fetch(url, {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        });

        // Store the raw response for debugging
        const responseText = await res.text();
        setApiResponse(responseText);

        if (!res.ok) {
          throw new Error(
            `HTTP ${res.status}: ${responseText.substring(0, 100)}`
          );
        }

        // Try to parse the response
        let payload;
        try {
          payload = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(
            `Invalid JSON response: ${responseText.substring(0, 100)}`
          );
        }

        setDebugInfo(
          `Success: Received ${
            Array.isArray(payload) ? payload.length : "unknown"
          } items`
        );
        return payload;
      } catch (err) {
        setDebugInfo(`Error: ${err.message}`);
        throw err;
      }
    },
    keepPreviousData: true,
    staleTime: 1000 * 60,
    retry: 2,
  });

  // Handle different possible response structures
  const allPosts = React.useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    } else if (data.posts && Array.isArray(data.posts)) {
      return data.posts;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    console.warn("Unexpected data structure:", data);
    return [];
  }, [data]);

  useEffect(() => {
    refetch();
  }, [feedType, username, refetch]);

  // Test API directly (for debugging)
  const testApiDirectly = async () => {
    try {
      setDebugInfo("Testing API directly...");
      const response = await fetch(getPostEndpoint(), {
        credentials: "include",
      });
      const text = await response.text();
      setDebugInfo(
        `Direct API Test: ${response.status} - ${text.substring(0, 200)}`
      );
    } catch (err) {
      setDebugInfo(`Direct API Test Error: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Enhanced debug info */}
      <div className="mb-4 p-3 bg-gray-800 rounded text-xs text-white">
        <div className="font-bold mb-2">Debug Information:</div>
        <div>
          Status: {isLoading ? "Loading..." : isError ? "Error" : "Loaded"}
        </div>
        <div>Endpoint: {getPostEndpoint()}</div>
        <div>Debug: {debugInfo}</div>
        <div>Posts count: {allPosts.length}</div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => refetch()}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
          >
            Refetch
          </button>
          <button
            onClick={testApiDirectly}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white"
          >
            Test API Directly
          </button>
          <button
            onClick={() => {
              console.log("API Response:", apiResponse);
              console.log("Parsed Data:", data);
              console.log("All Posts:", allPosts);
            }}
            className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-white"
          >
            Log Details
          </button>
        </div>

        {isError && (
          <div className="mt-2 p-2 bg-red-900 rounded">
            Error: {error?.message}
          </div>
        )}
      </div>

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
          <div className="mt-4">
            <p className="text-sm">Possible issues:</p>
            <ul className="text-sm list-disc list-inside mt-1">
              <li>CORS configuration on server</li>
              <li>Authentication/session issues</li>
              <li>Network connectivity problems</li>
              <li>API endpoint not responding correctly</li>
            </ul>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && allPosts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No posts found
          {username && ` for @${username}`}
        </div>
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

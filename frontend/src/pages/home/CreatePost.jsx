import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import ShinyText from "../../ui-components/ShinyText";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch("/api/v1/posts/create", {
        method: "POST",
        body: JSON.stringify({ text, img }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      return data;
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
  
      // Get previous post data
      const previousPosts = queryClient.getQueryData(["posts"]);
  
      // Optimistically update cache
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return [newPost]; // If no data, just return the new post
        return [{ 
          ...newPost, 
          _id: Date.now().toString(), // Temporary ID until API response
          user: authUser,
          likes: [],
          comments: [],
          createdAt: new Date().toISOString()
        }, ...oldData]; // Prepend new post
      });
  
      return { previousPosts };
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      setText("");
      setImg(null);
      imgRef.current.value = null;
    
      // Ensure we are invalidating the correct query key
      queryClient.invalidateQueries({ queryKey: ["infinitePosts"] });
    },
    
    onError: (error, _, context) => {
      toast.error(error.message);
  
      // Rollback in case of an error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !img) return toast.error("Post content cannot be empty");
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center w-full px-4">
      <div className="w-full max-w-screen-md bg-secondary rounded-xl p-6">
        <div className="flex items-start gap-4 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            className="w-full h-12 p-1 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none focus:border-primary"
          />
        </div>

        {img && (
          <div className="relative mb-4">
            <IoCloseSharp
              className="absolute top-2 right-2 text-3xl text-white bg-red-600 rounded-full cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              alt="Selected"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div
            className="flex items-center gap-4"
            onClick={() => imgRef.current.click()}
          >
            <BsFillImageFill className="text-2xl text-primary cursor-pointer hover:text-primary-focus" />
            <input
              type="file"
              ref={imgRef}
              onChange={handleImgChange}
              hidden
              accept="image/*"
            />
            <ShinyText
              text="Add Media"
              disabled={false}
              speed={3}
              className="custom-class flex justify-center my-2"
            />
          </div>
          <button
            type="submit"
            className={`btn bg-primary rounded-full px-8 text-white transition-all text-lg ${
              isLoading ? "opacity-90 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Posting...
              </span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    mutate: createPost,
    isLoading,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch("/api/v1/posts/create", {
        method: "POST",
        body: JSON.stringify({ text, img }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      setText("");
      setImg(null);
      imgRef.current.value = null;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <div className="flex justify-center items-center mt-2">
      <div className="w-96 p-6 bg-secondary rounded-xl">
        <div className="flex items-start gap-4 mb-4">
          <Link to={`/profile/${authUser?.username}`}>
            {authUser?.profileImg ? (
              <img
                className="w-12 h-12 rounded-full object-cover border"
                src={authUser?.profileImg}
                alt="Profile"
              />
            ) : (
              <FaRegCircleUser className="w-12 h-12 rounded-full border text-gray-400" />
            )}
          </Link>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            className="w-full h-12 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {img && (
          <div className="relative mb-4">
            <IoCloseSharp
              className="absolute top-2 right-2 text-3xl text-red-700 cursor-pointer hover:text-primary-focus"
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
          <div className="flex items-center gap-4">
            <CiImageOn
              className="text-3xl text-primary cursor-pointer hover:text-primary-focus"
              onClick={() => imgRef.current.click()}
            />
            <input
              type="file"
              ref={imgRef}
              onChange={handleImgChange}
              hidden
              accept="image/*"
            />
            <span className="font-medium">Media</span>
          </div>
          <button
            type="submit"
            className={`btn bg-primary rounded-full px-8 text-white transition-all text-lg ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && (
          <div className="text-red-500 text-sm mt-2">{error.message}</div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;

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

  const {
    mutate: createPost,
    isLoading,
    isError,
    error,
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
    if (text.trim() || img) {
      createPost({ text, img });
    } else {
      toast.error("Post content cannot be empty.");
    }
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
            />{" "}
          </div>
          <button
            type="submit"
            className={`btn bg-primary rounded-full px-8 text-white transition-all text-lg ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && (
          <div className="text-red-500 text-sm mt-2">
            {error.message || "Something went wrong."}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;

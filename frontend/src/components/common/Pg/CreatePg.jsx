import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePg = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [contact, setContact] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const queryClient = useQueryClient();

  const {
    mutate: createPg,
    isLoading,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async ({
      name,
      location,
      description,
      pricePerMonth,
      contact,
      img,
    }) => {
      const res = await fetch("/api/v1/pg/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          location,
          description,
          pricePerMonth,
          contact,
          img,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("PG created successfully");

      setName("");
      setLocation("");
      setDescription("");
      setPricePerMonth("");
      setContact("");
      setImg(null);
      imgRef.current.value = null;

      queryClient.invalidateQueries({ queryKey: ["pgs"] });
    },
  });

  // Handle image upload
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPg({ name, location, description, pricePerMonth, contact, img });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full space-y-6"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Create New PG
        </h2>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-gray-700">Name</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered input-primary w-full focus:outline-none focus:ring focus:ring-primary-focus"
            placeholder="Enter PG name"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-gray-700">Location</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input input-bordered input-primary w-full focus:outline-none focus:ring focus:ring-primary-focus"
            placeholder="Enter location"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-gray-700">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered textarea-primary w-full focus:outline-none focus:ring focus:ring-primary-focus"
            placeholder="Enter description"
            required
          ></textarea>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-gray-700">Price Per Month</span>
          </label>
          <input
            type="number"
            value={pricePerMonth}
            onChange={(e) => setPricePerMonth(e.target.value)}
            className="input input-bordered input-primary w-full focus:outline-none focus:ring focus:ring-primary-focus"
            placeholder="Enter price per month"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-gray-700">Contact</span>
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="input input-bordered input-primary w-full focus:outline-none focus:ring focus:ring-primary-focus"
            placeholder="Enter contact details"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-gray-700">Image</span>
          </label>
          <input
            type="file"
            ref={imgRef}
            onChange={handleImgChange}
            className="file-input file-input-bordered file-input-primary w-full focus:outline-none focus:ring focus:ring-primary-focus"
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full mt-6 ${
            isPending ? "loading" : ""
          }`}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create PG"}
        </button>
      </form>
    </div>
  );
};

export default CreatePg;

import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePg = () => {
  // State variables for form inputs
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [contact, setContact] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  // Initialize Query Client for managing queries
  const queryClient = useQueryClient();

  // Mutation function to create a new PG
  const createPgMutation = useMutation({
    mutationFn: async ({}) => {
      const res = await fetch("/api/v1/pg/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pgData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("PG created successfully!");
      queryClient.invalidateQueries(["pgs"]); // Invalidate and refetch queries related to PGs
      // Reset form after successful submission
      setName("");
      setLocation("");
      setDescription("");
      setPricePerMonth("");
      setContact("");
      setImg(null);
      imgRef.current.value = ""; // Reset the file input
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    createPgMutation.mutate({
      name,
      location,
      description,
      pricePerMonth,
      contact,
      img,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create a New PG</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">PG Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter PG name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price per Month</span>
            </label>
            <input
              type="number"
              placeholder="Enter price per month"
              value={pricePerMonth}
              onChange={(e) => setPricePerMonth(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Contact</span>
            </label>
            <input
              type="text"
              placeholder="Enter contact number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Image</span>
            </label>
            <input
              type="file"
              ref={imgRef}
              onChange={handleImgChange}
              className="file-input file-input-bordered w-full"
              accept="image/*"
            />
          </div>
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${
                createPgMutation.isLoading ? "loading" : ""
              }`}
              disabled={createPgMutation.isLoading}
            >
              {createPgMutation.isLoading ? "Creating..." : "Create PG"}
            </button>
          </div>
          {createPgMutation.isError && (
            <div className="mt-4 text-red-500 text-sm">
              {createPgMutation.error.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePg;

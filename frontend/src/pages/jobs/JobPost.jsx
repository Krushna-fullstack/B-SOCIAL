import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const JobPost = ({ job, title, location, eligibility, applyLink }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("Job prop:", job);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: deleteJob, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/jobs/${job._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteJob = () => {
    deleteJob();
  };

  return (
    <div className="bg-black">
      <div className="max-w-sm mx-auto bg-primary text-white shadow-lg rounded-lg overflow-hidden my-2">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
          <p className="text-white mb-4">
            <span className="font-medium">Location: {location}</span>
          </p>
          <p className="text-white mb-4">
            <span className="font-medium">Eligibility: {eligibility}</span>
          </p>
          <button
            className="btn btn-wide mx-auto block bg-secondary text-white font-semibold px-4 py-2 rounded transition-all"
            onClick={handleOpenModal}
          >
            Apply
          </button>

          {authUser?.isAdmin === true ? (
            <button
              className="btn btn-wide mx-auto block border-none bg-red-600 text-white font-semibold px-4 py-2 rounded transition-all mt-4"
              onClick={handleDeleteJob}
            >
              Delete Job
            </button>
          ) : null}

          {/* Modal */}
          {isOpen && (
            <dialog className="modal" open>
              <div className="modal-box bg-secondary">
                <form method="dialog">
                  {/* Button to close the modal */}
                  <button
                    className="btn btn-sm bg-red-600 btn-circle btn-ghost absolute right-2 top-2 mx-2 my-2"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">
                  Click on the button below to redirect to the application page.
                </p>
                <a
                  className="bg-primary text-white font-semibold px-4 py-2 rounded transition-all mx-auto block text-center w-32"
                  href={applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                </a>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPost;

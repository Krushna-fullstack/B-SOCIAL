import React from "react";
import CreateNotice from "./CreateNotice";
import Notice from "./Notice"; // Import the new Notice component
import { useQuery } from "@tanstack/react-query";

const Notices = () => {
  const {
    data: notices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const res = await fetch("/api/v1/notices");
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      return res.json();
    },
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading notices.</div>;

  return (
    <div className="p-4 bg-base-100 rounded-lg shadow-lg">
      <CreateNotice />
      <div>
        {notices ? (
          notices.map((notice) => <Notice key={notice._id} notice={notice} />)
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Notices;

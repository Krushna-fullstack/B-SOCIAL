import React from "react";
import CreateNotice from "./CreateNotice";
import Notice from "./Notice";
import { useQuery } from "@tanstack/react-query";

const Notices = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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
      <h1 className="text-white my-3 mt-3 font-medium text-4xl flex justify-center">
        Notices
      </h1>
      <h1 className="flex justify-center text-gray-500 my-2">(Admins Only)</h1>
      {authUser && authUser.isAdmin === true && <CreateNotice />}
      <div className="mt-5">
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

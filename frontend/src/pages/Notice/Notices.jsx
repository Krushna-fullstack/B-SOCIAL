import React from "react";
import CreateNotice from "./CreateNotice";
import Notice from "./Notice";
import { useQuery } from "@tanstack/react-query";
import ShinyText from "../../ui-components/ShinyText";
import GradientText from "../../ui-components/GradiantText";

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
      <ShinyText
        text="Notices"
        disabled={false}
        speed={3}
        className="custom-class mt-3 flex justify-center text-5xl font-bold text-center my-4"
      />
      <GradientText
        colors={["#a78bfa", "#ec4899", "#dc2626"]} // Gradient colors
        animationSpeed={3} // Custom animation speed in seconds
        showBorder={false} // Show or hide border
        className="custom-class flex justify-center my-2" // Add one or more custom classes
      >
        ( Admins Only )
      </GradientText>

      <hr className="w-full max-w-sm border-t border-gray-300 my-4" />

      {/* <h1 className="flex justify-center text-gray-500 my-2">(Admins Only)</h1> */}
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

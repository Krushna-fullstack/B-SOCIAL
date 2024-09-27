import React from "react";
import ResourceCard from "./../../ResourceCard";

const PsychologyHons = () => {
  return (
    <div>
      <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
        <div className="w-full lg:w-3/4">
          <ResourceCard
            department="Psychology Honours"
            stream="Arts"
            link="/phychologyyears"
          />
        </div>
      </div>
    </div>
  );
};

export default PsychologyHons;

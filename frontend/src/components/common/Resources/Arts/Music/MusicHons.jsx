import React from "react";
import ResourceCard from "./../../ResourceCard";

const MusicHons = () => {
  return (
    <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
      <div className="w-full lg:w-3/4">
        <ResourceCard
          department="Music Honours"
          stream="Arts"
          link="/musicyears"
        />
      </div>
    </div>
  );
};

export default MusicHons;

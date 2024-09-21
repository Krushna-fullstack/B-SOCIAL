import React from "react";
import ResourceCard from "./../../ResourceCard";

const GeographyHons = () => {
  return (
    <div>
      <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
        <div className="w-full lg:w-3/4">
          <ResourceCard
            department="Geography Honours"
            stream="Arts"
            link="/geographyyears"
          />
        </div>
      </div>
    </div>
  );
};

export default GeographyHons;

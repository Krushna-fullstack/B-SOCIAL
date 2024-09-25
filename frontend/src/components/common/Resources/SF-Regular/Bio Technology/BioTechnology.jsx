import React from "react";
import ResourceCard from "../../ResourceCard";

const BioTechnology = () => {
  return (
    <div>
      <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
        <div className="w-full lg:w-3/4">
          <ResourceCard department="Bio Technology" stream="Science" link="/biotechnologyyears" />
        </div>
      </div>
    </div>
  );
};

export default BioTechnology;

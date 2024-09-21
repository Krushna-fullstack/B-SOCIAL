import React from "react";
import ResourceCard from "./../../ResourceCard"; 

const AnthropolgyHons = () => {
  return (
    <div>
      <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
        <div className="w-full lg:w-3/4">
          <ResourceCard
            department="Anthropology Honours"
            stream="Arts"
            link="/anthropologyyears"
          />
        </div>
      </div>


    </div>
  );
};

export default AnthropolgyHons;

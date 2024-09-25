import React from "react";
import ResourceCard from "../../ResourceCard";

const ArtsSyllabus = () => {
  return (
    <div>
      <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
        <div className="w-full lg:w-3/4">
          <ResourceCard
            department="Syllabus"
            stream="Arts"
            link="https:/facebook.com"
          />
        </div>
      </div>
    </div>
  );
};

export default ArtsSyllabus;

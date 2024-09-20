import React from "react";
import ResourceCard from "../ResourceCard";

const GeographyHons = () => {
  return (
    <div>
      <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 ">
        {/* Make the card take up a larger portion of the width */}
        <div className="w-full lg:w-3/4">
          <ResourceCard
            department="Geography Honours"
            year="1st Year"
            link="https://example.com"
          />
        </div>
      </div>
      <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 ">
        {/* Make the card take up a larger portion of the width */}
        <div className="w-full lg:w-3/4">
          <ResourceCard
            department="Geography Honours"
            year="2nd Year"
            link="https://example.com"
          />
        </div>
      </div>
      <div className="w-96 flex justify-center items-center bg-gradient-to-b p-4 ">
      {/* Make the card take up a larger portion of the width */}
      <div className="w-full lg:w-3/4">
        <ResourceCard
          department="Geography Honours"
          year="3rd Year"
          link="https://example.com"
        />
      </div>
    </div>
    </div>
  );
};

export default GeographyHons;

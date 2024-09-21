import React from "react";
import ResourceCard from "./../../ResourceCard";

const EnglishHons = () => {
  return (
    <div>
      <div className="md:w-max w-96 flex justify-center items-center bg-gradient-to-b p-4">
        <div className="w-full lg:w-3/4">
          <ResourceCard
            department="English Honours"
            stream="Arts"
            link="/englishyears" // Link to the AnthropologyYears page
          />
        </div>
      </div>
    </div>
  );
};

export default EnglishHons;
